// Client-side JavaScript, bundled and sent to client.

// Define Minimongo collections to match server/publish.js.
Shows = new Meteor.Collection("shows");
Acts = new Meteor.Collection("acts");
Sections = new Meteor.Collection("sections");
Moves = new Meteor.Collection("moves");
Weapons = new Meteor.Collection("weapons");


// ID of current show, act, section, move, weapon
Session.setDefault('current_show_id', null);
Session.setDefault('current_show_name', null); //name for breadcrumb purposes
Session.setDefault('current_act_id', null);
Session.setDefault('current_act_name', null);  //name for breadcrumb purposes
Session.setDefault('current_section_id', null);
Session.setDefault('current_move_id', null);
Session.setDefault('current_weapon_id', null);

// Edit mode: true if editing, false otherwise
  Session.setDefault('edit_mode',  false);

// Vars for editing section and move
  Session.setDefault('editing_section', null);
  Session.setDefault('editing_move', null);


///////////DEBUGGING METHODS /////////////
var setSessionVars = function() {
  pickedSection = Sections.findOne({act_id: Session.get("current_act_id")});
  if (pickedSection) {
    console.log("SECTION NOT NULL");
    Session.set('current_section_id', pickedSection['_id']);
  }

  pickedMove = Moves.findOne({section_id: Session.get("current_section_id")});
  if (pickedMove) {
    console.log("MOVE NOT NULL");
    Session.set('current_move_id', pickedMove['_id']);
  }
};



// Subscriptions go here (when I figure out how to do that...)

var showsHandle = null;
var actsHandle = null;
var sectionsHandle = null;
var movesHandle = null;
var weaponsHandle = null;
// Always be subscribed to shows, and only subscribe to acts for current show
// Always be subscribed to the sections, moves and weapons for the selected act.
Deps.autorun(function () {

  showsHandle = Meteor.subscribe('shows');

  var show_id = Session.get('current_show_id');
  if (show_id) {
    actsHandle = Meteor.subscribe('acts', show_id)
  }
  else {
    actsHandle = null;
  }

  var act_id = Session.get('current_act_id');
  if (act_id) {
    sectionsHandle = Meteor.subscribe('sections', act_id)
    movesHandle = Meteor.subscribe('moves', act_id);
    weaponsHandle = Meteor.subscribe('weapons', act_id);
  }
  else {
    sectionsHandle = null;
    movesHandle = null;
    weaponsHandle = null;
  }
});


////////// Helpers for navbar ////////////
Template.nav_bar.loading = function() {
  return !showsHandle.ready();
}

Template.nav_bar.show_selected = function() {
  console.log("SHOW SELETED");
  console.log(Session.equals('current_show_id', null))
  return !Session.equals('current_show_id', null);
}

Template.nav_bar.current_show_name = function() {
  if (!Session.equals('current_show_id', null)) {
    return Shows.findOne({_id: Session.get('current_show_id')}).name;
  }
}

Template.nav_bar.current_show_id = function() {
  return Session.get('current_show_id');
}

Template.nav_bar.act_selected = function() {
  return !Session.equals('current_act_id', null);
}

Template.nav_bar.current_act_name = function() {
  if (!Session.equals('current_act_id', null)) {
    return Acts.findOne({_id: Session.get('current_act_id')}).name;
  }
}

Template.nav_bar.section_selected = function() {
  return !Session.equals('current_section_id', null);
}

Template.nav_bar.current_section_name = function() {
  if (!Session.equals('current_section_id', null)) {
    return Sections.findOne({_id: Session.get('current_section_id')}).name;
  }
}

Template.nav_bar.edit_class =  function() {
  if (Session.equals('edit_mode',true)) {
    return 'btn-info';
  }
}

Template.nav_bar.view_class = function() {
  if (Session.equals('edit_mode', false)) {
    return 'btn-info'
  }
}

Template.nav_bar.events({
  'click #edit-mode-button': function() {
    Session.set('edit_mode',true);
  },
  'click #view-mode-button': function() {
    Session.set('edit_mode',false);
  }
})


////////// Helpers for shows /////////////

Template.shows_page.loading = function() {
  return !showsHandle.ready();
}

Template.shows_page.shows = function () {
  return Shows.find({}, {sort: {name: 1}});
};


////////// Helpers for Acts //////////////

Template.acts_page.loading = function() {
  return !actsHandle.ready();
}

Template.acts_page.acts_list= function() {
  return Shows.find({show_id: Session.get("current_show_id")})
}


////////// Helper for act_edit ////////////



////////// Helper for sections_pane //////////

Template.sections_pane.loading = function() {
  //setSessionVars(); //THIS IS FOR DEBUGGING PURPOSES ONLY @JORDANM
  return !sectionsHandle.ready();
}

