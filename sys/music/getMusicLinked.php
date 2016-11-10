<?php
//header("Access-Control-Allow-Origin: *"); //to get cross site access
header("Content-Type: application/json; charset=UTF-8");

require("../DBConnect.php");
// music_id		int(11)			
// url			varchar(255)	
// view_counter	int(11)			
// like_counter	int(11)			
// posted_by	int(11)			
// music_title	varchar(255)	
// posted_at	int(11)		

if(!empty($_GET["circle_id"])){
	$dbresult = $db->query("SELECT music.music_id,url,view_counter,like_counter,user.user_name,posted_by,posted_at,music_title,link_id,src
		FROM music
		INNER JOIN music_join ON music.music_id=music_join.music_id 
		INNER JOIN user ON music.posted_by=user.user_id 
		WHERE music_join.circle_id=".$_GET["circle_id"]."
		ORDER BY posted_at asc;")->fetchAll();
	
}else{
	$dbresult=array();
}

$outp = "";
foreach ($dbresult as $rs) {
    if ($outp != "") {$outp .= ",";} 
    $outp .= '{"key":"'.$rs["music_id"].'",';
    $outp .= '"value":{"music_id":'.$rs["music_id"].', "url":"'.$rs["url"].'",';
    $outp .= ' "view_counter":'.$rs["view_counter"].', "like_counter":'.$rs["like_counter"].', "user_name":"'.$rs["user_name"].'",';
    $outp .= ' "music_title":"'.$rs["music_title"].'", "link_id":"'.$rs["link_id"].'", "src":"'.$rs["src"].'",';
    $outp .= ' "posted_by":'.$rs["posted_by"].', "posted_at":"'.$rs["posted_at"].'"}}';
}
$outp ='['.$outp.']';
$db=null;

echo($outp);
?>