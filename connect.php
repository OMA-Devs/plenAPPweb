<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

?>