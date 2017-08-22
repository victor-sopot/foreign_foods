// my custom backbone stuff will go in here
var VenueModel = Backbone.Model.extend({
	defaults: {
		id: '',
		address: '',
		city: '',
		coords: '',
		createdAt: '',
		createdBy: '',
		iconp: '',
		icons: '',
		postcode: '',
		street: '',
		tel: '',
		type: '',
		updatedAt: '',
		url: '',
		name: ''
	}
});

var VenuesCollection = Backbone.Collection.extend({
	model: VenueModel
});

var Venues = new VenuesCollection();
// views.js
var SavedVenuesView = Backbone.View.extend({
    el: '#saved-venues-view',

	template: _.template($('#venue-item-tmpl').html()),

	initialize: function() {
    	this.listenTo(this.collection, 'add change', this.render);
    	this.render();
    },

	render: function() {
    	var html = this.template(this.collection.attributes);
    	this.$el.html(html);
    	return this;
	}
});

// main.js
var app = new SavedVenuesView({collection: VenuesCollection});