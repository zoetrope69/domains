<?php
	require('connect.php');

	$wordApi = new WordApi($client);
	$word = $_POST['word'];

	if($definitions = $wordApi->getDefinitions($word, $partOfSpeech=null, $sourceDictionaries=null, $limit=1)){
		$definition = $definitions[0]->text;
		$source = $definitions[0]->sourceDictionary;
		$output = '<span title="Source: '.$source.'">' .$definition. '</span>';
	}else{
		$output = 'Erm, couldnt find a definition...';
	}

	print $output;
?>