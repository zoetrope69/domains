(function(){ loadWikiData(); })() // On load

// Function for fallback from JSONP
wikiData = function(json){
	var output = "";
	try{ output = processWikiData(json).join(' | '); }
	catch(error){ output = '<p>Cannot get data from Wikipedia. <span class="error">Error: (' + error + ')</span></p>'; }
	$('body').html('<p>' + output + '</p>');
};

// Process the JSON and get back an array of domain names
function processWikiData(json){
	var regEx = /\[\[\.[A-z.]*\]\]/; // '[[.' then a string with lower and upper case letters and periods followed by ']]'
	for(var firstObj in json.query.pages) break; // Gets first revision object name
	var text = json.query.pages[firstObj].revisions[0]["*"]; // The text for the page
	var domains = [];
	while(regEx.test(text)){ // Loops while there is an index of the regex
		domain = regEx.exec(text)[0]; // Grabs the string that it matches
		domains.push(domain.substring(2, domain.length - 2)); // Adds the domain prettified to the array
		text = text.replace(regEx, ''); // Removes it from the text we're searching
	}
	return domains;
}

// Load Wikipedia JSONP function to get the data
function loadWikiData(){
	var wikiTitle = 'List_of_Internet_top-level_domains'; // Title of the Wikipedia page
	var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&callback=wikiData&titles=' + wikiTitle;
	$.ajax({ url: wikiUrl, dataType: 'script', async: false })
}