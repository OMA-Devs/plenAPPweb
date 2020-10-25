<?php
include 'connect.php';

/* Esta variable del query determina la funcion referente a ESTACIONES que se va a ejecutar y se
comprueba en un bucle inicial IF para saber que parte del SCRIPT ejecutar.

- SHOW : Mostrar las estaciones y devolver HTML
- ADD: Añadir estaciones
- DELETE: Eliminar estaciones
- EDIT: Editar estaciones

*/
$queryTYPE = $_REQUEST["type"];

if ($queryTYPE == "show"){
  $sql = "SELECT * FROM responsables";
  $result = $con->query($sql);
  ?>
  <div>
  <h2 style = 'display: inline-block'>RESPONSABLES</h2>
  <p class='fa fa-plus w3-button w3-border w3-card-2 w3-right' style = 'display: inline-block' onclick = coreACTIONS.addRow("responsables.php")></p>
  <p class='fa fa-pencil w3-button w3-border w3-card-2 w3-right' style = 'display: inline-block' onclick = coreUI.toogleEdit(this)></p>
  <p class='fa fa-trash-o w3-button w3-border w3-card-2 w3-right' style = 'display: inline-block' onclick = coreUI.toogleDelete(this)></p>
  </div>
  <table id='activeTable' class='w3-table w3-striped w3-center' style='width:100%'>
  <tr>
    <th style = 'display: none'>ID</th>
    <th>NOMBRE</th>
    <th>CORREO</th>
  </tr>
  <?php
  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      //ID,NOMBRE,RESPONSABLE,COPIA
      echo '<tr>';
      echo '<td style = "display: none">'.$row["id"].'</td>';
      echo '<td onclick=coreUI.getValue(this.parentElement),coreACTIONS.editTable(this,"responsables.php")>'.$row["nombre"].'</td>';
      echo '<td onclick=coreUI.getValue(this.parentElement),coreACTIONS.editTable(this,"responsables.php")>'.$row["correo"].'</td>';
      echo '</tr>';
    }
  echo '</table>';
  }
  $con->close();
}elseif ($queryTYPE == "add"){
  $queryNOMBRE = $_REQUEST["nombre"];
  $queryMAIL = $_REQUEST["correo"];

  $sql = "INSERT INTO responsables (nombre, correo) VALUES ('".$queryNOMBRE."','".$queryMAIL."')";
  $result = $con->query($sql);
  if ($result > 0) {
    echo "Insercion Correcta";
  } else {
    echo "Insercion Incorrecta";
  }
  $con->close();
}elseif ($queryTYPE == "delete"){
  $queryID = $_REQUEST["id"];

  $sql = "DELETE FROM responsables WHERE id = ".$queryID;
  $result = $con->query($sql);
  //echo $sql;
  //echo $result;
  if ($result > 0) {
    echo "Eliminacion Correcta";
  } else {
    echo "Eliminacion Incorrecta";
  }
  $con->close();
}elseif ($queryTYPE == "edit"){
  $queryID = $_REQUEST["id"];
  $queryNOMBRE = $_REQUEST["nombre"];
  $queryMAIL = $_REQUEST["correo"];

  $sql = "UPDATE responsables SET nombre = '".$queryNOMBRE."', correo = '".$queryMAIL."' WHERE id = ".$queryID;
  $result = $con->query($sql);
  //echo $result;
  if ($result > 0) {
    echo "Edicion Correcta";
  } else {
    echo "Edicion Incorrecta";
  }
  $con->close();
}
  ?>
