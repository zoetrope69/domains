(function(){ main(); })() // On load

function main(){
	// generates a list of domain items
	domainItemGen();
}

function domainItemGen(order){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){

		var domains = data.split('\n');
		var startPos = 0;
		var itemAmount = 30;

		// gen some random numbers
		var randPos = [];
		for(var i = 0; i < itemAmount; i++){
			rand = Math.floor(Math.random() * domains.length);
			// if we already have this rand no increase count for another go
			if(randPos.indexOf(rand) != -1){ itemAmount++; }
			else{ randPos.push(rand); }
		}

		// generate these
		for(var i = 0; i < itemAmount; i++){
			domainrCheck(domains[randPos[i]]);
		}
		
	});
}

function domainSearch(data, char){
	for(var i = 0; i < data.length; i++){
		if(data[i].charAt(0) == char){
			return i;
		}
	}
}

// domainr bit
function domainrCheck(domain){
	var url = 'http://www.domai.nr/api/json/info?callback=getDomainrData&q=' + domain;
	$.ajax({ url: url, dataType: 'script', async: false });
}

function getDomainrData(json){
	// console.log(json); // RAW DATA
	// console.log("Domain: "+ json.domain +" | Available? "+ json.availability); // Bit more specific
	var avail = json.availability;
	var link = ['',''];
	if(avail == 'available' || avail == 'maybe' || avail == 'unknown'){
		link[0] = '<a href='+ json.register_url +'>';
		link[1] = '</a>';
	}
	var availPretty = capitaliseString(avail);
	var domain = json.domain;
	var domainPretty = domain.replace('.', '<span class="fullstop '+ avail +'">.</span>');
	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	var domainItem = $(['<li class="'+ avail +'-item">',
						'<h1>'+ link[0] + domainPretty + link[1] +'</h1>',
						'<div class="buttons">',
						link[0] + '<span class="status '+ avail +'">' + availPretty + '</span>' + link[1],
						'<a class="status define" target="_blank" href="http://dictionary.reference.com/browse/'+word+'">Define</a>',
						'<a class="status suffix" target="_blank" href="'+ suffixUrl +'">\''+ suffix +'\' ?</a>',
						'</div>',
						'</li>'].join('\n'));

	if(avail != 'unavailable' && avail != 'taken'){
		domainItem.hide().appendTo('main ul').fadeIn('1500');
	}

}

function capitaliseString(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}