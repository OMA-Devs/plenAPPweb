<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

$queryID = $_REQUEST["id"];
//$queryNOMBRE = $_REQUEST["nombre"];
//$queryRESPONSABLE = $_REQUEST["responsable"];
//$queryTELEFONO = $_REQUEST["telefono"];
//$queryCOPIA = $_REQUEST["copia"];

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$sql = "DELETE FROM estaciones WHERE id = ".$queryID;
$result = $con->query($sql);
//echo $sql;
//echo $result;
if ($result > 0) {
	echo "Eliminacion Correcta";
} else {
	echo "Eliminacion Incorrecta";
}
$con->close();
?>