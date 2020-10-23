<?php

include "connect.php";

$queryTYPE = $_REQUEST["type"];

if ($queryTYPE == "show"){
	?>
	<div class = "w3-content" style="width: 30%">
		<input type="text" id="usr" class="w3-xxlarge" style = "width: 100%" placeholder="Usuario">
		<br>
		<input type="text" id="pass" class="w3-xxlarge" style = "width: 100%" placeholder="Password">
		<br>
		<p class="w3-button w3-border w3-xxlarge" style = "width:100%" onclick="calls.login()">Acceder</p>
	</div>
	<?php
}elseif ($queryTYPE == "auth"){
	$queryUSER = $_REQUEST["usr"];
	$queryPASS = $_REQUEST["pass"];

	$sql = "SELECT * FROM users WHERE nombre IN ('$queryUSER') AND pass IN ('$queryPASS')";
	//echo $sql;
	$result = $con->query($sql);

	if ($result->num_rows > 0) {
	// output data of each row
		while($row = $result->fetch_assoc()) {
			$myJSON->usuario = $row;
			$myJSON->resp = "Login Correcto";
			$myJSON = json_encode($myJSON);
			echo $myJSON;
		}
	} else {
		$myJSON->usuario = "";
		$myJSON->resp = "Usuario/Contraseña Incorrecto";
		$myJSON = json_encode($myJSON);
		echo $myJSON;
	}
	$con->close();
}
	?>
