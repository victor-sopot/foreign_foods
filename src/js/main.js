// main.js

var venueTmpl = _.template( $('#venue-item-tmpl').html() );
var venueModel = new VenuesModel();
var venueView = new VenuesListItemView({ model: venueModel});