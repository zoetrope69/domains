(function(){ loadWikiData(); })() // On load

// Function for fallback from JSONP
wikiData = function(json){
	try{ var output = processWikiData(json); }
	catch(error){ var output = '<p>Cannot get data from Wikipedia. <span class="error">Error: (' + error + ')</span></p>'; }
	processWords(output);
};

// Process the JSON and get back an array of domain names
function processWikiData(json){
	var regEx = /\[\[\.[A-z.]*\]\]/; // '[[.' then a string with lower and upper case letters and periods followed by ']]'
	for(var firstObj in json.query.pages) break; // Gets first revision object name
	var text = json.query.pages[firstObj].revisions[0]["*"]; // The text for the page
	var domains = [];
	while(regEx.test(text)){ // Loops while there is an index of the regex
		domain = regEx.exec(text)[0]; // Grabs the string that it matches
		domains.push(domain.substring(3, domain.length - 2)); // Adds the domain prettified to the array
		text = text.replace(regEx, ''); // Removes it from the text we're searching
	}
	return domains;
}

// Load Wikipedia JSONP function to get the data
function loadWikiData(){
	var title = 'List_of_Internet_top-level_domains'; // Title of the Wikipedia page
	var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&callback=wikiData&titles=' + title;
	$.ajax({ url: url, dataType: 'script', async: false });
}

// Stick in an array of words and it'll reverse them all.
function reverseWords(input){
	var output = [];
	for(var i = 0; i < input.length; i ++){
		output[i] = input[i].split('').reverse().join('');
	}
	return output;
}

//
function processWords(domains){
	var url = './mwords/113809of.fic';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){
		words = data.split('\n');
		var reversedDomains = reverseWords(domains).sort();
		var reversedWords = reverseWords(words).sort();
		//console.log(reversedDomains);
		console.log(reversedWords.join('\n'));
		matched = [];
		for(var i = 0; i < reversedWords.length; i++){
			for(var j = 0; j < reversedDomains.length; j++){
				var reversedDomain = reversedDomains[j].toString();
				var trimmedReversedWord = reversedWords[i].substring(0, reversedDomains[j].length + 1).toString().trim();
				var restOfWord = reversedWords[i].substring(reversedDomains[j].length + 1);
				if(reversedDomain == trimmedReversedWord){
					if(restOfWord != ''){
						//console.log(reversedDomain +"."+ restOfWord);
						matched.push(reversedDomain +"."+ restOfWord);
					}
				}
			}
		}
		var outputMatched = reverseWords(matched).sort();
		//console.log("Amount of domains: "+ outputMatched.length);
		$('header h3').fadeOut('fast').text('Here they are!').fadeIn('slow');
		var delay = 5;
		var randNo = Math.floor(Math.random() * outputMatched.length);
		if(randNo > (outputMatched.length - 200)){
			randNo = outputMatched.length - 200;
		}
		for(var i = randNo; i < (randNo + 200); i++){
			setTimeout(domainrCheck(outputMatched[i]), delay * 10000);
		}
	});
}

// domainr bit
function domainrCheck(domain){
	var url = 'http://domai.nr/api/json/info?callback=getDomainrData&q='+ domain;
	$.ajax({ url: url, dataType: 'script', async: false });
}

function getDomainrData(json){
	//console.log(json);
	//console.log("Domain: "+ json.domain +" | Available? "+ json.availability); 
	var link = ['',''];
	if(json.availability == 'available' || json.availability == 'maybe'){ link[0] = '<a href='+ json.register_url +'>', link[1] = '</a>'; }
	$('<p class='+ json.availability +'>'+ link[0] + json.domain + link[1] +'</p>').hide().appendTo('main').fadeIn('slow');
}

// filters
$('header a').click(function(){
	$('p.'+this.id).toggle();
});