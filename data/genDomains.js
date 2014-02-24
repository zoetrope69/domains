var fs = require('fs'),
	words = require('./words.json'),
	tlds = require('./tlds.json'),
	domains = [];

for(var i in words){
	var word = words[i];
	
	for(var y in tlds){
		var tld = tlds[y];

		// if the word is bigger than 2 chars and is bigger than the TLD
		if(word.length > 2 && word.length > tld.length){

			// get the word minus the TLD length
			var w = words[i].substr(0, word.length - tld.length);

			// get the last characters of the word equal to the TLD length
			var t = words[i].substr(word.length - tld.length, word.length);

			// is the TLD the same as the last characters of the word
			if(t === tlds[y]){
				// Create domain
				domains.push(w + '.' + t);
				console.log(domains);
			}

		}
	}
}

fs.writeFile(__dirname+'/domains.json', JSON.stringify(domains, null, 2), function(e){
	if(e){
		console.log("Error: ", e);
	}else{
		console.log("All golden. File saved.");
	}
});