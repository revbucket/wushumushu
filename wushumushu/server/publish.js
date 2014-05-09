/* Shows -- {name: String, 
	         date: String, 
	         start: string, 
	         end: string, 
	         location: string}
*/
Shows = new Meteor.Collection("shows");

// Publish complete set of shows to all clients.
Meteor.publish('shows', function () {
  return Shows.find();
});


/* Acts -- {name: String, 
	        show_id: String}
*/
Acts = new Meteor.Collection("acts");
//Publish only the acts with the requested show_id
Meteor.publish('acts', function (show_id) {
  check(show_id, String);
  return Acts.find({show_id: show_id});
});

/* Sections -- {name: String, 
	            act_id: String}
*/
Sections = new Meteor.Collection("sections");
// Publish only the sections with the requested act_id
Meteor.publish('sections', function(act_id) {
	check(act_id, String);
  return Sections.find({act_id: act_id});
});

/*Moves -- {name: String, 
	        info: String, 
	        section_id: String,
	        act_id: String}
*/
Moves = new Meteor.Collection("moves");
// Publish only the moves with the requested act_id
Meteor.publish('moves', function (act_id) {

  	check(act_id, String);
  return Moves.find({act_id: act_id});
});


/*Weapons -- {name: String, 
	          video_url: String,
	          song_url: String, 
	          move_id: String
	          act_id: String}
*/	      
Weapons = new Meteor.Collection("weapons");
// Publish only the weapons with the requested act_id
Meteor.publish('weapons', function (act_id) {
	check(act_id, String);
	return Weapons.find({act_id: act_id});
});





