var words = require('./words.json');
var tlds = require('./tlds.json');
var data = [];
for (var i in words){
	if(words[i].length <= 2) {
		words.splice(i, 1);
	}
}

var domains = []

for (var i in words){
	for (var y in tlds){
		if (tlds[y].length < words[i].length ){
			//get the length of word and tld
			wordLen = words[i].length;
			tldLen = tlds[y].length;
			//get the word minus the tld length
			var w = words[i].substr(0, wordLen - tldLen);
			//get the last characters of the word equal to the tld length
			var t = words[i].substr(wordLen - tldLen, wordLen);
			//is the tld the same as the last characters of the word?
			if(t === tlds[y]){
				//if it is do something with that data (yo)
				w = w + '.' + tlds[y];
				domains.push(w);
				console.log(w);
			}
		}
	}
}

var fs = require('fs');

fs.writeFile(__dirname+'/domains.json', JSON.stringify(domains, null, 2), function(e){
			if(e){
				console.log("Error: ", e);
			}else{
				console.log("All golden. File saved.");
			}
		});