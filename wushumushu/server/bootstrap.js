// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (true) {
    Shows.remove({})
    Acts.remove({})
    Sections.remove({})
    Moves.remove({})
    Weapons.remove({})
  }
  if (Shows.find().count() === 0) {
  	var new_shows = [{name: "Show1",
                     date: "5/5/2014",
                     start: "8PM",
                     end: "11PM",
                     location: "MIT Z Center"},
                     {name: "Show2",
                     date: "7/7/2014",
                     start: "7AM",
                     end: "9AM",
                     location: "Wellesley"}]
    show_ids = [];
    for (var i = 0; i <= new_shows.length-1; i++) {
        show_ids.push(Shows.insert(new_shows[i]));
    }; 

    act_ids = [];
    var new_acts = [{name: "Act1", show_id: show_ids[0]},
                    {name: "Act2", show_id: show_ids[0]}];
    for (var i = 0; i<=new_acts.length - 1; i++) {
        act_ids.push(Acts.insert(new_acts[i]));
    };                

    section_ids = [];
    var new_sections = [{name: "Section 1", act_id: act_ids[0]},
                        {name: "Section 2", act_id: act_ids[0]}];
    for (var i = 0; i<=new_sections.length - 1; i++) {
        section_ids.push(Sections.insert(new_sections[i]));
    };                

    move_ids = [];
    var new_moves = [{title: "Move 1", description: "DESCRIPTION 1", section_id: section_ids[0], act_id: act_ids[0]},
                        {title: "Move 2", description: "Description 2", section_id: section_ids[0], act_id: act_ids[0]}];
    for (var i = 0; i<=new_moves.length - 1; i++) {
        move_ids.push(Moves.insert(new_moves[i]));
    };                

    weapon_ids = [];
    var new_weapons = [{name: "Weapon 1", move_id: move_ids[0], act_id: act_ids[0]},
                        {name: "Weapon 2", move_id: move_ids[0], act_id: act_ids[0]}];
    for (var i = 0; i<=new_weapons.length - 1; i++) {
        weapon_ids.push(Weapons.insert(new_weapons[i]));
    };

  }
});
