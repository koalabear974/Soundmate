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


if (!empty($_GET["user_id"]) || !empty($_GET["circle_id"]) ) {
	$requser["user_id"]=$_GET["user_id"];
	$requser["circle_id"]=$_GET["circle_id"];

	$dbresult = $db->query("SELECT circle_join.user_id, circle.circle_id, circle.private 
		FROM  circle
		LEFT JOIN circle_join ON circle.circle_id=circle_join.circle_id
		WHERE circle.circle_id='".$requser["circle_id"]."' AND (circle_join.user_id IS NULL or circle_join.user_id='".$requser["user_id"]."');")->fetchAll();

	if(!empty($dbresult) && ($dbresult[0]["private"]==0 || ($dbresult[0]["private"]==1 && $dbresult[0]["user_id"]!=""))){
		$result='true';
		$db->query("UPDATE user SET last_action=NOW(), status=1,current_circle='".$requser["circle_id"]."' WHERE user_id='".$requser["user_id"]."';")->fetchAll();	
	
	}else{
		$result='false';
	}
		
}else{
	$result='false';
}

	

$outp=$result;

echo $outp;
?>