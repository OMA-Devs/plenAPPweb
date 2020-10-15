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
?>

<div>
<h2 style = "display: inline-block">ESTACIONES</h2>
<p class="fa fa-plus w3-button w3-border w3-card-2 w3-right" style = "display: inline-block"></p>
<p class="fa fa-pencil w3-button w3-border w3-card-2 w3-right" style = "display: inline-block" onclick = toogleEdit(this)></p>
</div>
<table class="w3-table w3-striped w3-center" style="width:100%">
<tr>
  <th>NOMBRE</th>
  <th>RESPONSABLE</th>
  <th>TELEFONO</th>
  <th>COPIA</th>
</tr>

<?php
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    //ID,NOMBRE,RESPONSABLE,COPIA
    echo '<tr onclick=getValue(this)>';
    echo '<td style = "display: none">'.$row[id].'</td>';
    echo '<td onclick=editField(this)>'.$row[nombre].'</td>';
    echo '<td onclick=editField(this)>'.$row[responsable].'</td>';
    echo '<td onclick=editField(this)>'.$row[telefono].'</td>';
    echo '<td onclick=editField(this)>'.$row[copia].'</td>';
    echo '</tr>';
  }
echo '</table>';
}
$con->close();
?>
