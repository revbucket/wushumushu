//////// Routing stuff goes here//////
Router.map(function() {

  //Routing function for the shows page
  this.route('home', {
    path: '/', 
    template: "shows_page",
    onRun: function() {
    	console.log("NEED TO RESET ALL current_x SESSION VARIABLES HERE");
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
  		console.log("SET THE CURRENT SHOW HERE, RESET EVERYTHING ELSE");
  	}
    
  });


  // Routing function for the act_edit page
  this.route('actEdit', {
  	path: '/act/:_id',
  	template: 'act_edit_page',
  	data: function(){
  		act = Acts.findOne({_id: this.params._id});
  		return {sections: Sections.find({act_id: this.params._id}),
  	            act: act, 
  	            show: Shows.findOne({_id: act['show_id']})};
  	}
  });
});