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
}elseif ($queryTYPE == "getAbiertas"){
  $inc_abiertas = $con->query("SELECT * FROM inc_abiertas");
  $incARR = array();
  while ($inc = $inc_abiertas->fetch_assoc()){
    array_push($incARR, $inc);
  }
  $myJSON = json_encode($incARR);
  echo $myJSON;
}elseif ($queryTYPE == "getPresets"){
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
  $myJSON->incidencias = $incARR;
  $myJSON->resoluciones = $resARR;
  $myJSON->llamadaDE = $llamARR;

  $myJSON = json_encode($myJSON);

  echo $myJSON;
}elseif ($queryTYPE == "close"){
  $queryID = $_REQUEST["id"];
  $queryFECHA = $_REQUEST["fecha"];
  $queryLLAMADAS = $_REQUEST["llamadas"];
  $queryINCIDENCIA = $_REQUEST["incidencia"];
  $queryRESOLUCION = $_REQUEST["resolucion"];
  $queryLLAMADADE = $_REQUEST["llamadaDE"];
  $queryTELEFONOGUARDIA = $_REQUEST["telefonoguardia"];
  $queryINCOMPLETO = $_REQUEST["incompleto"];
  $queryREVISION = $_REQUEST["revision"];
  $estacionNAME = $_REQUEST["nombre"];

  $sql = "";

  if ($queryINCOMPLETO == "true" or $queryREVISION == "true"){
    $sql = "INSERT INTO inc_incompletas (fecha, estacion, gestion, terminada, llamadas, incidencia, resolucion, llamadade, telfguardia)
    VALUES ('".$queryFECHA."','".$estacionNAME."',0,0,".$queryLLAMADAS.",'".$queryINCIDENCIA."','".$queryRESOLUCION."','".$queryLLAMADADE."',";
    if ($queryTELEFONOGUARDIA == "si"){
      $sql = $sql."1)";
    }else{
      $sql = $sql."0)";
    }
  }else{
    $sql = "INSERT INTO inc_cerradas (id, fecha, estacion, gestion, terminada, llamadas, incidencia, resolucion, llamadade, telfguardia)
    VALUES (".$queryID.",'".$queryFECHA."','".$estacionNAME."',0,0,".$queryLLAMADAS.",'".$queryINCIDENCIA."','".$queryRESOLUCION."','".$queryLLAMADADE."',";
    if ($queryTELEFONOGUARDIA == "si"){
      $sql = $sql."1)";
    }else{
      $sql = $sql."0)";
    }
  }
  $result = $con->query($sql);
  //echo '<p>'.$result.'</p>';
  if ($result > 0) {
    //echo "Incidencia traspasada correctamente";
    $sql = "DELETE FROM inc_abiertas WHERE id = ".$queryID;
    $result = $con->query($sql);
    if ($result > 0) {
      echo "Incidencia traspasada correctamente";
    } else {
      echo "Incidencia continua ABIERTA. Consultar con administrador.";
    }
  } else {
    echo "Incidencia no traspasada";
  }
  $con->close();
  //var valARR = ["close",id, fecha,llamadas,incidencia, resolucion, llamadaDE, telefonoguardia, incompleto, revision]
}
?>