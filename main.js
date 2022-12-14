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
    const A = new Register({
        name: "A",
        address: "00",
        size: 8
    })
    
    const R1 = new Register({
        name: "R1",
        address: "01",
        size: 8
    })
    
    const R2 = new Register({
        name: "R2",
        address: "10",
        size: 8
    })


    // create instruction sets here
    new Instruction("RSET", function(){
        Register.get(this.op[0]).valD = 0;
    })

    new Instruction("SNDR", function(){
        MEM.setD(Register.get(this.op[1]).val, parseInt(this.op[0]));
    }, `A-1[MA]`)

    new Instruction("RECR", function(){
        Register.get(this.op[0]).val = MEM.getD(parseInt(this.op[1]));
    }, `A-1[MA]`)

    new Instruction("MOVR", function(){
        Register.get(this.op[0]).val = Register.get(this.op[1]).val;
    })

    new Instruction("MOVI", function(){
        Register.get(this.op[0]).valD = parseInt(this.op[1]);
    })

    new Instruction("GOTO", function(){
        PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("TRVZ", function(){
        if(Z.val == 1) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("TVNZ", function(){
        if(Z.val == 0)  PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("TRVC", function(){
        // AC = AC + R, then if AC == 0, Z = 1 else Z = 0
        AC.valD += R.valD;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("TVNC", function(){
        // AC = AC - R, then if AC == 0, Z = 1 else Z = 0
        AC.valD -= R.valD;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("TRVE", function(){
        // AC = AC + 1, then if AC == 0, Z = 1 else Z = 0
        AC.valD++;
        Z.val = (AC.valD == 0) ? 1 : 0;
    })

    new Instruction("NOP", function(){
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