Template.sections_pane.sections = function() {
  console.log("Sections rendering");
  console.log(Sections.find({act_id: Session.get("current_act_id")}));
  return Sections.find({act_id: Session.get("current_act_id")});
}

Template.sections_pane.editing_section = function() {
  return Session.equals("editing_section", this._id);
}

Template.sections_pane.not_editing_section = function() {
  return Session.equals("editing_section", null);
}

Template.sections_pane.edit_mode = function() {
  return Session.equals('edit_mode', true);
}

Template.display_section.edit_mode = function() {
  return Session.equals('edit_mode', true);
}

Template.display_section.maybe_active = function() {
  return Session.equals("current_section_id", this._id) ? "active" : "";
};

Template.display_section.events({
    'click .section': function() {
      console.log(this._id + ' section clicked');
      Session.set("current_section_id", this._id);
    },

    'click .glyphicon-pencil': function() {
      console.log(this._id + ' glyphicon-pencil clicked');
      Session.set("editing_section", this._id);
    }
})

Template.update_section.events({
  'click .update-section-btn': function(evt, template) {
    var newName = template.find("#update-section").value;
    // Do not change the name value if the user types nothing.
    if (newName !== "") {
      Sections.update(Session.get("editing_section"), {$set: {name: newName}});
    }
    Session.set("editing_section", null);
  }
})


////////// Helper for moves_pane /////////////

Template.moves_pane.loading = function() {
  return !movesHandle.ready();
}

Template.moves_pane.moves = function() {
  console.log(Moves.find({section_id: Session.get("current_section_id")}));
  return Moves.find({section_id: Session.get("current_section_id")});
}

Template.moves_pane.editing_move = function() {
  return Session.equals("editing_move", this._id);
}

Template.moves_pane.not_editing_move = function() {
  return Session.equals("editing_move", null);
}

Template.moves_pane.edit_mode = function() {
  return Session.equals('edit_mode', true);
}

Template.display_move.edit_mode = function() {
  return Session.equals('edit_mode', true);
}

Template.display_move.maybe_active = function() {
  return Session.equals("current_move_id", this._id) ? "active" : "";
};

Template.display_move.events({
    'click': function() {
      console.log(this._id + ' move clicked');
      Session.set("current_move_id", this._id);
    },

    'click .glyphicon-pencil': function() {
      console.log(this._id + ' glyphicon-pencil clicked');
      Session.set("editing_move", this._id);
    }
})

Template.update_move.events({
  'click .update-move-btn': function(evt, template) {
    var newName = template.find("#update-move-title").value;
    var newInfo = template.find("#update-move").value;
    Sections.update(Session.get("editing_move"), 
      {$set: {
        name: newName,
        info: newInfo
      }
    });
    Session.set("editing_move", null);
  }
})


////////// Helper for weapons_pane //////////
Template.weapons_pane.loading = function() {
  return !weaponsHandle.ready();
}

Template.weapons_pane.edit_mode = function() {
  return Session.equals('edit_mode', true);
}

Template.weapons_pane.no_weapons = function() {
  return Weapons.find({move_id: Session.get("current_move_id")}).count() == 0;
}

Template.weapons_pane.edit_and_weapons = function() {
  return ((Weapons.find({move_id: Session.get("current_move_id")}).count() != 0) && (Session.equals('edit_mode', true)) );

}

Template.weapons_pane.weapons = function() {
  return Weapons.find({move_id: Session.get("current_move_id")});
}


var num_weapons = function() {
  return Weapons.find({move_id: Session.get("current_move_id")}).count()
}

Template.weapons_pane.zero_edit_unselect = function() {
  return ((Session.equals('edit_mode', true)) && (num_weapons() == 0) && (Session.equals('current_weapon_id',null)))
};

Template.weapons_pane.plural_edit_unselect = function() {
  return ((Session.equals('edit_mode', true)) && (num_weapons() > 0) && (Session.equals('current_weapon_id',null)))
}

Template.weapons_pane.plural_edit_select = function() {
  return ((Session.equals('edit_mode', true)) && (num_weapons() > 0) && (!Session.equals('current_weapon_id',null)))
}

Template.weapons_pane.zero_view_unselect = function() {
  return ((Session.equals('edit_mode', false)) && (num_weapons() == 0) && (Session.equals('current_weapon_id',null)))
}

Template.weapons_pane.plural_view_unselect = function() {
  return ((Session.equals('edit_mode', false)) && (num_weapons() > 0) && (Session.equals('current_weapon_id',null)))
}

Template.weapons_pane.plural_view_select = function() {
  return ((Session.equals('edit_mode', false)) && (num_weapons() > 0) && (!Session.equals('current_weapon_id',null)))
}

