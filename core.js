//core.js
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

/** Objeto que contiene los presets para ser utilizados en la interfaz grafica y reducir la
 * cantidad de peticiones al servidor. Este funcionamiento implica que tras modificar los presets
 * se debe reiniciar la plataforma.
 * @member {Object}
 * @see coreUI.updateIncidencias
 */
var presets;

/** Array de incidencias abiertas que se actualiza constantemente en el bucle de actualizacion
 * de incidencias. Se almacena como un array de objetos de javascript para mejor manipulacion 
 * y transmision de datos entre capas de la aplicacion.
 * @member {Array}
 * @see calls.getIncAbiertas
 * @see coreUI.updateIncidencias
 * @see coreUI.editIncidencia
 */
var incAbiertas;

/** Variable que almacena el numero que se asigna al crear un intervalo en javascript. Esta variable
 * almacena el ID del intervalo de actualizacion de las incidencias.
 * @member {Number}
 * @see coreUI.initializeIncidencias
 * @see coreUI.clearIntervals
 */
var incidenciasInterval;

/** Contiene las funciones para manipulacion de numeros, fechas y cadenas reutilizables.
 * @namespace
*/
var tools = {
	/**
	 * Convierte la primera letra de cualquier cadena en mayúscula. Se necesita esta función por
	 * UI, ya que los datos de la base de datos vienen todos en minúscula.
	 * @param {String} str Cadena de texto a modificar.
	 */
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
	/** Llamada específica al servidor para los historicos. Crea el query con todos los datos necesarios, desde fecha a tipo de
	 * incidencia para pasarlo al servidor y lo carga en el DIV correspondiente con una llamada genérica.
	 * @see calls.genericLoad
	 */
	queryHistorico : function(){
		var startDATE = document.getElementById("date_inicio").value
		var endDATE = document.getElementById("date_final").value
		var estacion = document.getElementById("estaciones").value
		var abiertas = document.getElementById("abiertas").checked
		var incompletas = document.getElementById("incompletas").checked
		var completadas = document.getElementById("completadas").checked
		var revision = document.getElementById("revision").checked
		var keyARR = ["type","startDATE", "endDATE", "estacion","abiertas","incompletas","completadas","revision"]
		var valARR = ["request",startDATE, endDATE, estacion,abiertas, incompletas, completadas, revision]
		calls.genericLoad(keyARR,valARR,"historicos.php","hList")
	},
	/**
	 * Función para gestionar las llamadas necesarias al servidor en el cierre de incidencias. Crea el query para
	 * entregar todos los datos y que se ejecute la lógica correspondiente desde el servidor. La incidencia puede
	 * ir a incidencias cerradas o incidencias incompletas dependiendo de las opciones seleccionadas, ademas de
	 * eliminarse de la tabla de incidencias abiertas.
	 * @param {String} id Cadena con el NUMERO de incidencia. Se utiliza solo el número para seleccionar los campos
	 * que correspondan de la incidencia examinando el DOM.
	 */
	endIncidencia : function(id){
		//var divTARGET = document.getElementById(id)
		var fecha = document.getElementById("fecha-"+id).innerHTML
		var nombre = document.getElementById("nombre-"+id).innerHTML.toLowerCase()
		var llamadas = document.getElementById("llamadas-"+id).innerHTML.split(" ")[1]
		var incidencia = document.getElementById("incidencia-"+id).value
		var resolucion = document.getElementById("resoluciones-"+id).value
		var llamadaDE = document.getElementById("llamadaDE-"+id).value
		var telefonoguardia = document.getElementById("telefonoguardia-"+id).value
		var incompleto = document.getElementById("incompleto-"+id).checked
		var revision = document.getElementById("revision-"+id).checked

		var keyARR = ["type","id","fecha","nombre","llamadas","incidencia","resolucion","llamadaDE","telefonoguardia","incompleto","revision"]
		var valARR = ["close",id, fecha,nombre,llamadas,incidencia, resolucion, llamadaDE, telefonoguardia, incompleto, revision]
		calls.genericLoad(keyARR,valARR,"incidencias.php","")
		//coreUI.clearIntervals()
		coreUI.deleteIncidencia(id)
		//coreUI.initializeIncidencias()
	},
	/** Llamada para obtener los presets desde la base de datos. Estos se almacenan posteriormente en la variable presets.
	 * ES UNA LLAMADA SINCRONA.
	 * @see presets
	 */
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
	/** Llamada para obtener las incidencias abiertas desde la base de datos. La respuesta se almacena como objeto en la variable
	 * incAbiertas. Esta función es la llamada base de la funcionalidad en tiempo real de la aplicación. ES UNA LLAMADA SINCRONA.
	 * @see incAbiertas
	 */
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
	/**
	 * Función básica que contiene toda la estructura fisica de una incidencia y sus elementos, así como las ID
	 * y los formatos correspondientes. Esta funcion hace uso del objeto presets directamente.
	 * @param {Object} obj Objeto de incidencia, que contiene todos los datos para llenar la estructura.
	 */
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
		headDIV.setAttribute("id", "nombre-"+incID)
		var timeOBJ = document.createElement("p")
		//var incDATE = new Date(obj.fecha)
		timeOBJ.setAttribute("id", "fecha-"+incID)
		timeOBJ.innerHTML = obj.fecha//incDATE.toLocaleString()
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
		//OPCIONES DE CIERRE Y BOTON
		var labINCOMPLETO = document.createElement("label")
		labINCOMPLETO.innerHTML = "INCOMPLETO"
		labINCOMPLETO.setAttribute("for", "incompleto-"+incID)
		var incompleto = document.createElement("input")
		incompleto.setAttribute("type", "checkbox")
		incompleto.setAttribute("id", "incompleto-"+incID)
		var labREVISION = document.createElement("label")
		labREVISION.setAttribute("for", "revision-"+incID)
		labREVISION.innerHTML = "REVISION"
		var revision = document.createElement("input")
		revision.setAttribute("type", "checkbox")
		revision.setAttribute("id", "revision-"+incID)
		var cerrar = document.createElement("p")
		cerrar.innerHTML = "Cerrar"
		cerrar.setAttribute("class", "w3-button w3-border")
		cerrar.setAttribute("onclick","coreUI.clearIntervals(),calls.endIncidencia('"+incID+"'),coreUI.initializeIncidencias()")
		cerrar.style.width = "100%"
		incDIV.appendChild(document.createElement("hr"))
		incDIV.appendChild(labINCOMPLETO)
		incDIV.appendChild(incompleto)
		incDIV.appendChild(document.createElement("br"))
		incDIV.appendChild(labREVISION)
		incDIV.appendChild(revision)
		incDIV.appendChild(document.createElement("br"))
		incDIV.appendChild(cerrar)
		incDIV.appendChild(document.createElement("br"))
		return incDIV
	},
	/**
	 * Elimina una incidencia del DOM. No la elimina de incAbiertas, ni de la tabla de incidencias abiertas.
	 * ES UNA FUNCION MERAMENTE GRAFICA.
	 * @param {String} id Cadena con el ID de la incidencia a eliminar.
	 */
	deleteIncidencia : function(id){
		var inc = document.getElementById(id)
		var parentNODE = inc.parentElement
		parentNODE.removeChild(inc)
		console.log("Incidencia eliminada")
	},
	/**
	 * Funcion para modificar campos de una incidencia en el DOM. Existe para economizar las actualizaciones del DOM
	 * y no estar redibujando constantemente los elementos.
	 * @param {String} idTARGET ID de la incidencia objetivo.
	 * @param {String} text Texto interior del objeto a modificar.
	 */
	editIncidencia : function(idTARGET, text){
		var inc = document.getElementById(idTARGET)
		inc.innerHTML = text
		console.log("Incidencia modificada")
	},
	/** 
	 * Funcion que engloba la obtención de las incidencias abiertas y la actualizacion correspondiente en el DOM
	 * si existiese alguna diferencia entre las representadas y las obtenidas. Por el momento solo actualiza las
	 * llamadas recibidas. Tambien crea las que no estén representadas.
	 * @see coreUI.editIncidencia
	 * @see calls.getIncAbiertas
	 * @see coreUI.createIncidencia
	 */
	updateIncidencias : function(){
		calls.getIncAbiertas()
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
	/** 
	 * Funcion de creacion inicial del esquema de la pantalla de incidencias. Crea la primera visualizacion y obtiene
	 * los datos necesarios de la base de datos.
	 */
	setupIncidencias : function(){
		var cont = document.getElementById("content")
		cont.innerHTML = ""
		//var incCONT = document.createElement("div")
		cont.setAttribute("class", "w3-cell-row")
		calls.getIncAbiertas()
		for (var i = 0; i<incAbiertas.length; i++){
			cont.appendChild(coreUI.createIncidencia(incAbiertas[i]))
		}
	},
	/**
	 * Funcion de inicialización. Limpia los posibles intervalos creados en otras partes de la aplicación,
	 * ejecuta la funcion de setup para limpiar el DIV content y efectua una actualización inmediatamente.
	 * Tras eso, inicia el intervalo de actualización de incidencias y comienza el bucle de gestión en tiempo
	 * real.
	 */
	initializeIncidencias: function(){
		coreUI.clearIntervals()
		coreUI.setupIncidencias()
		coreUI.updateIncidencias()
		incidenciasInterval = setInterval(coreUI.updateIncidencias, 1500)
	},
	/**
	 * Funcion de conveniencia para limpiar los intervalos generados. Por el momento, solo existe
	 * el intervalo de actualizaciones.
	 * @see incidenciasInterval
	 */
	clearIntervals : function(){
		clearInterval(incidenciasInterval)
	}
}

