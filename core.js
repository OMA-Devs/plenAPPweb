//core.js
//GLOBALES
var orgConnected = undefined //Determina la organizacion conectada
var userConnected = undefined //Determina el usuario conectado
var selectedRow = undefined //Determina la fila seleccionada
var edit = false //Determina la posibilidad de editar o no una fila
var delRow = false //Determina la funcion de eliminado de una fila

var calls = {
	genericLoad: function(keyARR, valARR, fileTARGET, divTARGET){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				if (divTARGET == ""){
					alert(this.responseText)
				}else{
					var view = document.getElementById(divTARGET);
					view.innerHTML = ""
					view.innerHTML = this.responseText
				}
			}
		};
		var query = fileTARGET+"?"
		for (var i = 0; i<keyARR.length; i++){
			if (i == keyARR.length-1){
				query += keyARR[i]+"="+valARR[i]
			}else{
				query += keyARR[i]+"="+valARR[i]+"&"
			}
		}
		console.log(query)
		xhttp.open("GET", query, true);
		xhttp.send();
	},
	login: function(){
		var user = prompt("Introduzca usuario:","usuario")
		var pass = prompt("Introduzca contraseña:","contraseña")
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				if(this.responseText == "Login Correcto"){
					//console.log(this.responseText)
					alert("Login Correcto")
					userConnected = user
					var bar = document.getElementById("navBar")
					for(var i = 0; i<bar.children.length; i++){
						bar.children[i].style = "display: inline-block"
					}
				}else{
					//console.log(this.responseText)
					alert("Login Incorrecto")
				}
			}
		};
		var query = "auth.php?"
		query += "usr="+user
		query += "&pass="+pass
		//console.log(query)
		xhttp.open("GET", query, true);
		xhttp.send();
	},
	logout: function(){
		userConnected = undefined
		var bar = document.getElementById("navBar")
		for(var i = 1; i<bar.children.length; i++){
			bar.children[i].style = "display: none"
		}
	}
}
var getValue = function(node){
	//console.log(node.parentElement.children[0])
	if (selectedRow == undefined){
		selectedRow = node
		selectedRow.style = "background-color: yellow"
	}else if(selectedRow == node){
		selectedRow.style = ""
		selectedRow = undefined
	}else{
		selectedRow.style = ""
		selectedRow = node
		selectedRow.style = "background-color: yellow"
	}
}

var toogleEdit = function(node){
	if (edit == true){
		node.style = ""
		edit = false
	}else{
		node.style = "background-color: green"
		edit = true
	}
}
var toogleDelete = function(node){
	if (delRow == true){
		node.style = ""
		delRow = false
	}else{
		node.style = "background-color: red"
		delRow = true
	}
}
var editField = function(element){
	if (edit == true && delRow == true){
		alert("Edicion y eliminado estan activados a la vez. Desactiva uno")
	} else{
		if (edit == true){
			var newVal = prompt("Introduzca nuevo valor:", element.innerHTML)
			element.innerHTML = newVal
			//Obtenemos los headers de la tabla
			var tab = document.getElementById("activeTable")
			var head = tab.children[0].children[0]
			keyARR = []
			for (var i = 0; i<head.children.length; i++){
				//console.log(head.children[i].innerHTML)
				//Es importante convertir a minusculas los campos.
				keyARR.push(head.children[i].innerHTML.toLowerCase())
			}
			//Obtenemos los valores de la linea a modificar
			valARR = []
			for (var i = 0; i<element.parentElement.children.length; i++){
				valARR.push(element.parentElement.children[i].innerHTML)
			}
			//Mandamos los datos al servidor.
			calls.genericLoad(keyARR,valARR,"editEstaciones.php","")
		}
		if (delRow == true){
			if (selectedRow == undefined){
				alert("Selecciona una fila para eliminar")
			}else{
				var conf = confirm("¿Eliminar esta estacion?")
				if (conf == true){
					var idRow = selectedRow.children[0].innerHTML
					calls.genericLoad(["id"],[idRow],"deleteEstaciones.php","")
					calls.genericLoad([],[],"estaciones.php","content")
				}
			}
		}
	}
}

var addEstacion = function(){
	//Obtenemos los headers de la tabla
	var tab = document.getElementById("activeTable")
	var head = tab.children[0].children[0]
	keyARR = []
	for (var i = 0; i<head.children.length; i++){
		keyARR.push(head.children[i].innerHTML.toLowerCase())
	}
	//Solicitamos un valor por cada celda excepto para ID que es AUTOINCREMENT en la base de datos
	valARR = []
	for (var i = 0; i<keyARR.length; i++){
		if (keyARR[i] == "id" || keyARR[i] == "copia"){
			valARR.push("")
		} else{
			var newVal = prompt("Introduce valor para "+keyARR[i], keyARR[i])
			valARR.push(newVal)
		}
	}
	calls.genericLoad(keyARR,valARR,"addEstaciones.php","")
	calls.genericLoad([],[],"estaciones.php","content")
}