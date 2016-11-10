<?php
//header("Access-Control-Allow-Origin: *"); //to get cross site access
header("Content-Type: application/json; charset=UTF-8");

require("../DBConnect.php");

// 1	circle_id	int(11) 
// 2	circle_name	varchar(255)
// 3	created_at	timestamp
// 4	user_id	int(11)
// 5	private bool

if(!empty($_GET["user_id"])){
	$result = $db->query("SELECT circle.circle_id, circle_name, circle.created_at, circle.user_id, private, count(user.user_id) as user_count
		FROM circle 
		INNER JOIN circle_join on circle.circle_id=circle_join.circle_id
		LEFT JOIN user on circle.circle_id=user.current_circle
		WHERE private=1 AND circle_join.user_id=".$_GET["user_id"]." GROUP BY circle_id;")->fetchAll();
}


$outp = "";
foreach ($result as $rs) {
    if ($outp != "") {$outp .= ",";} 
    $outp .= '{"key":"'.$rs["circle_id"].'",';
    $outp .= '"value":{"circle_id":'.$rs["circle_id"].', "circle_name":"'.$rs["circle_name"].'", "user_count":"'.$rs["user_count"].'", "user_id":'.$rs["user_id"].',';
    $outp .= ' "created_at":"'.$rs["created_at"].'", "private":"'.$rs["private"].'"}}';
}
$outp ='['.$outp.']';
$db=null;

echo($outp);
?>