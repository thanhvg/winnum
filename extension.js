//Import the Main and Meta object
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Lang = imports.lang;

// Import shell
const Shell = imports.gi.Shell;

// Import the convenience.js (Used for loading settings schemas)
const Self = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;
const Settings = Convenience.getSettings();

function WinNum() {
  this.init();
}

WinNum.prototype = {
  Name: 'WinNum',

  init: function() {
   // this.settings = Convenience.getSettings();
  },

  handler: function(num) {
    // var num2 = 1;
    // Main.notify('inside handler');
    // var windowListLength = global.screen.get_active_workspace().list_windows().length;
    // if (windowListLength > num)
    //  global.screen.get_active_workspace().list_windows()[num].activate(0);
    let wn
    let metaWorkspace = global.screen.get_active_workspace();
    let focus_window = global.display.focus_window;
    let monitor = focus_window.get_monitor();
    let windows = metaWorkspace.list_windows().filter(function(w) {return w && !w.skip_taskbar && w.get_monitor() == monitor;});
    windows.sort(function(w1, w2) {
      return w1.get_stable_sequence() - w2.get_stable_sequence();
    });
    // if (num == -1) windows[windows.length-1].activate(0);
    // else if (windows.length > num) windows[num].activate(0);
    if (num == -1) wn = windows[windows.length-1];
      else wn = windows[num];
    // check state
    // if (wn == global.display.focus_window) wn.minimize();
    if (wn == focus_window) wn.minimize();
      else wn.activate(0);
      
  },

  _addKeybindings: function(name, num) {
    // Main.notify('inside _addKeybindings '+ num);
    var ModeType = Shell.hasOwnProperty('ActionMode') ? Shell.ActionMode : Shell.KeyBindingMode;
    // Main.wm.addKeybinding(name, Settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, this.handler(num)); - Not working
    // Main.wm.addKeybinding(name, Settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, Lang.bind(this, function(num) {this.handler(num)})); - not working

    Main.wm.addKeybinding(name, Settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, Lang.bind(this, function() {this.handler(num-1)}));

    // working !
    // Main.wm.addKeybinding(name,
    //                      Settings,
    //                      Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW,
    //                      Lang.bind(this,
    //                                function() {
    //                                  var windowListLength = global.screen.get_active_workspace().list_windows().length;
    //                                  if (windowListLength > num)
    //                                    global.screen.get_active_workspace().list_windows()[num].activate(0);       }
    //                               )
    //                      );

    // Main.wm.addKeybinding(name, Settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, Lang.bind(this, this.handler(num))); - Not working

  },

  _removeKeybindings: function(name) {
        	Main.wm.removeKeybinding(name);
	},

  enable: function() {
    for(var i=0; i<10; i++) {
      this._addKeybindings('app-key'+i,i);
    }
  },

  disable: function() {
    for(var i=0; i<10; i++) {
      this._removeKeybindings('app-key'+i);
    }

  },
};

let app;

// create app keys app
function init() {
	app = new WinNum();
}

function enable() {
	app.enable();
}

function disable() {
    app.disable();
}
