const MEM = {
    rom: new Map(),
    data: new Map(),
    init: function(memSize, ramBit, romBit) {
        this.memSize = memSize;
        this.memSizeBits = Math.log2(memSize);
        this.ramBit = ramBit;
        this.romBit = romBit;

        this.data.clear();
        this.rom.clear();
        // initialize map
        for(let i = 0; i < memSize; i++){
            this.data.set(Utils.padd(Utils.dec2Bin(i), this.memSizeBits), "0".repeat(ramBit));
            this.rom.set(Utils.padd(Utils.dec2Bin(i), this.memSizeBits), "0".repeat(romBit));
        }
    },
    get: function(address){
        return this.data.get(address);
    },
    getD: function(address){
        return this.data.get(Utils.padd(Utils.dec2Bin(address), this.memSizeBits));
    },
    setD: function(value, address){
        this.set(value, Utils.padd(Utils.dec2Bin(address), this.memSizeBits));
    },
    set: function(value, address){
        this.data.set(address, value);

        // configure dom
        const slotDOM = document.querySelector(`div.MEM_SLOT[data-address="${address}"]`);
        slotDOM.children[1].innerHTML = `${value} (${Utils.bin2Dec(value)})`;
    },
    reset: function(){
        gen_Memory();
    }
}