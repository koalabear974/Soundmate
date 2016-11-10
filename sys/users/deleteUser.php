<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");

if (!empty($request->user_id) && $request->user_id != "0") {
	$db->query("DELETE FROM users WHERE user_id=".$request->user_id.";");
	$outp="true";
}else{
	$outp='false';	
}


echo $outp;
?>