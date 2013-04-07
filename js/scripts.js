wikiData = function(json){
	var regEx = /\[\[\.[A-z.]*\]\]/; // '[[.' then a string with lower and upper case letters and periods followed by ']]'
	var text = json.query.pages["15422"].revisions[0]["*"];
	var domains = [];
	while(regEx.test(text)){ // Loops while there is an index of the regex
		domain = regEx.exec(text)[0]; // Grabs the string that it matches
		domains.push(domain.substring(2, domain.length - 2)); // Adds the domain prettified to the array
		text = text.replace(regEx, ''); // Removes it from the text we're searching
	}
	$('body').html('<p>' + domains.join(' | ') + '</p>');
};