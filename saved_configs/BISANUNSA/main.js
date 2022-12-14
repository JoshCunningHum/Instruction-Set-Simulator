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

(function () {

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
    new Instruction("NOP", function () {
        // do nothing
    })

    new Instruction("SAVE", function () {
        MEM.setD(Register.get(this.op[1]).val, parseInt(this.op[0]));
    }, `A2-1[MA]`)

    new Instruction("PUTS", function () {
        Register.get(this.op[0]).valD = parseInt(this.op[1]);
    }, `A1-2[MS]`)

    new Instruction("LOAD", function () {
        Register.get(this.op[0]).val = MEM.getD(parseInt(this.op[1]));
    }, `A1-2[MA]`)

    new Instruction("COPY", function () {
        Register.get(this.op[0]).val = Register.get(this.op[1]).val;
    }, `A12-`)

    new Instruction("GOTO", function () {
        PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("TJMP", function () {
        // console.log(T.valD);
        if (T.valD) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("FJMP", function () {
        if (!T.valD) PC.valD = parseInt(this.op[0]);
    }, `A-1[MA]`)

    new Instruction("AND", function () {
        const D = Register.get(this.op[0]),
            S = Register.get(this.op[1]);

        D.val = Utils.AND(D.val, S.val);
    }, `A12-`)

    new Instruction("OR", function () {
        const D = Register.get(this.op[0]),
            S = Register.get(this.op[1]);

        D.val = Utils.OR(D.val, S.val);
    }, `A12-`)

    new Instruction("XOR", function () {
        const D = Register.get(this.op[0]),
            S = Register.get(this.op[1]);

        D.val = Utils.XOR(D.val, S.val);
    }, `A12-`)

    new Instruction("ADD", function () {
        const D = Register.get(this.op[0]),
            S = Register.get(this.op[1]);

        D.valD += S.valD;
    }, `A12-`)

    new Instruction("SUB", function () {
        const D = Register.get(this.op[0]),
            S = Register.get(this.op[1]);

        D.valD -= S.valD;
    }, `A12-`)

    new Instruction("INV", function () {
        const R = Register.get(this.op[0]);
        R.val = Utils.NOT(R.val);
    }, `A1-`)

    new Instruction("TEST", function () {
        // compare register to X, with choosen modes
        const R = Register.get(this.op[0]),
            mode = this.op[1];

        let result = false;

        switch (mode) {
            case "0": // R == X
                if (R.valD == X.valD) result = true;
                break;
            case "1": // R < X
                if (R.valD < X.valD) result = true;
                break;
            case "2": // R > X
                if (R.valD > X.valD) result = true;
                break;
            case "3":
                if (R.valD != X.valD) result = true;
                break;
        }

        T.valD = result ? 1 : 0;
    }, `A12-`)

    new Instruction("SHIFTR", function () {
        const R = Register.get(this.op[0]);

        R.val = "0" + R.val.slice(0, -1);
    }, `A1-`)

    new Instruction("SHIFTL", function () {
        const R = Register.get(this.op[0]);

        R.val = R.val.slice(1) + "0";
    }, `A1-`)

    new Instruction("INCR", function () {
        Register.get(this.op[0]).valD++;
    }, `A1-`)

    new Instruction("DECR", function () {
        Register.get(this.op[0]).valD--;
    }, `A1-`);

    new Instruction("ABS", function() {
        const REG = Register.get(this.op[0]);
        REG.valD = Math.abs(REG.valD);
    }, `A1-`)

    new Instruction("COMPL", function() {
        const REG = Register.get(this.op[0]);
        REG.valD *= -1;
    }, `A1-`)

    _init();
})();

function _init() {
    const register_cont = document.querySelector("#register_cont");

    // load registers
    for (const r of Register.instances) {

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

function dev_genArduinoROM() {
    return Computer.code.map((e, i) => {
        const args = e.split(" ");

        return `ROM[${i}] = 0b${Instruction[args[0]].getMCBIN(...args.slice(1))};`;
    }).join("\n");
}

function dev_listInstruction() {
    return Instruction.set.map((e, i) => {
        return `${e.key} - ${e.address} (${i})`;
    }).join("\n");
}