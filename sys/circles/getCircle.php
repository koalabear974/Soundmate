<?php
//header("Access-Control-Allow-Origin: *"); //to get cross site access
header("Content-Type: application/json; charset=UTF-8");

require("../DBConnect.php");

// 1	circle_id	int(11) 
// 2	circle_name	varchar(255)
// 3	created_at	timestamp
// 4	user_id	int(11)
// 5	private bool

if(!empty($_GET["circle_id"])){
	$result = $db->query("SELECT circle.circle_id, circle_name, created_at, circle.user_id, private 
		FROM circle 
		WHERE circle.circle_id=".$_GET["circle_id"].";")->fetchAll();
}else{
	$result=array();
}


$outp = "";
foreach ($result as $rs) {
    if ($outp != "") {$outp .= ",";} 
    $outp .= '{"key":"'.$rs["circle_id"].'",';
    $outp .= '"value":{"circle_id":'.$rs["circle_id"].', "circle_name":"'.$rs["circle_name"].'", "user_id":'.$rs["user_id"].',';
    $outp .= ' "created_at":"'.$rs["created_at"].'", "private":"'.$rs["private"].'"}}';
}
$outp ='['.$outp.']';
$db=null;

echo($outp);
?>