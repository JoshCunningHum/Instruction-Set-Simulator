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
        return this.data.get(Utils.dec2BinP(address, this.memSizeBits));
    },
    setD: function(value, address){
        this.set(value, Utils.padd(Utils.dec2Bin(address), this.memSizeBits));
    },
    set: function(value, address){
        this.data.set(address, value);

        // configure dom
        const slotDOM = document.querySelector(`div.MEM_SLOT[data-address="${address}"]`);
        let dcVal = value;
        if(config.sup_neg_num && value[0] == "1" && value.length > 1)
            dcVal = -Utils.bin2Dec(Utils.comp(value));
        else
            dcVal = Utils.bin2Dec(value);
        slotDOM.children[1].innerHTML = `(${dcVal}) ${value}`;
    },
    reset: function(){
        gen_Memory();
    }
}