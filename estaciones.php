<?php

$db = "plenapp";
$usrDB = "plenoil";
$pasDB = "plen2019";
$hostDB = "localhost";

//$queryUSER = $_REQUEST["usr"];
//$queryPASS = $_REQUEST["pass"];

$con = new mysqli($hostDB, $usrDB, $pasDB, $db);

if ($con->connect_error) {
  die("Connection failed: " . $con->connect_error);
}

$sql = "SELECT * FROM estaciones";
//echo $sql;
$result = $con->query($sql);
//echo $result;
echo '<div>';
echo '<h2 style = "display: inline-block">ESTACIONES</h2>';
echo '<p class="fa fa-plus w3-button w3-border w3-card-2 w3-right" style = "display: inline-block"></p>';
echo '</div>';
echo '<table class="w3-center" style="width:100%">';
echo '<tr><th>ID</th>';
echo '<th>NOMBRE</th>';
echo '<th>RESPONSABLE</th>';
echo '<th>COPIA</th>';
echo '</tr>';
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    //ID,NOMBRE,RESPONSABLE,COPIA
    echo '<tr>';
    echo '<td>'.$row[id].'</td>';
    echo '<td>'.$row[nombre].'</td>';
    echo '<td>'.$row[responsable].'</td>';
    echo '<td>'.$row[copia].'</td>';
    echo '</tr>';
  }
echo '</table>';
}
$con->close();
?>
