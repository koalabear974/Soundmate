<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

require("../DBConnect.php");

if (empty($request->circle_id) || $request->circle_id == "0") {
	if(!empty($_GET["user_id"]) && !empty($request->circle_name)){
		
		$circle["circle_name"]=$request->circle_name;
		$circle["user_id"]=$_GET["user_id"];
		if(!empty($request->private_circle) && $request->private_circle=="true"){
			$circle["private"]="1";
		}else{
			$circle["private"]="0";
		}

		$tempRes=$db->query("SELECT circle_name FROM circle WHERE circle_name='".$circle["circle_name"]."';")->fetchAll();
		if(empty($tempRes)){
			$db->query("INSERT INTO circle (circle_name,user_id,private,created_at) VALUES('".$circle["circle_name"]."','".$circle["user_id"]."',".$circle["private"].", NOW())");
			$circleId=$db->lastInsertId();
			
			if($circle["private"]=="1"){
				$db->query("INSERT INTO circle_join (circle_id,user_id) VALUES(".$circleId.",".$circle["user_id"].")");
			}
			

			$result='true';
			$status='Cercle n.'.$circleId." correctement créé !";

		}else{
			$result='false';
			$status='Ce nom est déjà pris :(';
		}			
		
		
	}else{
		$result='false';
		$status='Nom du cercle nécessaire';
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