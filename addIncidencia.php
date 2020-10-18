<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

$queryFECHA = $_REQUEST["fecha"];
$queryTELEFONO = $_REQUEST["telefono"];

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$estacionNAME = "";
//Buscamos el nombre de la estacion por telefono
$sql = "SELECT * FROM estaciones WHERE telefono = ".$queryTELEFONO;
$result = $con->query($sql);
if ($result->num_rows > 0){
	echo '<p>Telefono coincidente con base de datos.<p>';
	while($row = $result->fetch_assoc()) {
		//Asignamos el nombre de la estacion a la variable.
		$estacionNAME = $row[nombre];
		echo '<p>Nombre de la estacion identificado.</p>';
	}
	//Comprobamos que no exista ninguna incidencia abierta de esa estacion.
	$sql = "SELECT * FROM inc_abiertas WHERE estacion = '".$estacionNAME."' AND terminada = 0";
	$result = $con->query($sql);
	if ($result > 0) {
		echo '<p>Incidencia de la estacion YA ABIERTA.</p>';
		//Sumamos 1 al registro de llamadas de la incidencia ya abierta
		$actLLAMADAS = $result->fetch_assoc()[llamadas];
		$actLLAMADAS = $actLLAMADAS+1;
		$sql = "UPDATE inc_abiertas SET llamadas = ".$actLLAMADAS." WHERE estacion = '".$estacionNAME."' AND terminada = 0";
		echo $sql;
		$result = $con->query($sql);
		echo '<p>Registro de llamadas de la incidencia ACTUALIZADO.</p>';
	} else {
		//Insertamos la fila en la tabla correspondiente.
		$sql = "INSERT INTO inc_abiertas (fecha, estacion, gestion, terminada, llamadas) VALUES ('".$queryFECHA."','".$estacionNAME."',0,0,1)";
		echo '<p>Incidencia no abierta PREVIAMENTE: '.$sql.'</p>';
		$result = $con->query($sql);
		//echo '<p>'.$result.'</p>';
		if ($result > 0) {
			echo "Nueva incidencia añadida";
		} else {
			echo "Incidencia no añadida";
		}
	}
}else{
	echo 'Numero de telefono no coincidente con la base de datos.\n';
}
	
$con->close();
?>
