<?php
//header("Access-Control-Allow-Origin: *"); //to get cross site access
header("Content-Type: application/json; charset=UTF-8");

require("../DBConnect.php");


if(!empty($_GET["circle_id"])){
	$dbresult = $db->query("SELECT private 
		FROM circle 
		WHERE circle_id=".$_GET["circle_id"].";")->fetchAll();
	if($dbresult[0][0]=="0") {	//mean it's public
		$dbresult = $db->query("SELECT user.user_id, user_name,music.music_title,current_music,last_action,status
			FROM user 
			LEFT JOIN music ON user.current_music=music.music_id
			WHERE current_circle=".$_GET["circle_id"]."
			ORDER BY last_action DESC;")->fetchAll();
	}else{ // mean it's private
		$dbresult = $db->query("SELECT user.user_id, user_name,music.music_title, current_music,last_action,status
			FROM user 
			INNER JOIN circle_join ON circle_join.user_id=user.user_id
			LEFT JOIN music ON user.current_music=music.music_id
			WHERE circle_join.circle_id=".$_GET["circle_id"]."
			ORDER BY last_action DESC;")->fetchAll();
		
	}
	
}else{
	$dbresult=array();
}

$outp = "";
foreach ($dbresult as $rs) {
    if ($outp != "") {$outp .= ",";} 
    $outp .= '{"key":"'.$rs["user_id"].'",';
    $outp .= '"value":{"user_id":'.$rs["user_id"].', "user_name":"'.$rs["user_name"].'", "music_title":"'.$rs["music_title"].'",';
    $outp .= ' "current_music":'.$rs["current_music"].', "status":'.$rs["status"].', "last_action":"'.$rs["last_action"].'"}}';
}
$outp ='['.$outp.']';
$db=null;

echo($outp);
?>