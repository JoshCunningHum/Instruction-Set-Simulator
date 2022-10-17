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
    }

    set valD(value){
        // value in decimal
        this.data = Utils.padd(Utils.dec2Bin(value), this.size);

        for(const node of this.outputs){
            node.innerHTML = `${this.data} (${this.valD})`;
        }
    }

    get val(){
        return this.data;
    }

    get valD(){
        return Utils.bin2Dec(this.data);
    }

    static get(name){
        return Register.instances.find(e => e.name == name);
    }

    static getByAddress(address){
        return Register.instances.find(e => e.address == address);
    }
}