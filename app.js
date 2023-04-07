const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

const fetch = require("node-fetch");

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

	let fetchResponse = await fetch(url_personajes + "/" + id);
	let parseJson = await fetchResponse.json();
	console.log(parseJson);
	if (Object.keys(parseJson).length === 0) {
		res.status(404).json({ message: "Personaje no encontrado" });
	} else {
		res.json(parseJson);
	}
});

//thunder client

app.listen(3000);
console.log("Server is running on port 3000");
