#!usr/bin/python3

import requests
import datetime
import random

URL = "http://omadevs.com/plenapp/incidencias.php"

TELEFONOS = []
for i in range(12):
	TELEFONOS.append(i)

for i in range(10):
	fecha = datetime.datetime(2020,random.randint(1,12),random.randint(1,30),random.randint(0,23),random.randint(0,59),random.randint(0,59))
	fecha.strftime("%Y-%m-%d %H:%M:%S")
	#print(fecha)
	telf = TELEFONOS[random.randint(0,len(TELEFONOS)-1)]
	PARAMS = {'type':"add", "fecha":fecha, "telefono": telf} 
	r = requests.get(url = URL, params = PARAMS) 
	print(r.url)
	print(r.text)
