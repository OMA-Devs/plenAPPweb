<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

$queryID = $_REQUEST["id"];
$queryNOMBRE = $_REQUEST["nombre"];
$queryRESPONSABLE = $_REQUEST["responsable"];
$queryTELEFONO = $_REQUEST["telefono"];
$queryCOPIA = $_REQUEST["copia"];

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$sql = "UPDATE estaciones SET nombre = '".$queryNOMBRE."', responsable = '".$queryRESPONSABLE."', telefono = ".$queryTELEFONO.", copia = '".$queryCOPIA."' WHERE id = ".$queryID;
$result = $con->query($sql);
//echo $result;
if ($result > 0) {
	echo "Edicion Correcta";
} else {
	echo "Edicion Incorrecta";
}
$con->close();
?>