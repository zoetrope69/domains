
// domainr bit
function domainrCheck(domain){
	var url = 'https://domainr.com/api/json/info?callback=getDomainrData&q=' + domain + '&client_id=dandydomains';
	var timeoutSecs = 5;
	var domainrAjax = $.ajax({ url: url, dataType: 'script', timeout: timeoutSecs * 1000 });
	domainrAjax.fail(function(){
		console.log('Fail: ' + domainrAjax.status );

		// highlight that shit
		$('main').find('.current').addClass('dead-item');

		$('.loading').hide();
		$('.errors').show();

		// error messages
		$('.errors').html('Ahh shit, it\'s broken.');
		setTimeout(function(){
			$('.errors').html('Ahh shit, it\'s broken. <a href="https://domainr.com/">Domainr</a> is failing to return anything on this domain.');
		}, 2000);
		setTimeout(function(){
			$('.errors').html('Ahh shit, it\'s broken. <a href="https://domainr.com/">Domainr</a> is failing to return anything on this domain. Sorry!');
		}, 5000);	

	});
}

function getDomainrData(json){
	// console.log(json); // RAW DATA
	// console.log("Domain: "+ json.domain +" | Available? "+ json.availability); // Bit more specific
	var avail = json.availability;
	var availPretty = avail;
	// console.log('Availability: ' + avail)

	var domain = json.domain;

	var link = ['',''];
	if(avail == 'available' || avail == 'maybe' || avail == 'unknown'){
		link[0] = '<a title="Register this domain!" href="https://domainr.com/'+ domain +'">';
		link[1] = '</a>';
	}

	var domainPretty = link[0] + domain.replace('.', '<span class="'+ avail +'">.</span>') + link[1];

	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	var availHtml = 'This domain is ' + link[0] + '<span class="'+ avail +'">' + availPretty + '</span>' + link[1] + '.';
	var suffixHtml = 'Read more about the <a href="'+ suffixUrl +'"><span>"' + suffix + '"</span></a>  suffix.';

	$('more-detail').addClass(avail);
	$('.loading').hide();

	// replace the domain with a 'pretty' version
	$('.more-detail').find('h1').html(domainPretty);

	// add in the html for availability and the suffix info
	$('.availability').html(availHtml).show();
	$('.suffix').html(suffixHtml).show();

	// highlight that shit
	$('main').find('.current').addClass(avail + '-item');
}
