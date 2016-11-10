<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");

if (!empty($request->printer_id) && $request->printer_id != "0") {
	$db->query("DELETE FROM printers WHERE printer_id=".$request->printer_id.";");
	$outp="true";
}else{
	$outp='false';	
}


echo $outp;
?>