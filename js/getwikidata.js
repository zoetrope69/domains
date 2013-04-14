// this file gets the wikipedia page and then writes the domains to a file

var request = require('request'); // for http
var fs = require('fs'); // for filesystem

function main(){

	var outputPath = '../txt/domains.txt';

	var title = 'List_of_Internet_top-level_domains'; // Title of the Wikipedia page
	var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + title;

	request(url, function(error, response, data){ // get that url's data uo
		if(!error && response.statusCode == 200){ // if there are no errors and if the request is a-OK
			var dataJSON = JSON.parse(data);
			var domains = processWikiData(dataJSON)
			domains = removeDuplicates(domains).sort();
			console.log(' - "' + title + '"" get...');
			fs.writeFileSync(outputPath, domains.join('\n'), 'utf8');
			console.log(' - "' + outputPath + '"" wrote...');
		}else{ console.log('Ah shit, error! \n' + error); }
	});
}

// Process the JSON and get back an array of domain names
function processWikiData(json){
	var regEx = /\[\[\.[A-z.]*\]\]/; // '[[.' then a string with lower and upper case letters and periods followed by ']]'
	for(var firstObj in json.query.pages) break; // Gets first revision object name
	var text = json.query.pages[firstObj].revisions[0]["*"]; // The text for the page
	var domains = [];
	while(regEx.test(text)){ // Loops while there is an index of the regex
		domain = regEx.exec(text)[0]; // Grabs the string that it matches
		domain = domain.substring(3, domain.length - 2); // Strip off the nasty chars '[[.___]]'
		if(domain.indexOf('.') == -1){ domains.push(domain);} // Adds the domain to an array if there is not extra periods e.g 'ac.uk'
		text = text.replace(regEx, ''); // Removes it from the text we're searching
	}
	return domains;
}

// Remove any duplicates in the array
function removeDuplicates(input){
	return input.filter(function(elem, pos){ return input.indexOf(elem) == pos; });
}

// GO GO GO
main();