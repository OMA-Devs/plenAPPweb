<?php
include 'connect.php';

/* Esta variable del query determina la funcion referente a ESTACIONES que se va a ejecutar y se
comprueba en un bucle inicial IF para saber que parte del SCRIPT ejecutar.

- SHOW : Mostrar las estaciones y devolver HTML
- ADD: Añadir estaciones
- DELETE: Eliminar estaciones
- EDIT: Editar estaciones

*/
$queryTYPE = $_REQUEST["type"];

if ($queryTYPE == "show"){
	?>
	<div class="w3-content" style="width: 30%">
		<p class="w3-button w3-border w3-xxlarge w3-center" style="width: 100%"
			onclick = "calls.genericLoad(['type'],['show'],'estaciones.php','content')">Estaciones</p>
		<p class="w3-button w3-border w3-xxlarge w3-center" style="width: 100%"
			onclick = "calls.genericLoad(['type'],['show'],'responsables.php','content')">Responsables</p>
		<p class="w3-button w3-border w3-xxlarge w3-center" style="width: 100%"
			onclick = "calls.genericLoad(['type'],['show'],'presets.php','content')">Presets</p>
	</div>
	<?php
}elseif ($queryTYPE == "add"){

}elseif ($queryTYPE == "delete"){
 
}elseif ($queryTYPE == "edit"){
  
}
$con->close();
  ?>
