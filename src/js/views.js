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
