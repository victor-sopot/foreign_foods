// views.js
var VenuesListItemView = Backbone.View.extend({
	el: '#saved-venues-view',
	tagName: '',
	className: 'venue',

	initialize: function() {
		console.log(this.model);
	}
});