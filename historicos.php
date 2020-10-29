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
	//echo "PAGINA DE HISTORICOS. EN PROGRESO";
	?>
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
	<label for = "incompletas">Incompletas</label>
	<input type="checkbox" id= "incompletas">

	<label for = "completadas">Completas</label>
	<input type="checkbox" id= "completadas">

	<label for = "abiertas">Abiertas</label>
	<input type="checkbox" id= "abiertas">

	<label for = "revision">Revision</label>
	<input type="checkbox" id= "revision">
	<div id = "hList"></div> <?php
}elseif ($queryTYPE == "request"){
	$querySTART = $_REQUEST["startDATE"];
	$queryEND = $_REQUEST["endDATE"];
	$queryESTACION = $_REQUEST["estacion"];
	$queryABIERTAS = $_REQUEST["abiertas"];
	$queryINCOMPLETAS = $_REQUEST["incompletas"];
	$queryCOMPLETADAS = $_REQUEST["completadas"];
	$queryREVISION = $_REQUEST["revision"];

	$sqlABIERTAS = "";
	$sqlINCOMPLETAS = "";
	$sqlCOMPLETADAS = "";
	$sqlREVISION = "";
	$sqlESTACION = "";

	//$sql = "SELECT * FROM ";

	if ($queryABIERTAS == "true"){
		$sqlABIERTAS = "SELECT * FROM inc_abiertas WHERE fecha BETWEEN '".$querySTART."'  AND '".$queryEND."'";
	}
	if ($queryCOMPLETADAS == "true"){
		$sqlCOMPLETADAS = "SELECT * FROM inc_cerradas WHERE fecha BETWEEN '".$querySTART."'  AND '".$queryEND."'";
	}
	if ($queryINCOMPLETAS == "true"){
		$sqlINCOMPLETAS = "SELECT * FROM inc_incompletas WHERE fecha BETWEEN '".$querySTART."'  AND '".$queryEND."'";
	}

	if ($sqlABIERTAS != ""){
		if ($queryESTACION != "todas"){
			$sqlABIERTAS = $sqlABIERTAS." AND estacion = '".$queryESTACION."'";
		}
		$result = $con->query($sqlABIERTAS);
		if ($result->num_rows > 0) {
		// output data of each row
			echo '<h2>ABIERTAS</h2>';
			while($row = $result->fetch_assoc()) {
				echo '<p>'.$row["fecha"].'---'.$row["estacion"].'</p>';
			}
		}
	}
	if ($sqlCOMPLETADAS != ""){
		if ($queryESTACION != "todas"){
			$sqlCOMPLETADAS = $sqlCOMPLETADAS." AND estacion = '".$queryESTACION."'";
		}
		$result = $con->query($sqlCOMPLETADAS);
		if ($result->num_rows > 0) {
		// output data of each row
			echo '<h2>CERRADAS</h2>';
			while($row = $result->fetch_assoc()) {
				echo '<p>'.$row["fecha"].'---'.$row["estacion"].'</p>';
			}
		}
	}
	if ($sqlINCOMPLETAS != ""){
		if ($queryESTACION != "todas"){
			$sqlINCOMPLETAS = $sqlINCOMPLETAS." AND estacion = '".$queryESTACION."'";
		}
		$result = $con->query($sqlINCOMPLETAS);
		if ($result->num_rows > 0) {
		// output data of each row
			echo '<h2>INCOMPLETAS</h2>';
			while($row = $result->fetch_assoc()) {
				echo '<p>'.$row["fecha"].'---'.$row["estacion"].'</p>';
			}
		}
	}
	$con->close();

}elseif ($queryTYPE == "delete"){
 
}elseif ($queryTYPE == "edit"){
  
}
$con->close();
  ?>
