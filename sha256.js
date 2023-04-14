const CryptoJS = require("crypto-js");

let miVariable = 4;
let sha256 = CryptoJS.SHA256(miVariable).toString(CryptoJS.enc.ascii);
l;
let total = 0;
for (let i = 0; i < sha256.length; i++) {
	total += sha256.charCodeAt(i);
}
console.log(total);
