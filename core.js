//core.js
//GLOBALES
var userConnected = undefined //Determina el usuario conectado
var calls = {
	genericLoad: function(queryARR, fileTARGET, divTARGET){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				var view = document.getElementById(divTARGET);
				view.innerHTML = ""
				view.innerHTML = this.responseText
			}
		};
		var query = fileTARGET+"?"
		for (var i = 0; i<queryARR.length; i++){
			if (i == queryARR.length-1){
				query += queryARR[i]
			}else{
				query += queryARR[i]+"&"
			}
		}
		//console.log(query)
		xhttp.open("GET", query, true);
		xhttp.send();
	},
	loadView: function(viewString, viewPOS){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				var view = document.getElementById(viewPOS);
				view.innerHTML = ""
				view.innerHTML = this.responseText
			}
		};
		var query = "loadView.php?"
		query += "str="+viewString
		//console.log(query)
		xhttp.open("GET", query, true);
		xhttp.send();
	},
	loadData: function(phpFILE){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				var view = document.getElementById("data");
				view.innerHTML = ""
				view.innerHTML = this.responseText
			}
		};
		var query = phpFILE+"?"
		//query += "str="+viewString
		//console.log(query)
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
