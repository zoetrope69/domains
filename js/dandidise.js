// generate all them dandy domains yo

var fs = require('fs'); // for filesystem

function main(){
	console.log('Generating domains...')

	var rWords = fs.readFileSync('../txt/rwords.txt', 'utf8').toString().split('\n');
	var rDomains = fs.readFileSync('../txt/rdomains.txt', 'utf8').toString().split('\n');

	var matched = [];

	for(var i = 0; i < rWords.length; i++){
		for(var j = 0; j < rDomains.length; j++){
			var rDomain = rDomains[j].toString().trim();
			var rWord = rWords[i].toString().trim();

			var trimmedRWord = rWord.substring(0, rDomain.length);
			var restOfWord = rWord.substring(rDomain.length);

			if(rDomain == trimmedRWord){
				if(restOfWord != ''){
					// console.log(rDomain +"."+ restOfWord);
					matched.push(rDomain +"."+ restOfWord);
				}
			}
		}
	}

	var outputPath = '../txt/dandydomains.txt';
	var outputMatched = reverseArrayItems(matched).sort().join('\n');
	fs.writeFileSync(outputPath, outputMatched, 'utf8');
	console.log('..Full domains generated!');
}

// Stick in an array of words and it'll reverse them all.
function reverseArrayItems(input){
	var output = [];
	for(var i = 0; i < input.length; i ++){
		output[i] = input[i].split('').reverse().join('');
	}
	return output;
}

// GO GO GO
main();