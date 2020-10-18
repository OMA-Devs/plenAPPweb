<?php
include "connect.php";

/*Script que maneja las operaciones con indicencias.
El parametro de query "TYPE" indica la operacion a realizar

- SHOW: extrae todas las incidencias abiertas
- ADD: pasa una nueva incidencia al sistema.

*/
$queryTYPE = $_REQUEST["type"];

if ($queryTYPE == "add"){
  $queryFECHA = $_REQUEST["fecha"];
  $queryTELEFONO = $_REQUEST["telefono"];
  $estacionNAME = "";
  //Buscamos el nombre de la estacion por telefono
  $sql = "SELECT * FROM estaciones WHERE telefono = ".$queryTELEFONO;
  //echo $sql;
  $result = $con->query($sql);
  if ($result->num_rows > 0){
    //echo '<p>Telefono coincidente con base de datos.<p>';
    while($row = $result->fetch_assoc()) {
      //Asignamos el nombre de la estacion a la variable.
      $estacionNAME = $row["nombre"];
      //echo '<p>Nombre de la estacion identificado. '.$row[nombre].'</p>';
    }
    //Comprobamos que no exista ninguna incidencia abierta de esa estacion.
    $sql = "SELECT * FROM inc_abiertas WHERE estacion = '".$estacionNAME."' AND terminada = 0";
    //echo $sql;
    $result = $con->query($sql);
    //echo $result->num_rows;
    if ($result->num_rows > 0) {
      //echo '<p>Incidencia de la estacion YA ABIERTA.</p>';
      //Sumamos 1 al registro de llamadas de la incidencia ya abierta
      $actLLAMADAS = $result->fetch_assoc()["llamadas"];
      $actLLAMADAS = $actLLAMADAS+1;
      $sql = "UPDATE inc_abiertas SET llamadas = ".$actLLAMADAS." WHERE estacion = '".$estacionNAME."' AND terminada = 0";
      //echo $sql;
      $result = $con->query($sql);
      echo 'Registro actualizado.</p>';
    } else {
      //Insertamos la fila en la tabla correspondiente.
      $sql = "INSERT INTO inc_abiertas (fecha, estacion, gestion, terminada, llamadas) VALUES ('".$queryFECHA."','".$estacionNAME."',0,0,1)";
      //echo '<p>Incidencia no abierta PREVIAMENTE: '.$sql.'</p>';
      $result = $con->query($sql);
      //echo '<p>'.$result.'</p>';
      if ($result > 0) {
        echo "Nueva incidencia añadida";
      } else {
        echo "Incidencia no añadida";
      }
    }
  }else{
    echo 'Numero de telefono no coincidente con la base de datos.';
  }
  $con->close();
}elseif ($queryTYPE == "show"){
  $inc_abiertas = $con->query("SELECT * FROM inc_abiertas");
  //Extraemos los preset de incidencias a un array para uso multiple
  $incARR = array();
  $incidenciasRES = $con->query("SELECT * FROM presets WHERE tipo = 'incidencia'");
  while($incOPT = $incidenciasRES->fetch_assoc()) {
    array_push($incARR,$incOPT["nombre"]);
  }
  //Extraccion de los preset de resoluciones
  $resARR = array();
  $resolucionesRES = $con->query("SELECT * FROM presets WHERE tipo = 'resolucion'");
  while($incOPT = $resolucionesRES->fetch_assoc()) {
    array_push($resARR,$incOPT["nombre"]);
  }
  //Extraccion de los preset de llamadas
  $llamARR = array();
  $llamadaDERES = $con->query("SELECT * FROM presets WHERE tipo = 'llamadaDE'");
  while($incOPT = $llamadaDERES->fetch_assoc()) {
    array_push($llamARR,$incOPT["nombre"]);
  }
  ?>
  <div class="w3-cell-row">
  <?php
  while ($inc = $inc_abiertas->fetch_assoc()){
    echo '<div id ="'.$inc["fecha"].'" class="w3-cell w3-border">';
    echo '<h2 class = "w3-center">'.$inc["estacion"]."</h2>";
    echo '<label for="incidencia-'.$inc["fecha"].'">INCIDENCIA: </label>';
    echo '<select id="incidencia-'.$inc["fecha"].'" name="incidencia">';
    echo '<hr>'; 
    for($x = 0; $x < count($incARR); $x++) {
      echo '<option value="'.$incARR[$x].'">'.$incARR[$x].'</option>';
    } ?>
    </select>
  </div>
  <?php
  }
}
?>