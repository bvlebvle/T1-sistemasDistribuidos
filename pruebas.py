import requests
import time
import random
import matplotlib
from matplotlib import pyplot as plt
import numpy as np


print("Prueba de la API")

# arreglo para guardar tiempos de respuesta
characters_id = []
peticiones = []

for i in range(1, 200):
    # consultas cada 5 ms
    id = random.randint(1, 226)
    peticiones.append(i)
    url_characters = "http://localhost:4000/characters/" + str(i)
    res_characters = requests.get(url_characters)
    characters_id.append(res_characters.elapsed.total_seconds() * 1000)

    print(id, " ", res_characters.elapsed.total_seconds() * 1000)

    time.sleep(0.001)
    # print(url_episodios)


x = peticiones
y = characters_id

plt.plot(x, y)
plt.xlabel("ID de petición")
plt.ylabel("Tiempo de respuesta (ms)")
plt.title("Tiempo de respuesta por petición")
plt.show()

print("Fin de la prueba")
