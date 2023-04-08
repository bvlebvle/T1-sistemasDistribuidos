const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const redis = require("redis");

const app = express();

app.use(express.json());

const fetch = require("node-fetch");

const client = redis.createClient({
	host: "localhost",
	port: 6379
});
//solo hay 226 episodios
// fech es una funcion que uno de la una url y nos da

let url_episodios = "https://api.sampleapis.com/simpsons/episodes";
let url_personajes = "https://api.sampleapis.com/simpsons/characters";

//trae todos los episidios
app.get("/episodes", async (req, res) => {
	let fetchResponse = await fetch(url_episodios);

	let parseJson = await fetchResponse.json();
	res.json(parseJson);
});

//trae un episodio por id
app.get("/episodes/:id", async (req, res) => {
	let id = req.params.id;

	let fetchResponse = await fetch(url_episodios + "/" + id);
	console.log(fetchResponse);
	let parseJson = await fetchResponse.json();
	console.log(parseJson);
	if (Object.keys(parseJson).length === 0) {
		res.status(404).json({ message: "Episodio no encontrado" });
	} else {
		res.json(parseJson);
	}
});

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

	client.get(personaje_id, async (err, reply) => {
		if (reply) {
			console.log("cache");
			return res.json(JSON.parse(reply));
		}

		let fetchResponse = await fetch(url_personajes + "/" + id);
		let parseJson = await fetchResponse.json();

		client.set(personaje_id, JSON.stringify(parseJson), (err, reply) => {
			if (err) console.log(err);
			console.log(reply);
		});
		if (Object.keys(parseJson).length === 0) {
			res.status(404).json({ message: "Personaje no encontrado" });
		} else {
			res.json(parseJson);
		}
	});
});

//thunder client

app.listen(4000);
console.log("Server is running on port 4000");
