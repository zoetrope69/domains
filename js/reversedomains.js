// this file gets the wiki data file and reverses them and resorts them into the reversed word file

var fs = require('fs'); // for filesystem

function main(){
	var inputPath = '../txt/domains.txt';
	var outputPath = '../txt/rdomains.txt';

	var words = fs.readFileSync(inputPath, 'utf8').split('\n');
	console.log(' - "' + inputPath + '"" read...');
	var rWords = reverseArrayItems(words).sort().join('\n');
	fs.writeFileSync(outputPath, rWords, 'utf8');
	console.log(' - "' + outputPath + '"" wrote!');
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
