class Instruction{
    static set = [];

    op = [];

    constructor(
        key,
        func,
        mcFormat
    ){
        this.key = key;
        this.func = func;
        this.mcFormat = mcFormat || "A1-32";

        // TODO: Better counting mechanism (just create a static counter flag dugh)
        this.address = Utils.padd(Utils.dec2Bin(Instruction.set.length), instructionSetSize);

        Instruction[key] = this;
        Instruction.set.push(this);
    }

    run(...operand){
        this.op = [...operand];
        this.func.bind(this)();
    }

    getMC(...operand){
        let count = 0;
        this.op = [...operand];
        // based on machine code format on this instruction
        let res = this.mcFormat.replace("MA", MEM.memSizeBits).replace("MS", MEM.ramBit);
        // loop through operands
        for(let i = 0; i < 3; i++){
            const val = this.op[i];

            if(!val){

                // delete occurance if no value
                res = res.replace(`${i + 1}`, "");
                // console.log(`${i + 1}: NO VALUE`);
                continue;
                
            }else if(!Utils.isNum(val)){

                // for registers
                res = res.replace(`${i + 1}`, `<span class="op_${i + 1}">${Register.get(val).address}</span>`);
                // console.log(`${i + 1}: REG : ${val}`);
                count += Register.get(val).address.length;
                continue;

            }else if(!val.length) continue;
            // check if there's a constant length
            const constLength = new RegExp(`${i + 1}\\[\\d+\\]`, 'g'),
                  match = constLength.exec(res);

            // convert values into binary, default is 2^n
            let log = (val > 0) ? Math.ceil(Math.log2(parseInt(val))) : 2;
            if(log < 2) log = 2;
            if(match){
                log = parseInt(match[0].slice(2, -1))
                res = res.replace(match[0].slice(1), "");
            }
            let repl = Utils.padd(Utils.dec2Bin(parseInt(val)), log);
            // console.log(`${i + 1}: VAL : ${repl} : LOG : ${log}`);
            res = res.replace( `${i + 1}`, `<span class="op_${i + 1}">${repl}</span>`);
            count += repl.length;

        }
        res = res.replace("A", `<span class="opcode">${this.address}</span>`);
        count += 5;
        // add "0" to remaining
        let diff = MEM.romBit - count;
        if(diff < 0) diff = 0;
        // console.log("DIFF: ", diff);
        res = res.replace("-", `<span class="filler">${"0".repeat(diff)}</span>`);
        return `${res}`;
    }
}