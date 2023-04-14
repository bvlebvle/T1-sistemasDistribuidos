const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const redis = require("redis");
var CryptoJS = require("crypto-js");
const sha256 = require("js-sha256");
const app = express();

app.use(express.json());

const fetch = require("node-fetch");

const client = redis.createClient({
	host: "localhost",
	port: 6379
});
client.config("SET", "maxclients", 1, function (err, response) {
	if (err) throw err;
	console.log("Configuración modificada correctamente.");
});
//client.config("SET", "maxmemory-policy", "allkeys-lfu", (error, result) => {
//	if (error) {
//		console.error("Error al configurar maxmemory-policy:", error);
//	} else {
//		console.log("Exito al configurar maxmemory-policy");
//	}
//});

const client2 = redis.createClient({
	host: "localhost",
	port: 6380
});
//client2.config("SET", "maxmemory-policy", "allkeys-lfu", (error, result) => {
//	if (error) {
//		console.error("Error al configurar maxmemory-policy:", error);
//	} else {
//		console.log("Exito al configurar maxmemory-policy");
//	}
//});
const client3 = redis.createClient({
	host: "localhost",
	port: 6381
});
//client3.config("SET", "maxmemory-policy", "allkeys-lfu", (error, result) => {
//	if (error) {
//		console.error("Error al configurar maxmemory-policy:", error);
//	} else {
//		console.log("Exito al configurar maxmemory-policy");
//	}
//});
//funcion para hacer el hash y saber a que caché ir
function functionHash(id) {
	let sha256 = CryptoJS.SHA256(id).toString(CryptoJS.enc.ascii);
	let total = 0;
	for (let i = 0; i < sha256.length; i++) {
		total += sha256.charCodeAt(i);
	}
	return total % 3;
}
let ttl_cache = 300;

let url_personajes = "https://api.sampleapis.com/simpsons/characters";

//trae todos los personajes
app.get("/characters", async (req, res) => {
	let fetchResponse = await fetch(url_personajes);
	let parseJson = await fetchResponse.json();
	res.json(parseJson);
});

//trae un personaje por id
app.get("/characters/:id", async (req, res) => {
	let id = req.params.id;
	let personaje_id = "characters/" + id;
	let id_to_string = id.toString();
	let server = functionHash(id_to_string);
	//let server = -1;
	console.log(server);
	console.log(personaje_id);

	if (server == 0) {
		//buscar primero en caché
		client.get(personaje_id, async (err, reply) => {
			if (reply) {
				// si esta en cache
				console.log("cache");
				return res.json(JSON.parse(reply));
			}

			//si no esta en cache, buscar en la api
			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			//guardar en cache
			client.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				if (err) {
					console.log(err);
				}
				console.log(reply);
			});
			if (Object.keys(parseJson).length === 0) {
				res.status(404).json({ message: "Personaje no encontrado" });
			} else {
				res.json(parseJson);
			}
		});
	}
	if (server == 1) {
		client2.get(personaje_id, async (err, reply) => {
			if (reply) {
				return res.json(JSON.parse(reply));
			}

			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			client2.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				if (err) {
					console.log(err);
				}
				console.log(reply);
			});
			if (Object.keys(parseJson).length === 0) {
				res.status(404).json({ message: "Personaje no encontrado" });
			} else {
				res.json(parseJson);
			}
		});
	}
	if (server == 2) {
		client3.get(personaje_id, async (err, reply) => {
			if (reply) {
				return res.json(JSON.parse(reply));
			}

			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			client3.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				if (err) {
					console.log(err);
				}
				console.log(reply);
			});
			if (Object.keys(parseJson).length === 0) {
				res.status(404).json({ message: "Personaje no encontrado" });
			} else {
				res.json(parseJson);
			}
		});
	}
	if (server == -1) {
		let fetchResponse = await fetch(url_personajes + "/" + id);
		let parseJson = await fetchResponse.json();
		if (Object.keys(parseJson).length === 0) {
			res.status(404).json({ message: "Episodio no encontrado" });
		} else {
			res.json(parseJson);
		}
	}
});

app.listen(4000);
console.log("Server is running on port 4000");
