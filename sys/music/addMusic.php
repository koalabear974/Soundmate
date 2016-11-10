<?php
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);


$youtubeKeyApi= "AIzaSyDwvA-Wkrw2yzsXarWFA15PY-PmpkUmGTg";
$posterBlackList=array("vevo","Vevo","VEVO");


require("../DBConnect.php");

function isInArray($array, $string){
	foreach ($array as $thing) {
	    if (strpos($string, $thing) !== FALSE) { // Yoshi version
	        return true;
	    }
	}
	return false;
}

if (!empty($_GET["user_id"]) && (!empty($request->circle_id) && $request->circle_id!=0)) {
	if(!empty($request->url) && $request->url != ""){
		
		$music["circle_id"]=$request->circle_id;
		$music["url"]=$request->url;
		$music["user_id"]=$_GET["user_id"];

		$alreadyIn=$db->query("SELECT music_id from music where url='".$music["url"]."';")->fetchAll();

		if(empty($alreadyIn)){
			parse_str( parse_url( $music["url"], PHP_URL_QUERY ), $my_array_of_vars );
			$videoId=$my_array_of_vars['v']; 

			$json = json_decode(file_get_contents("https://www.googleapis.com/youtube/v3/videos?key=".$youtubeKeyApi."&part=snippet&id=".$videoId));
			$videoJson = $json->items[0]->snippet;
			if(!empty($videoJson)){
				if(isInArray($posterBlackList,$videoJson->channelTitle)){
					$result='false';
					$status='Musique Vevo incompatible :(';
				}else{
					$srcImage=$videoJson->thumbnails->default->url;
					$musicTitle=str_replace("'", "\'", $videoJson->title);
					$musicTitle=str_replace('"', "\'", $videoJson->title);

					$date=date("Ymd");
					$db->query("INSERT INTO music(url,link_id,posted_by,music_title,posted_at,src) VALUES ('".$music["url"]."','".$videoId."',".$music["user_id"].",'".$musicTitle."', NOW(), '".$date."');");
					//echo "INSERT INTO music(url,link_id,posted_by,music_title,posted_at,src) VALUES ('".$music["url"]."','".$videoId."',".$music["user_id"].",'".$musicTitle."', NOW(), '".$date."');";
					$musicId=$db->lastInsertId();
					if($musicId!=0){
						$db->query("INSERT INTO music_join(music_id, circle_id) VALUES(".$musicId.", ".$music["circle_id"].");");
						$db->query("UPDATE user SET last_action=NOW(), status=1 WHERE user_id='".$music["user_id"]."';")->fetchAll();

						if(!is_dir("../../imgRepo/".$date."/")){
							mkdir("../../imgRepo/".$date."/",755);
							//chmod("../../imgRepo/".$date."/", 777);
						}
						file_put_contents("../../imgRepo/".$date."/".$musicId.".jpg", file_get_contents($srcImage));
					
						$result='true';
						$status='Musique ajouté au cercle :)';

					}else{
						$result='false';
						$status='Error';
					}
				}
			}else{
				$result='false';
				$status='Error';
			}

			// $poster=$json->data->uploader;
			// if(strpos($poster,"vevo") !== false){
			//   	echo "I can't eat vevo video :(.";
			// }else{
			// 	$srcImage=$json->data->thumbnail->sqDefault;
			//   	$musicTitle=$json->data->title;
			//   	$json=null;

			// 	$db->query("INSERT INTO music(url, post_by,music_title) VALUES ('".$_GET["url"]."',".$_SESSION["id"].",'".$musicTitle."');");
			// 	$musicId=$db->lastInsertId();
			// 	$db->query("INSERT INTO music_join(music_id, list_id) SELECT ".$musicId.", list_id from circle where circle_id in (SELECT circle_in from user_temp where user_id=".$_SESSION["id"].");");
				
			// 	file_put_contents("../imgRepo/".$musicId.".jpg", file_get_contents($srcImage));
			// 	echo "true";	
			// }
		}else{
			$alreadyInList=$db->query("SELECT music_id from music_join where music_id=".$alreadyIn[0][0]." and circle_id=".$music["circle_id"].";")->fetchAll();
			if(empty($alreadyInList)){
				$db->query("INSERT INTO music_join(music_id, circle_id) VALUES(".$alreadyIn[0][0].",".$music["circle_id"].");");	
				$result='true';
				$status="Ajouté au cercle";
			}else{
				$result='false';
				$status="Déjà dans le cercle !";
			}
		}
			
	}else{
		$result='false';
		$status='Url nécessaire';
	}
}else{
	$result='false';
	$status='Error';

}
	

$outp='{"value":'.$result.',"status":"'.$status.'"}';

echo $outp;
?>