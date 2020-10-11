<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

$queryUSER = $_REQUEST["usr"];
$queryPASS = $_REQUEST["pass"];

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$sql = "SELECT * FROM users WHERE nombre IN ('$queryUSER') AND pass IN ('$queryPASS')";
//echo $sql;
$result = $con->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
	while($row = $result->fetch_assoc()) {
		echo "Login Correcto";
	}
} else {
	echo "Usuario/Contraseña Incorrecto";
}
$con->close();
?>
