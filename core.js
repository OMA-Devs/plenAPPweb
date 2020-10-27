//core.js
//GLOBALES
/**
 * Representa al usuario conectado. Utilizado para nombrar las incidencias y
 * determinar los permisos dentro de la aplicacion.
 * @member {Object}
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

var presets;
var incAbiertas;

var incidenciasInterval;

var tools = {
	capitalizeFirstLetter : function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	  }
}

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
		coreUI.clearIntervals()
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
		var user = document.getElementById("usr").value
		var pass = document.getElementById("pass").value
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//console.log(this.responseText)
			var resp = JSON.parse(this.responseText)
				if(resp.resp == "Login Correcto"){
					//console.log(resp.usuario)
					alert("Login Correcto")
					userConnected = resp.usuario
					if (userConnected.PERMadmin == "1"){
						document.getElementById("administracion").style = "display:inline-block"
					}
					if (userConnected.PERMhistoricos == "1"){
						document.getElementById("historicos").style = "display:inline-block"
					}
					if (userConnected.PERMincidencias == "1"){
						document.getElementById("incidencias").style = "display:inline-block"
					}
					document.getElementById("user").style = "display:inline-block"
					document.getElementById("logout").style = "display:inline-block"
					document.getElementById("content").innerHTML = ""
				}else{
					//console.log(this.responseText)
					alert("Login Incorrecto")
				}
			}
		};
		var query = "auth.php?type=auth"
		query += "&usr="+user
		query += "&pass="+pass
		console.log(query)
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
		for(var i = 0; i<bar.children.length; i++){
			bar.children[i].style = "display: none"
		}
		coreUI.clearIntervals()
		calls.genericLoad(['type'],['show'],'auth.php','content')
	},
	queryHistorico : function(){
		var startDATE = document.getElementById("date_inicio").value
		var endDATE = document.getElementById("date_final").value
		var estacion = document.getElementById("estaciones").value
		var keyARR = ["type","startDATE", "endDATE", "estacion"]
		var valARR = ["request",startDATE, endDATE, estacion]
		calls.genericLoad(keyARR,valARR,"historicos.php","hList")
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
	},
	createIncidencia : function(obj){
		//determinamos el ID de la incidencia.
		var incID = obj.id
		//Se crea el elemento padre de la incidencia
		var incDIV = document.createElement("div")
		incDIV.setAttribute("id",incID)
		incDIV.setAttribute("class", "w3-cell w3-quarter w3-border w3-container")
		//Se crea el header de la incidencia
		//El header contiene NOMBRE DE LA ESTACION,FECHA y CANTIDAD DE LLAMADAS
		var headDIV = document.createElement("h2")
		headDIV.innerHTML = tools.capitalizeFirstLetter(obj.estacion)
		headDIV.setAttribute("class","w3-center")
		var timeOBJ = document.createElement("p")
		var incDATE = new Date(obj.fecha)
		timeOBJ.innerHTML = incDATE.toLocaleString()
		timeOBJ.setAttribute("class", "w3-center")
		var llamadas = document.createElement("p")
		llamadas.setAttribute("id", "llamadas-"+incID)
		llamadas.setAttribute("class", "w3-center")
		llamadas.innerHTML = "Llamadas: "+obj.llamadas
		incDIV.appendChild(headDIV)
		incDIV.appendChild(timeOBJ)
		incDIV.appendChild(llamadas)
		incDIV.appendChild(document.createElement("hr"))
		//Se crea el SELECT de INCIDENCIA y sus opciones
		var incLAB = document.createElement("label")
		incLAB.setAttribute("for","incidencia-"+incID)
		incLAB.innerHTML = "INCIDENCIA: "
		var selINC = document.createElement("select")
		selINC.setAttribute("id", "incidencia-"+incID)
		for (var x = 0; x<presets.incidencias.length; x++){
			var opt = document.createElement("option")
			opt.value = presets.incidencias[x]
			opt.innerHTML = presets.incidencias[x]
			selINC.appendChild(opt)
		}
		incDIV.appendChild(incLAB)
		incDIV.appendChild(selINC)
		incDIV.appendChild(document.createElement("br"))
		//Se crea el SELECT de RESOLUCIONES y sus opciones
		var incLAB = document.createElement("label")
		incLAB.setAttribute("for","resoluciones-"+incID)
		incLAB.innerHTML = "RESOLUCION: "
		var selINC = document.createElement("select")
		selINC.setAttribute("id", "resoluciones-"+incID)
		for (var x = 0; x<presets.resoluciones.length; x++){
			var opt = document.createElement("option")
			opt.value = presets.resoluciones[x]
			opt.innerHTML = presets.resoluciones[x]
			selINC.appendChild(opt)
		}
		incDIV.appendChild(incLAB)
		incDIV.appendChild(selINC)
		incDIV.appendChild(document.createElement("br"))
		//Se crea el SELECT de LLAMADA DE y sus opciones
		var incLAB = document.createElement("label")
		incLAB.setAttribute("for","llamadaDE-"+incID)
		incLAB.innerHTML = "LLAMADA DE: "
		var selINC = document.createElement("select")
		selINC.setAttribute("id", "llamadaDE-"+incID)
		for (var x = 0; x<presets.llamadaDE.length; x++){
			var opt = document.createElement("option")
			opt.value = presets.llamadaDE[x]
			opt.innerHTML = presets.llamadaDE[x]
			selINC.appendChild(opt)
		}
		incDIV.appendChild(incLAB)
		incDIV.appendChild(selINC)
		incDIV.appendChild(document.createElement("br"))
		//TELEFONO DE GUARDIA (LABEL, SELECT)
		var labelTELF = document.createElement("label")
		labelTELF.setAttribute("for", "telefonoguardia-"+incID)
		labelTELF.innerHTML = "TELEFONO DE GUARDIA: "
		var selectTELF = document.createElement("select")
		selectTELF.setAttribute("id","telefonoguardia-"+incID)
		var opYES = document.createElement("option")
		opYES.setAttribute("value", "si")
		opYES.innerHTML = "si"
		var opNO = document.createElement("option")
		opNO.setAttribute("value", "no")
		opNO.innerHTML = "no"
		selectTELF.appendChild(opYES)
		selectTELF.appendChild(opNO)
		incDIV.appendChild(labelTELF)
		incDIV.appendChild(selectTELF)
		incDIV.appendChild(document.createElement("br"))
		return incDIV
	},
	deleteIncidencia : function(id){
		var inc = document.getElementById(id)
		var parentNODE = inc.parentElement
		parentNODE.removeChild(inc)
		console.log("Incidencia eliminada")
	},
	editIncidencia : function(idTARGET, text){
		var inc = document.getElementById(idTARGET)
		inc.innerHTML = text
		console.log("Incidencia modificada")
	},
	updateIncidencias : function(){
		coreACTIONS.getIncAbiertas()
		var contenido = document.getElementById("content")
		for (var i = 0; i<incAbiertas.length; i++){
			//console.log(incAbiertas[i])
			var repeat = false
			var instance;
			for (var x = 0; x<contenido.children.length; x++){
				//console.log(contenido.children[x])
				if (incAbiertas[i].id == contenido.children[x].id){
					repeat = true
					var llamadas = document.getElementById("llamadas-"+contenido.children[x].id).innerHTML.split(" ")[1]
					if (incAbiertas[i].llamadas != llamadas){
						coreUI.editIncidencia("llamadas-"+contenido.children[x].id,"Llamadas: "+incAbiertas[i].llamadas)
						//coreUI.deleteIncidencia(contenido.children[x].id)
						//contenido.appendChild(coreUI.createIncidencia(incAbiertas[i]))
					}
				}
			}
			if (repeat == false){
				contenido.appendChild(coreUI.createIncidencia(incAbiertas[i]))
			}
		}
	},
	setupIncidencias : function(){
		var cont = document.getElementById("content")
		cont.innerHTML = ""
		//var incCONT = document.createElement("div")
		cont.setAttribute("class", "w3-cell-row")
		coreACTIONS.getIncAbiertas()
		for (var i = 0; i<incAbiertas.length; i++){
			cont.appendChild(coreUI.createIncidencia(incAbiertas[i]))
		}
	},
	initializeIncidencias: function(){
		coreUI.clearIntervals()
		coreUI.setupIncidencias()
		coreUI.updateIncidencias()
		incidenciasInterval = setInterval(coreUI.updateIncidencias, 1500)
	},
	clearIntervals : function(){
		clearInterval(incidenciasInterval)
	}
}

/**
 * Acciones dedicadas a una seccion en concreto, con llamadas especificas al servidor y gestiones específicas de UI.
 * @namespace
 */
