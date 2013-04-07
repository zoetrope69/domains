wikiData = function(json){
	var output = "";
	try{ output = getWikiData(json); }
	catch(error){ output = '<p>Cannot get data from Wikipedia. <span class="error">Error: (' + error + ')</span></p>'; }
	$('body').html('<p>' + output + '</p>');
};

function getWikiData(json){
	var regEx = /\[\[\.[A-z.]*\]\]/; // '[[.' then a string with lower and upper case letters and periods followed by ']]'
	for(var firstObj in json.query.pages) break; // Gets first revision object name
	var text = json.query.pages[firstObj].revisions[0]["*"]; // The text for the page
	var domains = [];
	while(regEx.test(text)){ // Loops while there is an index of the regex
		domain = regEx.exec(text)[0]; // Grabs the string that it matches
		domains.push(domain.substring(2, domain.length - 2)); // Adds the domain prettified to the array
		text = text.replace(regEx, ''); // Removes it from the text we're searching
	}
	return domains.join(' | ');
}