Template.weapons_pane.video_and_selected = function() {
  var currentWeapon = Weapons.findOne({_id: Session.get('current_weapon_id')})
  if (currentWeapon) {
    console.log(currentWeapon.video_url)
    return ((currentWeapon.video_url != null) && (currentWeapon.video_url != undefined));
  }
  return false;
}

Template.weapons_pane.embed_url = function() {
  var getId = function(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  };
  var embedID = getId(Weapons.findOne({_id: Session.get('current_weapon_id')}).video_url);
  return "http://www.youtube.com/embed/"+embedID;
}

Template.weapons_pane.rendered = function() {
  setSessionVars();
}



Template.weapons_pane.events({
  'click #new_weapon_btn': function() {

    var newWeaponHTML = 
            '<div style="text-align:center;">' +
            '<label>Weapon name \*</label><br><input type="text" name="fname" value=""><br><br><br>' +
            '<label> Youtube URL (or leave blank)</label><br><input type="text" name="furl" value="">' +
            '' +
            '' +
            '<br>' +
            '<br>Fields marked \* are required<br></div>'
    var newWeaponPrompt = {
      state0: {
        title: 'New Weapon',
        html: newWeaponHTML,
        buttons: { Cancel: -1, Done: 1 },
        focus: 1,
        submit:function(e,v,m,f){ 
          if (f.fname != "" && v==1) {   
            var youtube_url = (f.furl == "")?  null: f.furl;
            var new_weapon_id = Weapons.insert({name: f.fname, video_url: youtube_url, move_id: Session.get('current_move_id'), 
                                                act_id: Session.get('current_act_id')});
            e.preventDefault();
            $.prompt.close();
          }
        },
      },
    };
    $.prompt(newWeaponPrompt);

  },
  'click .weapon-btn': function() {
      var weaponID = $(event.target).attr("id").split("-")[1];
      if (Session.equals('edit_mode', true)) {
      var weaponCursor = Weapons.findOne({_id: weaponID})
      var predefined_URL = ((weaponCursor.video_url == null )|| (weaponCursor.video_url == undefined))? "" : weaponCursor.video_url;
      var editHTML =
              '<div style="text-align:center;">' +
              '<label>Weapon name \*</label><br><input type="text" name="fname" value="' + weaponCursor.name + '"><br><br><br>' +
              '<label> Youtube URL (or leave blank)</label><br><input type="text" name="furl" value="' + predefined_URL+'">' +
              '' +
              '' +
              '<br>' +
              '<br>Fields marked \* are required<br></div>'
      var editPrompt = {
        state0: {
            title: 'Currently editing weapon: ' +  weaponCursor.name,
            html: editHTML,
            buttons: { 'Delete this weapon': -10, 'Cancel': -1, 'Save changes': 1 },
            focus: 1,
            submit: function(e1,v1,m1,f1) {
                if (v1 == 1 && f1.actName == "") { alert('The weapon name cannot be left blank'); }
                if (v1 == 1 && f1.actName != "") {
                  Weapons.update({_id: weaponID}, {name: f1.fname, video_url: f1.furl, move_id: Session.get('current_move_id'),
                                                   act_id: Session.get('current_act_id')})
                    e1.preventDefault();
                    $.prompt.close();
                }
                else if (v1 == -1) {
                    e1.preventDefault();
                    $.prompt.close();
                }
                else if (v1 == -10) {
                    e1.preventDefault();
                    $.prompt.goToState('deleteState',false,e1); // goto state1
                }
                e1.preventDefault();

            }
        }, // end state0 (default edit panel)

        'deleteState': {
            title: 'Delete weapon',
            html: 'Are you sure you want to delete the weapon: <span style="color:red;">' + 
                  weaponCursor.name+'</span><br><br>This action cannot be undone<br><br>',
            buttons: { 'Yes, delete this weapon' : -1, 'No, keep this weapon' : 1 },
            focus: 1,
            submit: function(e1,v1,m1,f1) {
                if (v1 == -1) {
                  Weapons.remove({_id: weaponID});
                }
            }
          } // end deleteSlate
        }; // end editPrompt
      $.prompt(editPrompt);
    }
    Session.set('current_weapon_id', weaponID)
  }
})


