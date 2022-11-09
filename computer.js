const Computer = {
    // manages cycles, has the default AR and PC Register
    registers: [],
    instructions: [],
    AR: null, // Address Register
    PC: null, // Program Counter Register
    code: [],
    variables: [],
    markers: [],
    first_cycle: false,
    
    init: function (){
        this.registers = Register.instances;
        this.instructions = Instruction.instances;

        this.AR = Register.get("AC");
        this.PC = Register.get("PC");
    },

    // converts the assembly code into "Machine Code" and enables cycle control
    compile: function(){
        // Reset register and memory
        this.registers.forEach(e => e.reset());
        MEM.reset();

        let assembly_code = document.querySelector("#code_input").value.trim().split("\n").filter(e => {
            if(e == " ") return false;
            else return true;
        });
        if(assembly_code.length == 1 && assembly_code[0] == " ") return;

        // TODO: Converting markers
        this.markers.length = 0;
        let offset = 0;
        assembly_code = assembly_code.map((e, i) => {
            let arg = e.split(" ");
            // check if it is a marker
            if(arg[0][arg[0].length - 1] == ":"){
                this.markers.push(`${arg}-${i - offset}`);
                offset++;
                return "";
            }
            // check if argument contains marker
            arg = arg.map(ar => {
                let index = this.markers.findIndex(marker => marker.split("-")[0] == ar);
                if(index == -1) return ar;
                return this.markers[index].split("-")[1];
            })
            return arg.join(" ");
        })

        // check all arguments if marker
        assembly_code = assembly_code.map((e, i) => {
            let arg = e.split(" ");
            arg = arg.map(ar => {
                let index = this.markers.findIndex(marker => marker.split("-")[0] == ar);
                if(index == -1) return ar;
                return this.markers[index].split("-")[1];
            })
            return arg.join(" ");
        })

        // clean marker purge
        assembly_code = assembly_code.filter(e => {
            if(e == " " || e == "") return false;
            else return true;
        })

        // TODO: Allocation of Variables
        this.variables.length = 0;
        assembly_code = assembly_code.map(e => {
            let isOPCODE = true;
            return e.split(" ").map(arg => {
                // skip operands that are numbers
                if(Utils.isNum(arg)) return arg;
                // and instructions
                if(isOPCODE){
                    isOPCODE = false;
                    return arg;
                }
                // and registers
                if(Register.instances.some(reg => reg.name == arg)) return arg;
                // if operand is already allocated as variable
                if(this.variables.find(vars => vars == arg)){
                    const var_index = this.variables.findIndex(vars => vars == arg);
                    // change radi if needed
                    return var_index;
                } 
                // if operand is not equal to Register and is not yet allocated then replace with memory ram address
                this.variables.push(arg);
                return this.variables.length - 1;
            }).join(" ");
        })

        // add variable names beside the address
        this.variables.forEach( (e, i)=> {
            document.querySelector(`.MEM_SLOT[data-address="${Utils.padd(Utils.dec2Bin(i), MEM.memSizeBits)}"]`).children[0].innerHTML += ` (${e})`;
        })


        // convert into "machine code" and set output (visuals only)
        document.querySelector("#machine_code_cont").innerHTML = assembly_code.map((e, i) => {
            const args = e.split(" ");
            let res = "";

            console.log(args);

            res += `<div class="instruction" data-address="${Utils.padd(Utils.dec2Bin(i), MEM.memSizeBits)}"><span><span class="lineNum">${i}:</span> ${args.join(" ")}</span> <span>${Instruction[args[0]].getMC(...args.slice(1))}</span></div>`;

            // TODO: Operand Conversion (registers, addresses, and data alike)

            return res;
        }).join("");

        this.code = assembly_code;
        this.first_cycle = true;

        document.querySelector("#machine_code_button").click();
    },

    // Next cycle
    next_cycle: function(){
        // first fetch cycle
        document.querySelectorAll(".instruction.highlight").forEach(e => e.classList.remove("highlight"));


        Register.AR.val = Register.PC.val;
        if(Register.get("AR").valD >= this.code.length){
            stop_auto_run();
            return;
        }

        // second fetch cycle
        const codeIndex = Register.get("AR").valD,
              exp = this.code[codeIndex].split(" ");
            
        Register.PC.valD++;

        // third fetch cycle or Decode
        Instruction[exp[0]].run(...(exp.slice(1)));

        // TODO: highlight instruction at address AR
        let current_instruction = document.querySelector(`.instruction[data-address="${Register.AR.val}"`); 
        current_instruction.classList.add("highlight");
        
        this.first_cycle = false;
    }
};

// Data Binding
Object.defineProperty(Computer, "run_state", {
    get(){
        return document.querySelectorAll(".control_buttons")[1].disabled;
    },

    set(value){
        // get buttons
        const btns = document.querySelectorAll(".control_buttons");

        btns.forEach(btn => {
            btn.disabled = (btn.innerHTML == "START") ? value : !value;
        })

        if(value){
            Computer.compile();
        }else{
            stop_auto_run();
        }
    }
});