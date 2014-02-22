// get the tlds

var http = require('http');

http.get("http://data.iana.org/TLD/tlds-alpha-by-domain.txt", function(res) {
	console.log("Got response: " + res.statusCode + "\n");
	
	var domains = "";

	res.on('data', function (data){
		domains = ("" + data).split("\n");

		var tempDomains = [];
		for(var d =  0; d < domains.length; d++){
			var domain = domains[d];

			// no characters but alpha
			if(domain.match(/^[A-z]+$/g)){
				tempDomains.push(domain);
			}
		}

		domains = tempDomains;

		console.log(domains);
	});


}).on('error', function(e) {
  console.log("Got error: " + e.message);
});