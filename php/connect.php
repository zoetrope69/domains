<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	require('wordnik/Swagger.php');
	$myAPIKey = 'fabba71775ec0ac0e200f05d1910b2778b90d5f5fc37e5569';
	$client = new APIClient($myAPIKey, 'http://api.wordnik.com/v4');
?>