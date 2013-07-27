(function(){ main(); })() // On load

function main(){
	// generates a list of domain items
	domainItemGen();

	// controls when the more-detail should show
	moreDetailsControl();

	// definitions and shit
	defineWords();
}

function moreDetailsControl(){
	$('main').find('li').click(function(){
		// the text from what you're clicking on
		var domain = $(this).text().trim();
		var domainPretty = domain.replace('.', '<span class="fullstop">.</span>')

		// resets
		$('.availability').hide();
		$('.suffix').hide();
		$('.definition').hide();
		$('.errors').hide();		
		$('.define').hide();

		$('.loading').show();
		$('.more-detail').find('h1').html(domainPretty);
		$('.more-detail-shown').removeClass('more-detail-shown');
		$('main').find('li').removeClass('current');

		$('.define').removeClass('define-toggle');
		$('.define').html('Define');

		// adding new data
		domainrCheck(domain);

		// display that shit
		$(this).addClass('current');
		$('header').addClass('header-hidden');
		$('.more-detail').addClass('more-detail-shown');
	});

	$('.more-detail').find('.close').click(function(){
		$('header').removeClass('header-hidden');
		$('.more-detail').removeClass('more-detail-shown');
		$('.current').removeClass('current');

	});
}

function domainItemGen(){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){

		var domains = data.split('\n');
		var startPos = 0;
		var itemAmount = 150;

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
			domainItems(domains[randPos[i]]);
		}
	});
}

function domainItems(domain){
	var domainItem = $(['<li>',
						'<h1>' + domain + '</h1>',
						'</li>'].join('\n'));

	domainItem.appendTo('main ul');
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
	var url = 'http://www.domai.nr/api/json/info?callback=getDomainrData&q=' + domain + '&client_id=dandydomains';
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
			$('.errors').html('Ahh shit, it\'s broken. <a href="http://domai.nr/">Domainr</a> is failing to return anything on this domain.');
		}, 2000);
		setTimeout(function(){
			$('.errors').html('Ahh shit, it\'s broken. <a href="http://domai.nr/">Domainr</a> is failing to return anything on this domain. Sorry!');
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
		link[0] = '<a title="Register this domain!" href="http://www.domai.nr/'+ domain +'">';
		link[1] = '</a>';
	}

	var domainPretty = link[0] + domain.replace('.', '<span class="'+ avail +'">.</span>') + link[1];

	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;

	var availHtml = 'This domain is ' + link[0] + '<span class="'+ avail +'">' + availPretty + '</span>' + link[1] + '.';
	var suffixHtml = '<a class="suffix" href="'+ suffixUrl +'">Read more about the <span>"' + suffix + '"</span> suffix.</a>';

	$('more-detail').addClass(avail);
	$('.loading').hide();
	$('.define').show();

	// replace the domain with a 'pretty' version
	$('.more-detail').find('h1').html(domainPretty);

	// add in the html for availability and the suffix info
	$('.availability').html(availHtml).show();
	$('.suffix').html(suffixHtml).show();

	// highlight that shit
	$('main').find('.current').addClass(avail + '-item');
}

// define the words
function defineWords(item){	
	$('.more-detail').find('.define').click(function(){

	// if definition has already been generated
	if($(this).hasClass('define-toggle')){

		// toggle content
		$('.suffix').toggle();
		$('.availability').toggle();
		$('.definition').toggle();

		// change the text of the button
		var label = 'Hide';
		if($(this).html() == 'Hide definition'){ label = 'Show'; }
		$(this).html(label + ' definition');

	// otherwise gen that shit
	}else{

		$('.loading').hide();
		$('.errors').hide();
		$('.suffix').hide();
		$('.availability').hide();

		// grab word
		var word = $(this).parent().find('h1').text().replace('.','');
		var def = 'Erm, missing a definition here...';

		$.ajax({ type: 'POST', url: './php/define.php', data: { word: word }, async: false })
		.done(function(definition){
			def = definition;
		});

		// treat definition
		def = capitaliseString(def.trim());

		$('.definition').html(def);
		$('.definition').show();

		$(this).addClass('define-toggle');
		$(this).html('Hide definition');

	}

	});
	
}

function capitaliseString(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}