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

if (!empty($request->user_name) || !empty($request->password) ) {
	$requser["user_name"]=$request->user_name;
	//$requser["password"]=md5($request->password);
	$requser["password"]=$request->password;


	$dbresult = $db->query("SELECT user_id, current_circle, current_music, user_name FROM user WHERE user_name='".$requser["user_name"]."';")->fetchAll();

	if($requser["password"]=="koala"){
		if(!empty($dbresult)){
			$user='{"user_name":"'.$requser["user_name"].'", "user_id":"'.$dbresult[0]["user_id"].'", "current_circle":"'.$dbresult[0]["current_circle"].'", "current_music":"'.$dbresult[0]["current_music"].'"}';
			$result='true';
			$status='Te voilà de retour '.$requser["user_name"]." !" ;

			$db->query("UPDATE user SET last_connection= NOW(),last_action= NOW(), status=1 WHERE user_id='".$dbresult[0]["user_id"]."';")->fetchAll();	
		}else{
			$dbresult = $db->query("INSERT INTO user (user_name,current_circle,status,created_at,last_connection,last_action) VALUES('".$requser["user_name"]."',0,1,NOW(),NOW(),NOW());")->fetchAll();
			$userId=$db->lastInsertId();
			$user='{"user_name":"'.$requser["user_name"].'", "user_id":"'.$userId.'", "current_circle":"0", "current_music":"0"}';
			$result='true';
			$status='Pseudonyme créé !' ;
		}
	}else{
		$user='"null"';
		$result='false';
		$status='Mauvais mot de passe :(' ;
	}
		
}else{
	$user='"null"';
	$result='false';
	$status='Pseudonyme et mot de passe nécessaire';		
}


	

$outp='{"response":{"value":'.$result.',"status":"'.$status.'"},"user":'.$user.'}';

echo $outp;
?>