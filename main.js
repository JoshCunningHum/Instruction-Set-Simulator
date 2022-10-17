// modify specs here
const instructionSetSize = 5; // 32 is 2^5

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
    const T = new Register({
        name: "T",
        address: "NULL",
        size: 1
    })

    // General registers
    const X = new Register({
        name: "X",
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

    const R3 = new Register({
        name: "R3",
        address: "11",
        size: 8
    })


    // create instruction sets here
    new Instruction("NOP", function(){
        // do nothing
    })

    new Instruction("SAVE", function(){
        MEM.setD(Register.get(this.op[1]).val, parseInt(this.op[0]));
    }, `A2-1[MA]`)

    new Instruction("PUTS", function(){
        Register.get(this.op[0]).valD = parseInt(this.op[1]);
    }, `A1-2[MS]`)

    new Instruction("LOAD", function(){
        Register.get(this.op[0]).val = MEM.getD(parseInt(this.op[1]));
    }, `A1-2[MA]`)

    new Instruction("COPY", function(){
        Register.get(this.op[0]).val = Register.get(this.op[1]);
    }, `A12-`)

    new Instruction("GOTO", function(){
        PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("TJMP", function(){
        // console.log(T.valD);
        if(T.valD) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("FJMP", function(){
        if(!T.valD) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("AND", function(){
        const D = Register.get(this.op[0]),
              S = Register.get(this.op[1]);

        D.val = Utils.AND(D.val, S.val);
    }, `A12-`)

    new Instruction("OR", function(){
        const D = Register.get(this.op[0]),
              S = Register.get(this.op[1]);

        D.val = Utils.OR(D.val, S.val);
    }, `A12-`)

    new Instruction("XOR", function(){
        const D = Register.get(this.op[0]),
              S = Register.get(this.op[1]);

        D.val = Utils.XOR(D.val, S.val);
    }, `A12-`)

    new Instruction("ADD", function(){
        const D = Register.get(this.op[0]),
              S = Register.get(this.op[1]);

        D.valD += S.valD;
    }, `A12-`)

    new Instruction("SUB", function(){
        const D = Register.get(this.op[0]),
              S = Register.get(this.op[1]);

        D.valD -= S.valD;
    }, `A12-`)

    new Instruction("INV", function(){
        const R = Register.get(this.op[0]);
        R.val = Utils.NOT(R.val);
    }, `A1-`)

    new Instruction("TEST", function(){
        // compare register to X, with choosen modes
        const R = Register.get(this.op[0]),
              mode = this.op[1];

        let result = false;

        switch(mode){
            case "0": // R == X
                if(R.valD == X.valD) result = true;
                break;
            case "1": // R < X
                if(R.valD < X.valD) result = true;
                break;
            case "2": // R > X
                if(R.valD > X.valD) result = true;
                break;
            case "3":
                if(R.valD != X.valD) result = true;
                break;
        }

        T.valD = result ? 1 : 0;
        console.log(T.valD);
    }, `A12-`)

    new Instruction("SHIFTR", function(){
        const R = Register.get(this.op[0]);

        R.val = "0" + R.val.slice(0, -1);
    }, `A1-`)

    new Instruction("SHIFTL", function(){
        const R = Register.get(this.op[0]);

        R.val = R.val.slice(1) + "0";
    }, `A1-`)

    new Instruction("INCR", function(){
        Register.get(this.op[0]).valD++;
    }, `A1-`)

    new Instruction("DECR", function(){
        Register.get(this.op[0]).valD--;
    }, `A1-`);

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
    gen_Memory();

    // boot the computer beytch
    Computer.init();
    Computer.run_state = false;
}