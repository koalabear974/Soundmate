<?php
try{
	$db = new PDO('mysql:host=localhost;dbname=soundmatedbv2','root','MyPr0g') ;
}
catch(Exception $e){
	die('Erreur dans l\'ouverture de la BDD :'.$e->getMessage()) ;
}
?>
