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
	echo "PAGINA DE HISTORICOS. EN PROGRESO"; ?>
	<label for = "date_inicio">Fecha inicio: </label>
	<input onchange = calls.queryHistorico() id = "date_inicio" type = "date">
	<label for = "date_final">Fecha terminacion: </label>
	<input onchange = calls.queryHistorico() id = "date_final"type = "date">
	<label for = "estaciones"> Estacion: </label>
	<select onchange = calls.queryHistorico() id = "estaciones">
		<option value = "todas">todas</option>
		<?php
		$sql = "SELECT * FROM estaciones";
		$result = $con->query($sql);
		if ($result->num_rows > 0) {
		// output data of each row
			while($row = $result->fetch_assoc()) {
				echo '<option value = "'.$row["nombre"].'">'.$row["nombre"].'</option>';
			}
		}
		$con->close();
		?>
	</select>
	<p class = "w3-button w3-border"
	onclick = calls.queryHistorico()>Solicitar</p>
	<div id = "hList"></div> <?php
}elseif ($queryTYPE == "request"){
	$querySTART = $_REQUEST["startDATE"];
	$queryEND = $_REQUEST["endDATE"];
	$queryESTACION = $_REQUEST["estacion"];
	$sql = "SELECT * FROM inc_abiertas WHERE fecha BETWEEN '".$querySTART."'  AND '".$queryEND."'";
	if ($queryESTACION != "todas"){
		$sql = $sql." AND estacion = '".$queryESTACION."'";
	}
	$result = $con->query($sql);
	if ($result->num_rows > 0) {
	// output data of each row
		while($row = $result->fetch_assoc()) {
			echo '<p>'.$row["fecha"].'---'.$row["estacion"].'</p>';
		}
	}
	$con->close();

}elseif ($queryTYPE == "delete"){
 
}elseif ($queryTYPE == "edit"){
  
}
$con->close();
  ?>
