var fs = require('fs');
var path = require('path');
var words = require('./words.json');
var tlds = require('./tlds.json');
var domains = [];

for (var i in words) {
  var word = words[i];

  // words smaller than 3 characters can never be domains as smallest domain would be x.xx
  if (word.length < 3) {
    continue;
  }

  for (var y in tlds) {
    var tld = tlds[y];

    // if the word is bigger than the TLD
    if (word.length > tld.length) {
      // get the word minus the TLD length
      var w = words[i].substr(0, word.length - tld.length);

      // get the last characters of the word equal to the TLD length
      var t = words[i].substr(word.length - tld.length, word.length);

      // is the TLD the same as the last characters of the word
      if (t === tld) {
        // Create domain
        domains.push(w + '.' + t);
        console.log(domains.length, 'domains found');
      }
    }
  }
}

fs.writeFile(path.join(__dirname, '/domains.json'), JSON.stringify(domains, null, 2), function (error) {
  if (error) {
    return console.log('Error:', error);
  }

  console.log(domains.length, 'domains saved to /domains.json');
});
