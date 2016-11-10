<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");

// user_name	varchar(255)
// user_id	int(11)		
// status	int(11)		
// created_at	timestamp
// last_connection	timestamp

if (!empty($request->user_id)) {
	$db->query("UPDATE user SET status=0 WHERE user_id='".$request->user_id."';")->fetchAll();	
}
if (!empty($_GET["user_id"])) {
	$db->query("UPDATE user SET status=0 WHERE user_id='".$_GET["user_id"]."';")->fetchAll();	
}

echo "true";
?>