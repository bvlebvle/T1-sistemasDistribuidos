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
	host: "172.17.0.2",
	port: 6379
});
const client2 = redis.createClient({
	host: "172.17.0.4",
	port: 6379
});
const client3 = redis.createClient({
	host: "172.17.0.3",
	port: 6379
});

//funcion
function functionHash(id) {
	let sha256 = CryptoJS.SHA256(id).toString(CryptoJS.enc.ascii);
	let total = 0;
	for (let i = 0; i < sha256.length; i++) {
		total += sha256.charCodeAt(i);
	}
	return total % 3;
}

// fech es una funcion que uno de la una url y nos da

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
	console.log(server);
	console.log(personaje_id);

	if (server == 0) {
		client.get(personaje_id, async (err, reply) => {
			if (reply) {
				// si esta en cache
				//console.log("cache");
				return res.json(JSON.parse(reply));
			}

			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			client.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				// guardo en cache
				if (err) console.log(err);
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
				// si esta en cache
				//console.log("cache");
				return res.json(JSON.parse(reply));
			}

			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			client2.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				// guardo en cache
				if (err) console.log(err);
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
				// si esta en cache
				//console.log("cache");
				return res.json(JSON.parse(reply));
			}

			let fetchResponse = await fetch(url_personajes + "/" + id);
			let parseJson = await fetchResponse.json();

			client3.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
				// guardo en cache
				if (err) console.log(err);
				console.log(reply);
			});
			if (Object.keys(parseJson).length === 0) {
				res.status(404).json({ message: "Personaje no encontrado" });
			} else {
				res.json(parseJson);
			}
		});
	}
});

app.listen(4000);
console.log("Server is running on port 4000");
