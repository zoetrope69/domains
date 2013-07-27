<?php
	require('connect.php');

	$wordApi = new WordApi($client);

	// if it's a post request
	if($_SERVER['REQUEST_METHOD'] === 'POST'){

		// get the word and convert any html
		$word = htmlentities($_POST['word']);

		// if getting a definition brings back a results
		if($definitions = $wordApi->getDefinitions($word, $partOfSpeech=null, $sourceDictionaries=null, $limit=1)){
			
			$definition = $definitions[0]->text;
			$source = $definitions[0]->sourceDictionary;
			print '<span title="Source: '.$source.'">' .$definition. '</span>';

		// else no definition, get fall back
		}else{
			print 'Erm, couldnt find a definition for "'.$word.'"... Try <a href="http://dictionary.reference.com/browse/'.$word.'">looking it up</a> here?';
		}
	
	// not a post request? print a snarky comment
	}else{
		print 'What are you doing here? Use the app!';
	}

?>