/*
////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};

////////// Lists //////////

Template.lists.loading = function () {
  return !listsHandle.ready();
};

Template.lists.lists = function () {
  return Lists.find({}, {sort: {name: 1}});
};

Template.lists.events({
  'mousedown .list': function (evt) { // select list
    Router.setList(this._id);
  },
  'click .list': function (evt) {
    // prevent clicks on <a> from refreshing the page.
    evt.preventDefault();
  },
  'dblclick .list': function (evt, tmpl) { // start editing list name
    Session.set('editing_listname', this._id);
    Deps.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#list-name-input"));
  }
});

// Attach events to keydown, keyup, and blur on "New list" input box.
Template.lists.events(okCancelEvents(
  '#new-list',
  {
    ok: function (text, evt) {
      var id = Lists.insert({name: text});
      Router.setList(id);
      evt.target.value = "";
    }
  }));

Template.lists.events(okCancelEvents(
  '#list-name-input',
  {
    ok: function (value) {
      Lists.update(this._id, {$set: {name: value}});
      Session.set('editing_listname', null);
    },
    cancel: function () {
      Session.set('editing_listname', null);
    }
  }));

Template.lists.selected = function () {
  return Session.equals('list_id', this._id) ? 'selected' : '';
};

Template.lists.name_class = function () {
  return this.name ? '' : 'empty';
};

Template.lists.editing = function () {
  return Session.equals('editing_listname', this._id);
};

////////// Todos //////////

Template.todos.loading = function () {
  return todosHandle && !todosHandle.ready();
};

Template.todos.any_list_selected = function () {
  return !Session.equals('list_id', null);
};

Template.todos.events(okCancelEvents(
  '#new-todo',
  {
    ok: function (text, evt) {
      var tag = Session.get('tag_filter');
      Todos.insert({
        text: text,
        list_id: Session.get('list_id'),
        done: false,
        timestamp: (new Date()).getTime(),
        tags: tag ? [tag] : []
      });
      evt.target.value = '';
    }
  }));

Template.todos.todos = function () {
  // Determine which todos to display in main pane,
  // selected based on list_id and tag_filter.

  var list_id = Session.get('list_id');
  if (!list_id)
    return {};

  var sel = {list_id: list_id};
  var tag_filter = Session.get('tag_filter');
  if (tag_filter)
    sel.tags = tag_filter;

  return Todos.find(sel, {sort: {timestamp: 1}});
};

Template.todo_item.tag_objs = function () {
  var todo_id = this._id;
  return _.map(this.tags || [], function (tag) {
    return {todo_id: todo_id, tag: tag};
  });
};

Template.todo_item.done_class = function () {
  return this.done ? 'done' : '';
};

Template.todo_item.editing = function () {
  return Session.equals('editing_itemname', this._id);
};

Template.todo_item.adding_tag = function () {
  return Session.equals('editing_addtag', this._id);
};

Template.todo_item.events({
  'click .check': function () {
    Todos.update(this._id, {$set: {done: !this.done}});
  },

  'click .destroy': function () {
    Todos.remove(this._id);
  },

  'click .addtag': function (evt, tmpl) {
    Session.set('editing_addtag', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#edittag-input"));
  },

  'dblclick .display .todo-text': function (evt, tmpl) {
    Session.set('editing_itemname', this._id);
    Deps.flush(); // update DOM before focus
    activateInput(tmpl.find("#todo-input"));
  },

  'click .remove': function (evt) {
    var tag = this.tag;
    var id = this.todo_id;

    evt.target.parentNode.style.opacity = 0;
    // wait for CSS animation to finish
    Meteor.setTimeout(function () {
      Todos.update({_id: id}, {$pull: {tags: tag}});
    }, 300);
  }
});

Template.todo_item.events(okCancelEvents(
  '#todo-input',
  {
    ok: function (value) {
      Todos.update(this._id, {$set: {text: value}});
      Session.set('editing_itemname', null);
    },
    cancel: function () {
      Session.set('editing_itemname', null);
    }
  }));

Template.todo_item.events(okCancelEvents(
  '#edittag-input',
  {
    ok: function (value) {
      Todos.update(this._id, {$addToSet: {tags: value}});
      Session.set('editing_addtag', null);
    },
    cancel: function () {
      Session.set('editing_addtag', null);
    }
  }));

////////// Tag Filter //////////

// Pick out the unique tags from all todos in current list.
Template.tag_filter.tags = function () {
  var tag_infos = [];
  var total_count = 0;

  Todos.find({list_id: Session.get('list_id')}).forEach(function (todo) {
    _.each(todo.tags, function (tag) {
      var tag_info = _.find(tag_infos, function (x) { return x.tag === tag; });
      if (! tag_info)
        tag_infos.push({tag: tag, count: 1});
      else
        tag_info.count++;
    });
    total_count++;
  });

  tag_infos = _.sortBy(tag_infos, function (x) { return x.tag; });
  tag_infos.unshift({tag: null, count: total_count});

  return tag_infos;
};

Template.tag_filter.tag_text = function () {
  return this.tag || "All items";
};

Template.tag_filter.selected = function () {
  return Session.equals('tag_filter', this.tag) ? 'selected' : '';
};

Template.tag_filter.events({
  'mousedown .tag': function () {
    if (Session.equals('tag_filter', this.tag))
      Session.set('tag_filter', null);
    else
      Session.set('tag_filter', this.tag);
  }
});
*/


