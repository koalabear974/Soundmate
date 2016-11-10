<?php
//header("Access-Control-Allow-Origin: *"); //to get cross site access
header("Content-Type: application/json; charset=UTF-8");

require("../DBConnect.php");

// 1	circle_id	int(11) 
// 2	circle_name	varchar(255)
// 3	created_at	timestamp
// 4	user_id	int(11)
// 5	private bool
$result = $db->query("SELECT circle_id, circle_name, circle.created_at, circle.user_id, private, count(user.user_id) as user_count
	FROM circle 
	LEFT JOIN user ON user.current_circle=circle.circle_id
	WHERE private=0 GROUP BY circle_id;")->fetchAll();


$outp = "";
foreach ($result as $rs) {
    if ($outp != "") {$outp .= ",";} 
    $outp .= '{"key":"'.$rs["circle_id"].'",';
    $outp .= '"value":{"circle_id":'.$rs["circle_id"].', "circle_name":"'.$rs["circle_name"].'", "user_count":'.$rs["user_count"].', "user_id":'.$rs["user_id"].',';
    $outp .= ' "created_at":"'.$rs["created_at"].'", "private":"'.$rs["private"].'"}}';
}
$outp ='['.$outp.']';
$db=null;

echo($outp);
?>