// views.js
var VenuesListItemView = Backbone.View.extend({
	el: '#saved-venues-view',
	template: _.template($('#venue-item-tmpl').html()),
	tagName: '',
	className: 'venue',

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	    this.render();
	},

	render: function() {
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
		return this;
	}
});