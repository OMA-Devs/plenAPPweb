<?php

include "connect.php";

$queryUSER = $_REQUEST["user"];

$sql = "SELECT * FROM users WHERE nombre = '".$queryUSER."'";

$result = $con->query($sql);

if ($result->num_rows > 0) {
// output data of each row
	while($row = $result->fetch_assoc()) {
		?>
		<div class = "w3-content" style = "width: 30%">
		<h2 class= "w3-center"><?php echo $row["nombre"];?></h2>
		<ul>
			<li>Permiso administracion: <?php echo $row["PERMadmin"];?></li>
			<li>Permiso historicos: <?php echo $row["PERMhistoricos"];?></li>
			<li>Permiso incidencias: <?php echo $row["PERMincidencias"];?></li>
		</ul>
		</div>
		<?php
	}
}
$con->close();
?>