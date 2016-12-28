// filters

function filters () {
  $('.text-filter').on('input', function () { filterDomains(); });
  $('.domain-filter').change(function () { filterDomains(); });
  $('.sort-filter').change(function () { sortDomains(); });
}

function sortDomains () {
  var type = $('.sort-filter').val();
  $('main').find('li').tsort({ order: type });
}

function filterDomains () {
  var domainFilter = $('.domain-filter').val();

  var textFilter = $('.text-filter').val();
  // trim, strip spaces, lowercase-ify and replace the fullstop
  textFilter = textFilter.trim().replace(/\s+/g, '').toLowerCase().replace('.', '');

  // Reset
  $('main').find('li').show();

  $('main').find('li').each(function () {
    var domainItem = $(this).find('h1').html();

    // if the domain filter isn't none
    if (domainFilter !== 'none') {
      // if the domain suffix isn't present in the word
      var domainPresent = (domainItem.indexOf(domainFilter) === -1);
      if (domainPresent) {
        $(this).hide();
      }
    }

    // if the text isn't present in the domain hide it
    var textPresent = (domainItem.replace('.', '').indexOf(textFilter) === -1);
    if (textPresent) {
      $(this).hide();
    }
  });

  domainCounter();
}
