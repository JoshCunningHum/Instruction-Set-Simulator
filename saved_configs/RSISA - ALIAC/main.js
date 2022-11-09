// modify specs here
const config = {
    opcodeWidth: 5, // 32 is 2^5
    sup_neg_num: true, // support negative numbers (reserves the left most bit as sign and uses the 2's compliment system)
    default_mem: { // default memory
        size: 2 ** 8, // 2 ^ 8 = 256
        rom_size_per_address: 16,
        ram_size_per_address: 8
    }
};

(function(){

    // IMPORTANT REGISTERS. DO NOT DELETE
    const PC = new Register({
        name: "PC",
        address: "NULL",
        size: 8
    })

    const AR = new Register({
        name: "AR",
        address: "NULL",
        size: 8
    })

    // Internal registers. no address
    const Z = new Register({
        name: "Z",
        address: "NULL",
        size: 1
    })

    // General registers
    const AC = new Register({
        name: "AC",
        address: "00",
        size: 8
    })
    
    const R = new Register({
        name: "R",
        address: "01",
        size: 8
    })


    // create instruction sets here
    new Instruction("NOP", function(){
        // do nothing
    })

    new Instruction("LDAC", function(){
        // set AC register value to value at memory address
        AC.val = MEM.getD(parseInt(this.op[0]));
    }, `A-1[MA]`)

    new Instruction("STAC", function(){
        // set value at memory address to ac value
        MEM.setD(AC.val, parseInt(this.op[0]));
    }, `A-1[MA]`)

    new Instruction("MVAC", function(){
        // move value of AC to R
        R.val = AC.val;
    })

    new Instruction("MOVR", function(){
        // move value of R to AC
        AC.val = R.val;
    })

    new Instruction("JUMP", function(){
        // set pc value to the memory address provided
        PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("JMPZ", function(){
        // if Z = 1 THEN GOTO memory address
        if(Z.valD == 1) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("JPNZ", function(){
        // if Z = 0 THEN GOTO memory address
        if(Z.valD == 0) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("ADD", function(){
        // AC = AC + R, then if AC == 0, Z = 1 else Z = 0
        AC.valD += R.valD;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("SUB", function(){
        // AC = AC - R, then if AC == 0, Z = 1 else Z = 0
        AC.valD -= R.valD;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("INAC", function(){
        // AC = AC + 1, then if AC == 0, Z = 1 else Z = 0
        AC.valD++;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("CLAC", function(){
        // AC = 0, Z = 1
        AC.valD = 0;
        Z.val = 1;
    })

    new Instruction("AND", function(){
        // AC = AC ^ R, then if AC == 0, Z = 1 else Z = 0
        AC.val = Utils.AND(AC.val, R.val);
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("OR", function(){
        // AC = AC V R, then if AC == 0, Z = 1 else Z = 0
        AC.val = Utils.OR(AC.val, R.val);
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("XOR", function(){
        // AC = AC xor R, then if AC == 0, Z = 1 else Z = 0
        AC.val = Utils.XOR(AC.val, R.val);
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("NOT", function(){
        // AC = AC`, then if AC == 0, Z = 1 else Z = 0
        AC.val = Utils.NOT(AC.val);
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    _init();
})();

function _init(){
    const register_cont = document.querySelector("#register_cont");

    // load registers
    for(const r of Register.instances){

        const rSlot = document.createElement("div");

        rSlot.innerHTML = `<label>${r.name}</label><div>0</div>`;
        rSlot.classList.add("reg");

        r.addBinds(rSlot.children[1]);

        register_cont.append(rSlot);
    }

    // generate memory
    
    document.querySelector("#spec_MEM_Size").value = config.default_mem.size,
    document.querySelector("#spec_MEM_RamBit").value = config.default_mem.ram_size_per_address,
    document.querySelector("#spec_MEM_RomBit").value = config.default_mem.rom_size_per_address;

    gen_Memory();

    // boot the computer beytch
    Computer.init();
    Computer.run_state = false;
}