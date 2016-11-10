<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");


if (!empty($_GET["user_id"]) || !empty($_GET["music_id"]) ) {
	$requser["user_id"]=$_GET["user_id"];
	$requser["music_id"]=$_GET["music_id"];
	$requser["circle_id"]=$_GET["circle_id"];

	if($requser["music_id"]==0){
		$result='true';
		$db->query("UPDATE user SET last_action=NOW(), status=1,current_music='".$requser["music_id"]."' WHERE user_id='".$requser["user_id"]."';");
	}else{
		$dbresult=$db->query("SELECT music_id from music_join WHERE music_id=".$requser["music_id"]." AND circle_id=".$requser["circle_id"].";")->fetchAll();
		if(empty($dbresult)){
			$result="false";
		}else{
			$result='true';
			$db->query("UPDATE user SET last_action=NOW(), status=1,current_music='".$requser["music_id"]."' WHERE user_id='".$requser["user_id"]."';")->fetchAll();
			$db->query("UPDATE music SET view_counter= view_counter + 1 WHERE music_id='".$requser["music_id"]."';")->fetchAll();		
		}
	}
}else{
	$result='false';
}

	

$outp=$result;

echo $outp;
?>