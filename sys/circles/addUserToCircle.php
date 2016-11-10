<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");

if (!empty($request->circle_id) && !empty($request->user_name)) {

	$circle["user_name"]=$request->user_name;
	$circle["circle_id"]=$request->circle_id;

	$tempRes2=$db->query("SELECT user_id FROM user WHERE user_name='".$circle["user_name"]."';")->fetchAll();
	if(!empty($tempRes2)){
		$tempRes=$db->query("SELECT circle_id FROM circle_join WHERE circle_id=".$circle["circle_id"]." AND user_id=".$tempRes2[0]["user_id"].";")->fetchAll();
		if(empty($tempRes)){
			$db->query("INSERT INTO circle_join (circle_id,user_id) VALUES(".$circle["circle_id"].",".$tempRes2[0]["user_id"].")");
			
			$result='true';
			$status=ucfirst($circle["user_name"]).' a bien été rajouté !';
		}else{
			$result='false';
			$status='Cette personne est déjà invité dans le cercle !';
		}
	}else{
		$result='false';
		$status='Cette personne n\'éxiste pas :(';
	}			
}else{
	// $db->query("UPDATE circles set circle_name='".$request->circle_name."', user_id=".$request->user_id.", circle_type='".$request->circle_type."', description='".$request->description."', updated_at=NOW() WHERE circle_id=".$request->circle_id.";");
 //  	$db->query("INSERT INTO circleslink (circle_id,user_id) VALUES (".$request->circle_id.",".$request->user_id.");");
	// $result='true';
	// $status='modified';	
	$result='false';
	$status='Error';

}


	

$outp='{"value":'.$result.',"status":"'.$status.'"}';

echo $outp;
?>