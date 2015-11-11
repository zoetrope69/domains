$(document).ready(function(){

	// controls when the more-detail should show
	moreDetailsControl();

	// filters the domains
	filters();

	// reseizes on load and whenever the page is resized
	headerResize();

	$(window).resize(function(){
		headerResize();
	});

	domainCounter();

});

function headerResize(){
	$('main').css('paddingTop', $('.top').outerHeight() );
	$('.more-detail').css('height', $('header').outerHeight() );
}

function domainCounter(){

	var shownDomains = 0;
	$('main').find('li').each(function(){
		if($(this).is(':visible')){ shownDomains++; }
	});

	if(shownDomains == 0){
		$('.amount').html('Try a different filter?');
		$('.big-error').addClass('big-error-shown');
	}else{
		$('.amount').html(shownDomains + ' domains returned!');
		$('.big-error').removeClass('big-error-shown');
	}
}

function moreDetailsControl(){
	$('main').find('li').click(function(){
		// the text from what you're clicking on
		var domain = $(this).text().trim();
		var domainPretty = domain.replace('.', '<span class="fullstop">.</span>')

		// resets
		$('.availability').hide();
		$('.suffix').hide();
		$('.errors').hide();


		$('.loading').show();
		$('.more-detail').find('h1').html(domainPretty);
		$('.more-detail').addClass('more-detail-hidden');
		$('main').find('li').removeClass('current');

		// adding new data
		domainrCheck(domain);

		// display that shit
		$(this).addClass('current');
		$('header').addClass('header-hidden');
		$('.more-detail').removeClass('more-detail-hidden');
	});

	$('.more-detail').find('.close').click(function(){
		$('header').removeClass('header-hidden');
		$('.more-detail').addClass('more-detail-hidden');
		$('.current').removeClass('current');

	});
}

function capitaliseString(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}