var coreACTIONS = {
	editTable : function(element, target){
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
				calls.genericLoad(keyARR,valARR,target,"")
				coreUI.resetGlobals()
				if (target == "presets.php"){
					coreACTIONS.getPresets()
				}
			}
			if (delRow == true){
				if (selectedRow == undefined){
					alert("Selecciona una fila para eliminar")
				}else{
					var conf = confirm("¿Eliminar esta entrada?")
					if (conf == true){
						var idRow = selectedRow.children[0].innerHTML
						calls.genericLoad(["type","id"],["delete",idRow],target,"")
						calls.genericLoad(["type"],["show"],target,"content")
						coreUI.resetGlobals()
						if (target == "presets.php"){
							coreACTIONS.getPresets()
						}
					}
				}
			}
		}
	},
	addRow : function(target){
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
		calls.genericLoad(keyARR,valARR,target,"")
		calls.genericLoad(["type"],["show"],target,"content")
		coreUI.resetGlobals()
		if (target == "presets.php"){
			coreACTIONS.getPresets()
		}
	},
	getPresets : function(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				presets = JSON.parse(this.responseText)
			}
		};
		var query = "incidencias.php?type=getPresets"
		console.log(query)
		xhttp.open("GET", query, false);
		xhttp.send();	
	},
	getIncAbiertas : function(){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				incAbiertas = JSON.parse(this.responseText)
			}
		};
		var query = "incidencias.php?type=getAbiertas"
		console.log(query)
		xhttp.open("GET", query, false);
		xhttp.send();	
	}
}