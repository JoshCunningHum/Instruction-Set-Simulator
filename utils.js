const Utils = {
    bin2Dec: (n) => {
        return parseInt(n, 2);
    },
    dec2Bin: (n) => {
        return n.toString(2);
    },
    padd: (n, size) => {
        let diff = size - n.length;
        if(diff <= 0) return n;
        return "0".repeat(diff) + n;
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