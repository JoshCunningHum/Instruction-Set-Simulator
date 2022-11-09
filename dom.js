// DOM Manipulation
function gen_Memory(memSize, ramSize, romSize){
    const memorySize = parseInt(document.querySelector("#spec_MEM_Size").value),
          ramBitSize = parseInt(document.querySelector("#spec_MEM_RamBit").value),
          romBitSize = parseInt(document.querySelector("#spec_MEM_RomBit").value);

    memSize ??= memorySize;
    ramSize ??= ramBitSize;
    romSize ??= romBitSize;

    const memBitSize = Math.log2(memSize);

    const v = document.querySelector("#visualizer_cont");

    v.innerHTML = "";

    for(let i = 0; i < memSize; i++){
        const slot = document.createElement("div");
        slot.classList.add("MEM_SLOT")
        slot.dataset.address = Utils.padd(Utils.dec2Bin(i), Math.log2(memSize));
        slot.innerHTML = `<div>${Utils.padd(`${i}`, memSize.toString().length)} - ${Utils.padd(Utils.dec2Bin(i), memBitSize)}</div><div>${"0".repeat(ramSize)}</div>`
        v.append(slot);
    }

    // initialize MEM
    MEM.init(memSize, ramSize, romSize);
}

var clock_interval;

function auto_run(delay = 100){
    clearInterval(clock_interval);

    clock_interval = setInterval(() => {
        Computer.next_cycle();
    }, delay);
}

function stop_auto_run(){
    clearInterval(clock_interval);
}