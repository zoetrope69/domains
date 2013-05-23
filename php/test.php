<?php
	require('connect.php');
	$wordApi = new WordApi($client);
	$word = $_POST['word'];
	$definitions = $wordApi->getDefinitions($word, $partOfSpeech=null, $sourceDictionaries=null, $limit=1);
	$definition = $definitions[0]->text;
	$source = $definitions[0]->sourceDictionary;
	print '<span title="Source: '.$source.'">' .$definition. '</span>';
?>