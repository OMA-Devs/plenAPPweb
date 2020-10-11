<?php
$querySTR = $_REQUEST["str"];
header('Content-Type: text/html');
readfile($querySTR.".html");
?>

