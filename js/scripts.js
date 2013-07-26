(function(){ main(); })() // On load

function main(){
	// generates a list of domain items
	domainItemGen();

	// controls when the more-detail should show
	modalControl();
}

function modalControl(){
	$('main').find('li').click(function(){
		// the text from what you're clicking on
		var domain = $(this).text().trim();
		var domainPretty = domain.replace('.', '<span class="fullstop">.</span>')

		// resets
		$('.more-detail').find('.availability').hide();
		$('.more-detail').find('.suffix').hide();
		$('.more-detail').find('h1').html(domainPretty);
		$('.more-detail').find('.loading').show();
		$('.more-detail-shown').removeClass('more-detail-shown');
		$('main').find('li').removeClass('current');

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
	});
}

function domainItemGen(){
	var url = './txt/dandydomains.txt';
	$.ajax({ url: url, dataType: 'text', async: false })
	.done(function(data){

		var domains = data.split('\n');
		var startPos = 0;
		var itemAmount = 80;


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
	var url = 'http://www.domai.nr/api/json/info?callback=getDomainrData&q=' + domain;
	$.ajax({ url: url, dataType: 'script', async: false });
}

function getDomainrData(json){
	// console.log(json); // RAW DATA
	// console.log("Domain: "+ json.domain +" | Available? "+ json.availability); // Bit more specific
	var avail = json.availability;
	var availPretty = avail;
	if(avail == 'maybe'){ availPretty += ' available'; }

	var link = ['',''];
	if(avail == 'available' || avail == 'maybe' || avail == 'unknown'){
		link[0] = '<a href='+ json.register_url +'>';
		link[1] = '</a>';
	}
	var domain = json.domain;
	var domainPretty = domain.replace('.', '<span class="'+ avail +'">.</span>')
	var suffix = '.' + json.tld.domain;
	var word = domain.replace('.','');
	var suffixUrl = json.tld.wikipedia_url;



	var availHtml = 'This domain is ' + link[0] + '<span class="'+ avail +'">' + avail + '</span>' + link[1] +'!';
	var suffixHtml = 'Read more about the "<a class="status suffix" href="'+ suffixUrl +'">' + suffix + '</a>" suffix.';

	$('more-detail').addClass(avail);
	$('.more-detail').find('.loading').hide();

	// replace the domain with a 'pretty' version
	$('.more-detail').find('h1').html(domainPretty);

	// add in the html for availability and the suffix info
	$('.more-detail').find('.availability').html(availHtml).show();
	$('.more-detail').find('.suffix').html(suffixHtml).show();

}

// define the words
function defineWords(item){	
	$('.modal').find('.define').on('click', function(){
		// grab word
		var word = $(this).parent().find('h1').text().replace('.','');
		var def = '';

		$.ajax({ type: 'POST', url: './php/define.php', data: { word: word }, async: false })
		.done(function(definition){
			def = definition;
		});

		// treat definition
		def = capitaliseString(def.trim());

		$(this).parents('li').find('.def').html(def);
		$(this).parents('li').find('.def').removeClass('hidden-def');
	});
}

function capitaliseString(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}