//core.js
//GLOBALES
/**
 * Representa al usuario conectado. Utilizado para nombrar las incidencias y
 * determinar los permisos dentro de la aplicacion.
 * @member {String}
 */
var userConnected = undefined

/** Representa el nodo DOM seleccionado dentro de una tabla. Se utiliza para almacenar
 * una fila completa.
 * @member {HTMLnode}
 */
var selectedRow = undefined //Determina la fila seleccionada

/** Booleano utilizado por la interfaz grafica para determinar la capacidad del usuario de
 * editar un campo, normalmente un campo de una sola linea dentro de una tabla.
 * @member {Boolean}
 */
var edit = false //Determina la posibilidad de editar o no una fila

/** Booleano utilizado por la interfaz grafica para determinar la capacidad del usuario de
 * eliminar una fila de una tabla.
 * @member {Boolean}
 */
var delRow = false //Determina la funcion de eliminado de una fila

/** Incluye todas las llamadas a servidor con sus respectivos argumentos.
 * @namespace
 */
var calls = {
	/**
	 * Llamada generica a archivos php del servidor. Es lo más flexible posible para
	 * ser utilizada en los maximos sitios posibles.
	 * @param {Array} keyARR Contiene las KEYS para generar el query HTTP
	 * @param {Array} valARR Contiene los valores para generar el query HTTP
	 * @param {String} fileTARGET Archivo php de destino en el servidor
	 * @param {String} divTARGET ID del objetivo. Si se entrega una cadena vacía, la
	 * respuesta se dará en un alert, y si no se modificará el elemento entregado.
	 */
	genericLoad: function(keyARR, valARR, fileTARGET, divTARGET){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				if (divTARGET == ""){
					console.log(this.responseText)
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
	/**
	 * Funcion de Login. Funcionalidad muy básica y seguridad nula. Debe mejorarse.
	 * Modifica la variable global userConnected si los datos entregados son correctos
	 * en la base de datos.
	 * @see userConnected
	 */
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
	/**
	 * Función de Logout. Tanto o mas simple que el login. Debe mejorarse.
	 * Modifica la funcion userConnected.
	 * @see userConnected
	 */
	logout: function(){
		userConnected = undefined
		var bar = document.getElementById("navBar")
		for(var i = 1; i<bar.children.length; i++){
			bar.children[i].style = "display: none"
		}
	}
}

/** Incluye todas las funciones gráficas de UI y modifica variables globales relacionadas
 * con ello.
 * @namespace
 */
var coreUI = {
	/**
	 * Almacena el nodo entregado como argumento en la variable selectedRow.
	 * Además, cambia el color de fondo del nodo para distinguir la seleccion.
	 * @param {HTMLElement} node Nodo elegido, normalmente por click en la interfaz.
	 * @see selectedRow
	 */
	getValue : function(node){
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
	},
	/**
	 * Funcion de conveniencia para resetear las variables. Utilizada al cargar secciones de
	 * la interfaz para evitar bugs. Por ejemplo, modificar un campo que no esta ya en pantalla
	 * pero programaticamente marcado como seleccionado.
	 * @see selectedRow
	 * @see edit
	 * @see delRow
	 */
	resetGlobals : function(){
		selectedRow = false
		edit = false
		delRow = false
	},
	/**
	 * Modifica el color del nodo entregado para determinar visualmente que la edicion de campos
	 * esta activa. Ademas activa/desactiva la variable global edit.
	 * @param {HTMLElement} node Nodo que activa y desactiva la opcion en cuestion.
	 * @see edit
	 */
	toogleEdit : function(node){
		if (edit == true){
			node.style = ""
			edit = false
		}else{
			node.style = "background-color: green"
			edit = true
		}
	},
	/**
	 * Modifica el color del nodo entregado para determinar visualmente que la eliminación de
	 * filas esta activa. Ademas activa/desactiva la variable global delRow
	 * @param {HTMLElement} node Nodo que activa y desactiva la opcion en cuestion.
	 * @see delRow
	 */
	toogleDelete : function(node){
		if (delRow == true){
			node.style = ""
			delRow = false
		}else{
			node.style = "background-color: red"
			delRow = true
		}
	}
}

/**
 * Acciones dedicadas a una seccion en concreto, con llamadas especificas al servidor y gestiones específicas de UI.
 * @namespace
 */
var coreACTIONS = {
	/**
	 * Función para editar y eliminar objetos de la interfaz relacionada con "ESTACIONES". Contiene la funcionalidad
	 * de seguridad necesaria para no tener el modo de edicion y eliminacion conjuntamente, y efectua la funcion
	 * necesaria dependiendo de las variables activas.
	 * @param {HTMLElement} element Campo pulsado especificamente. Se utiliza en el modo edicion. En el modo
	 * eliminacion se utiliza para determinar la fila padre a eliminar.
	 * @see edit
	 * @see delRow
	 */
	editEstacion : function(element){
		if (edit == true && delRow == true){
			alert("Edicion y eliminado estan activados a la vez. Desactiva uno")
		} else{
			if (edit == true){
				var newVal = prompt("Introduzca nuevo valor:", element.innerHTML)
				element.innerHTML = newVal
				//Obtenemos los headers de la tabla
				var tab = document.getElementById("activeTable")
				var head = tab.children[0].children[0]
				keyARR = ["type"]
				for (var i = 0; i<head.children.length; i++){
					//console.log(head.children[i].innerHTML)
					//Es importante convertir a minusculas los campos.
					keyARR.push(head.children[i].innerHTML.toLowerCase())
				}
				//Obtenemos los valores de la linea a modificar
				valARR = ["edit"]
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
						calls.genericLoad(["type","id"],["delete",idRow],"estaciones.php","")
						calls.genericLoad(["type"],["show"],"estaciones.php","content")
					}
				}
			}
		}
	},
	/**
	 * Funcion para añadir estaciones desde la interfaz grafica. Contiene la llamada concreta al servidor.
	 * Se encarga de generar el query necesario y solicitar los datos de la nueva entrada.
	 */
	addEstacion : function(){
		//Obtenemos los headers de la tabla
		var tab = document.getElementById("activeTable")
		var head = tab.children[0].children[0]
		keyARR = []
		for (var i = 0; i<head.children.length; i++){
			if (head.children[i].innerHTML.toLowerCase() == "id" || head.children[i].innerHTML.toLowerCase() == "copia"){
				continue
			}else{
				keyARR.push(head.children[i].innerHTML.toLowerCase())
			}
		}
		//Solicitamos un valor por cada celda excepto para ID que es AUTOINCREMENT en la base de datos
		valARR = []
		for (var i = 0; i<keyARR.length; i++){
			var newVal = prompt("Introduce valor para "+keyARR[i], keyARR[i])
			valARR.push(newVal)
		}
		keyARR.unshift("type")
		valARR.unshift("add")
		calls.genericLoad(keyARR,valARR,"estaciones.php","")
		calls.genericLoad(["type"],["show"],"estaciones.php","content")
	}
}




//var tick = setInterval(calls.genericLoad,1500,["type"],["show"],"incidencias.php","content")