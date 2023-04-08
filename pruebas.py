import requests
import time
import random

# import matplotlib.pyplot as plt
# import numpy as np


print("Prueba de la API")

# arreglo para guardar tiempos de respuesta
episodios_id = []
characters_id = []
peticiones = []

for i in range(1, 10):
    # consultas cada 5 ms
    peticiones.append(i)
    id = random.randint(1, 300)
    url_episodios = "http://localhost:3000/episodes/" + str(id)
    id = random.randint(1, 300)
    url_characters = "http://localhost:3000/characters/" + str(id)
    res_episodios = requests.get(url_episodios)
    episodios_id.append(res_episodios.elapsed.total_seconds() * 1000)
    res_characters = requests.get(url_characters)
    characters_id.append(res_characters.elapsed.total_seconds() * 1000)
    if id % 8 == 0:
        res_all_episodes = requests.get("http://localhost:3000/episodes")

    if id % 8 == 1:
        res_all_characters = requests.get("http://localhost:3000/characters")

    time.sleep(0.005)
    # print(url_episodios)


# fig, ax = plt.subplots()
# Colocamos una etiqueta en el eje Y
# ax.set_ylabel("Número de peticiones")
# Colocamos una etiqueta en el eje X
# ax.set_title("Tiempo de respuesta")
# Creamos la grafica de barras utilizando 'paises' como eje X y 'ventas' como eje y.
# plt.bar(peticiones, episodios_id)
# plt.savefig("barras_simple.png")
# Finalmente mostramos la grafica con el metodo show()
# plt.show()

print("Fin de la prueba")
