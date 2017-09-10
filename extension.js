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
    let wn;
    let metaWorkspace = global.screen.get_active_workspace();
    let focus_window = global.display.focus_window;
    let monitor = focus_window.get_monitor();
    let windows = metaWorkspace.list_windows()
          .filter(function(w) {return w && !w.skip_taskbar && w.get_monitor() == monitor;})
          .sort(function(w1, w2) {
            return w1.get_stable_sequence() - w2.get_stable_sequence();
          });
    if (num == -1) wn = windows[windows.length-1];
      else wn = windows[num];
    if (wn == focus_window) wn.minimize();
      else wn.activate(0);
  },


  shiftHandler: function(num) {
    let wn;
    let metaWorkspace = global.screen.get_active_workspace();
    let focus_window = global.display.focus_window;
    let monitor = focus_window.get_monitor();
    let windows = metaWorkspace.list_windows()
          .filter(function(w) {return w && !w.skip_taskbar && w.get_monitor() != monitor;})
          .sort(function(w1, w2) {
            return w1.get_stable_sequence() - w2.get_stable_sequence();
          });
    if (num == -1) wn = windows[windows.length-1];
    else wn = windows[num];
    if (wn == focus_window) wn.minimize();
    else wn.activate(0);
  },

  _addKeybindings: function(name, num, handler) {
    // Main.notify('inside _addKeybindings '+ num);
    var ModeType = Shell.hasOwnProperty('ActionMode') ? Shell.ActionMode : Shell.KeyBindingMode;
    Main.wm.addKeybinding(name, Settings, Meta.KeyBindingFlags.NONE, ModeType.NORMAL | ModeType.OVERVIEW, Lang.bind(this, function() {handler(num-1);}));
  },

  _removeKeybindings: function(name) {
   	Main.wm.removeKeybinding(name);
	},

  enable: function() {
    for(var i=0; i<10; i++) {
      this._addKeybindings('app-key'+i, i, this.handler);
      this._addKeybindings('app-shift-key'+i, i, this.shiftHandler);
    }
  },

  disable: function() {
    for(var i=0; i<10; i++) {
      this._removeKeybindings('app-key'+i);
      this._removeKeybindings('app-shift-key'+i);
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
