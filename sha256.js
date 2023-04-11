// Importar la biblioteca CryptoJS
const CryptoJS = require("crypto-js");

// Definir la variable que deseas convertir en SHA-256
let miVariable = 4;

// Convertir la variable en SHA-256 y luego en ASCII
let sha256 = CryptoJS.SHA256(miVariable).toString(CryptoJS.enc.ascii);

// Sumar los valores ASCII en un total
let total = 0;
for (let i = 0; i < sha256.length; i++) {
	total += sha256.charCodeAt(i);
}

console.log(total); // Mostrar el total en la consola
