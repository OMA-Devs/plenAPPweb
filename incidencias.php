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
?>

<!--h2 class = "w3-center">¿Hay llamada?</h2>
<div class = "w3-center" style= "width:100%">
	<p class="w3-button w3-jumbo w3-green" style= "width: 20%">SI</p>
	<p class="w3-button w3-jumbo w3-red" style= "width: 20%">NO</p>
</div>
<hr-->
<label for="incidencia">INCIDENCIA: </label>
<select id="incidencia" name="incidencia">

<?php
$sql = "SELECT * FROM presets WHERE tipo = 'incidencia'";
$result = $con->query($sql);
//echo $result;
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo '<option value="'.$row[nombre].'">'.$row[nombre].'</option>';
  }
}
?>

</select>
<label for="resolucion">RESOLUCION: </label>
<select id="resolucion" name="resolucion">

<?php
$sql = "SELECT * FROM presets WHERE tipo = 'resolucion'";
$result = $con->query($sql);
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo '<option value="'.$row[nombre].'">'.$row[nombre].'</option>';
  }
}
?>

</select>
<label for="llamadaDE">LLAMADA DE: </label>
<select id="llamadaDE" name="llamadaDE">

<?php
$sql = "SELECT * FROM presets WHERE tipo = 'llamadaDE'";
$result = $con->query($sql);
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo '<option value="'.$row[nombre].'">'.$row[nombre].'</option>';
  }
}
$con->close();
?>

</select>
<label for="solucionado">SOLUCIONADO: </label>
<select id="solucionado" name="solucionado">
	<option value="si">Si</option>
	<option value="si">No</option>
</select>
<label for="telefono">TELEFONO DE GUARDIA: </label>
<select id="telefono" name="telefono">
	<option value="si">Si</option>
	<option value="si">No</option>
</select>
<label for="tRespuesta">TIEMPO DE RESPUESTA: </label>
<input id="tRespuesta" name="tRespuesta"></input>
<!--p class="w3-button">ADJUNTAR</p-->
<p class="w3-button w3-card-2 w3-border">ENVIAR</p>