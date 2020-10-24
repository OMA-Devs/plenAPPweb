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
	echo "PAGINA DE ADMINISTRACION. EN PROGRESO";
}elseif ($queryTYPE == "add"){

}elseif ($queryTYPE == "delete"){
 
}elseif ($queryTYPE == "edit"){
  
}
$con->close();
  ?>