/**
 * Acciones dedicadas a una seccion en concreto, con llamadas especificas al servidor y gestiones específicas de UI.
 * @namespace
 */
var coreACTIONS = {
	/**
	 * Función que conjunta la acción de eliminar y editar campos/filas de una tabla representada en el DOM.
	 * Actualmente se utiliza solo para la sección de Administración, donde se pueden modificar/eliminar
	 * las estaciones, los responsables y los presets directamente en la base de datos.
	 * Contiene la logica necesaria para no poder editar y eliminar a la vez.
	 * @param {HTMLnode} element Elemento a MODIFICAR
	 * @param {String} target Nombre del archivo PHP que debe efectuar la lógica. En este caso, puede ser
	 * presets.php, responsables.php o estaciones.php, que contienen cada uno la lógica necesaria para gestinar
	 * las llamadas generadas por esta funcion. 
	 */
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
					calls.getPresets()
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
							calls.getPresets()
						}
					}
				}
			}
		}
	},
	/**
	 * Función para añadir filas a la base de datos de la tabla correspondiente. Actualmente se gestiona con alerts
	 * que solicitan los campos requeridos para crear un registro nuevo, pero se planea modificar la interfaz para que
	 * se asemeje más a la representada en históricos.php. 
	 * @param {String} target archivo PHP que debe ejecutar la lógica dependiendo de la tabla que se este intentando
	 * modificar. 
	 */
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
			calls.getPresets()
		}
	}
}