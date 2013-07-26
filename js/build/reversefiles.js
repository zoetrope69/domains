// this file gets the domains and words and reverses them and resorts them into the reversed word file

var fs = require('fs'); // for filesystem

function main(){

	// reverse the domains and words
	reverseStrings('../../txt/domains.txt', '../../txt/rdomains.txt');
	reverseStrings('../../txt/words.txt', '../../txt/rwords.txt');

}

// reverse strings in the file
function reverseStrings(inputPath, outputPath){
	var strings = fs.readFileSync(inputPath, 'utf8').split('\n');
	console.log(' - "' + inputPath + '"" read...');
	var rStrings = reverseArrayItems(strings).sort().join('\n');
	fs.writeFileSync(outputPath, rStrings, 'utf8');
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
