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