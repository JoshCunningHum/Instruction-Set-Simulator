const Utils = {
    bin2Dec: (n) => {
        return parseInt(n, 2);
    },
    dec2Bin: (n) => {
        return n.toString(2);
    },
    padd: (n, size) => {
        let diff = size - n.length;
        if(diff < 0) return n.slice(-diff); // delete extra bits on the start
        else if(diff == 0) return n;
        return "0".repeat(diff) + n;
    },
    dec2BinP: (n, size) => {
        return Utils.padd(Utils.dec2Bin(n), size);
    },
    compD: (n) => { // n is decimal (returns number)
        const log = 10 ** (n.toString().length);
        return log - n;
    },
    comp: (n) => { // n is binary (returns string)
        return Utils.dec2BinP(Utils.bin2Dec(Utils.NOT(n)) + 1, n.length);
    },
    isNum: (string) => {
        return !isNaN(parseInt(string));
    },
    AND: (n1, n2) => {
        // n1 and n2 are binary strings
        // it is expected that the two have the same size
        let out = "";
        for(let i in n1){
            i = parseInt(i);
            let b1 = parseInt(n1[i]), b2 = parseInt(n2[i]);
            out += `${b1 & b2}`;
        }
        return out;
    },
    OR: (n1, n2) => {
        // n1 and n2 are binary strings
        // it is expected that the two have the same size
        let out = "";
        for(let i in n1){
            i = parseInt(i);
            let b1 = parseInt(n1[i]), b2 = parseInt(n2[i]);
            out += `${b1 | b2}`;
        }
        return out;
    },
    XOR: (n1, n2) => {
        // n1 and n2 are binary strings
        // it is expected that the two have the same size
        let out = "";
        for(let i in n1){
            i = parseInt(i);
            let b1 = parseInt(n1[i]), b2 = parseInt(n2[i]);
            out += `${b1 ^ b2}`;
        }
        return out;
    },
    NOT: (n) => {
        return Array.from(n).map(e => (e == "1") ? "0" : "1").join("");
    }
}