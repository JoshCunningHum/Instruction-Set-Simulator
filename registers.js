class Register{
    static instances = [];

    outputs = [];
    data;

    constructor({
        name,
        address,
        size
    }){
        this.name = name;
        this.address = address;
        this.size = size;

        Register.instances.push(this);
        Register[name] = this;
    }

    addBinds(node){
        this.outputs.push(node);
    }

    reset(){
        this.valD = 0;
    }

    /**
     * @param {any} value
     */
    set val(value){
        this.data = value;

        for(const node of this.outputs){
            node.innerHTML = `${this.data} (${this.valD})`;
        }

        if(this.name == "X") console.log(this.valD.toString(16));
    }

    set valD(value){
        // value in decimal
        let bin = Utils.padd(Utils.dec2Bin(value), this.size);
        if(config.sup_neg_num){
            // check if num is neg
            if(value < 0) bin = Utils.comp(Utils.dec2BinP(-value, this.size));
        }
        this.val = bin;
    }

    get val(){
        return this.data;
    }

    get valD(){
        if(config.sup_neg_num && this.data[0] == "1" && this.size > 1) return -Utils.bin2Dec(Utils.comp(this.data));
        return Utils.bin2Dec(this.data);
    }

    static get(name){
        return Register.instances.find(e => e.name == name);
    }

    static getByAddress(address){
        return Register.instances.find(e => e.address == address);
    }
}