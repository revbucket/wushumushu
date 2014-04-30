//////// Routing stuff goes here//////
Router.map(function() {

  //Routing function for the shows page
  this.route('home', {
    path: '/', 
    template: "shows_page",
    onRun: function() {
    	Session.set('current_show_id', null);
    	Session.set('current_show_name', null);
    	Session.set('current_act_id', null);
    	Session.set('current_act_name', null);
    	Session.set('current_section_id', null);
    	Session.set('current_move_id', null);
    	Session.set('current_weapon_id', null);
    }
  });


  //Routing function for showing an act
  this.route('actsShow', {
  	//matches: '/acts/ufJnm2Tgb3skwjHMg'
  	path: '/shows/:_id',
  	template: 'acts_page',
  	data: function (){
  		return {acts: Acts.find({show_id: this.params._id}),
  	            show: Shows.findOne({_id: this.params._id} )};
  	},
  	onRun: function() {
  		Session.set('current_show_id', this.params._id);
  		Session.set('current_show_name', null);
    	Session.set('current_act_id', null);
    	Session.set('current_act_name', null);
    	Session.set('current_section_id', null);
    	Session.set('current_move_id', null);
    	Session.set('current_weapon_id', null);
  	}
    
  });


  // Routing function for the act_edit page
  this.route('actEdit', {
  	path: '/act/:_id',
  	template: 'act_edit_page',
  	waitOn: function() {
  		return [Meteor.subscribe('Acts'), Meteor.subscribe('Shows')];
  	},
  	onRun: function() {
  		Session.set('current_show_id', null);
  		Session.set('current_show_name', null);
    	Session.set('current_act_name', null);
    	Session.set('current_section_id', null);
    	Session.set('current_move_id', null);
    	Session.set('current_weapon_id', null);
  		Session.set('current_act_id', this.params._id);
    }
  });
});