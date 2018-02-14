function Keyboard()
{
  this.locks = [];
  this.history = "";

  this.listen_onkeydown = function(event)
  {
  }

  this.listen_onkeyup = function(event)
  {
    if(this.locks.length > 0){ console.warn("Keyboard has locks: ",this.locks); return; }
  
    switch (event.keyCode)
    {
      case 87: this.key_arrow_up(); break;    // w
      case 83: this.key_arrow_down(); break;  // S
      case 65: this.key_arrow_left(); break;  // A
      case 68: this.key_arrow_right(); break; // D

      case 38: this.key_arrow_up(); break;
      case 40: this.key_arrow_down(); break;
      case 37: this.key_arrow_left(); break;
      case 39: this.key_arrow_right(); break;

      case 27: this.key_escape(); break;
      case 32: this.key_space(); break;
    }

    this.record(event.key);
  };

  this.key_enter = function()
  {
    console.info("enter");
  }

  this.key_space = function()
  {
    console.info("space");
  }

  this.key_arrow_up = function()
  {
    pico.grid.cursor.move(0,1);
  }

  this.key_arrow_down = function()
  {
    pico.grid.cursor.move(0,-1);
  }

  this.key_arrow_left = function()
  {
    pico.grid.cursor.move(-1,0);
  }

  this.key_arrow_right = function()
  {
    pico.grid.cursor.move(1,0);
  }
  this.key_escape = function()
  {
    console.info("escape");
    oquonie.dialog.hide();
    oquonie.overlay.hide();
  }

  this.lock = function(lock_name)
  {
    console.log("Added lock: ",lock_name);
    this.locks.push(lock_name);
  }

  this.unlock = function(lock_name)
  {
    var target = this.locks.indexOf(lock_name);
    if(target > -1) {
      this.locks.splice(target, 1);
      console.info("Unlocked: ",lock_name);
    }
    else{
      console.warn("No lock named: ",lock_name);
    }
  }

  this.record = function(key)
  {
    if(this.history.length > 30){ this.history = this.history.substr(this.history.length - 30,30); }

    this.history += key;

    if(this.history.indexOf("noplacelikehome") > -1){
      this.history = "";
      oquonie.stage.enter_room(1,0,0);
    }
    if(this.history.indexOf("susannakaysen") > -1){
      this.history = "";
      oquonie.game.new();
      oquonie.stage.enter_room(25,0,0);
    }

    if(this.history.indexOf("necomedre") > -1){
      this.history = "";
      oquonie.player.transform("necomedre");
    }
    if(this.history.indexOf("nemedique") > -1){
      this.history = "";
      oquonie.player.transform("nemedique");
    }
    if(this.history.indexOf("catfishbird") > -1){
      this.history = "";
      oquonie.player.transform("catfishbird");
    }
    if(this.history.indexOf("redgate") > -1){
      this.history = "";
      oquonie.stage.enter_room(100,0,0);
    }
    if(this.history.indexOf("speaker") > -1){
      this.history = "";
      oquonie.music.pause_ambience();
    }
    if(this.history.indexOf("walkthrough") > -1){
      this.history = "";
      oquonie.walkthrough.walk_all();
    }
  }
}
