<?php
/*****************************
 * ATTENTION A SECURISER !!! *
 * NE PAS UTILISER EN L'ETAT *
 *****************************/

$params = file_get_contents("php://input");
$json=json_decode($params, true);

$file = '../js/resultats.json';
file_put_contents($file, $params);
?>
