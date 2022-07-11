/*
  Scrolling Platformer Lab:
  
  Add scrolling ability to the player. 
  
  
  Complete the code as indicated by the comments.
  Do the following:
  1) You'll need implement the method scroll() below. Use the view_x and view_y variables
  already declared and initialized. 
  2) Call scroll() in draw().
  See the comments below for more details. 
 
*/

const MOVE_SPEED = 4;
const SPRITE_SCALE = 50.0 / 128;
const SPRITE_SIZE = 50;
const GRAVITY = 0.6;
const JUMP_SPEED = 14;

const RIGHT_MARGIN = 400;
const LEFT_MARGIN = 60;
const VERTICAL_MARGIN = 40;

//declare global variables
let player;
let snow, crate, red_brick, brown_brick;
let mapData;
let platforms = []; //will contain a list of Sprite objects

let view_x, view_y;

//preload function will run and finish before setup() starts
//this is useful for loading map data
//before we try to run any code with
function preload() {
  mapData = loadTable("assets/map.csv", "csv");
}

//initialize them in setup().
function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  player = new Sprite("assets/player.png", 0.8, 100, 100);

  view_x = 0;
  view_y = 0;

  //call createPlatforms function
  createPlatforms(mapData);
}

// modify and update them in draw().
function draw() {
  background(255);

  // call scroll here. Need to call scroll first!
  scroll();
  //player display and update
  player.display();

  //resolve platform collisions
  resolvePlatformCollisions(player, platforms);

  //this for loop makes all the Sprite objects
  //display themselves
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].display();
  }
}


function scroll() {
  // create and initialize left_boundary variable
  let left_boundary = view_x + LEFT_MARGIN;
  if (player.getLeft() < left_boundary){
    view_x -= (left_boundary - player.getLeft());     
  }
  
  
  // create and initialize right_boundary variable
  let right_boundary = view_x + width - RIGHT_MARGIN;
  if (player.getRight() > right_boundary){
    view_x += player.getRight() - right_boundary;    
  }
  
  

  // create and initialize top_boundary variable
  let top_boundary = view_y + VERTICAL_MARGIN;
  if (player.getTop() < top_boundary){
    view_y -= top_boundary - player.getTop();
  }

  
  
  // create and initialize bottom_boundary variable
  let bottom_boundary = view_y + height - VERTICAL_MARGIN;

  
  if (player.getBottom() > bottom_boundary){
    view_y += player.getBottom() - bottom_boundary;
  }  
  translate(-view_x, -view_y);
}

// returns true if sprite is one a platform.
function isOnPlatforms(s, walls){
  // move down say 5 pixels
  s.center_y += 5;

  // check to see if sprite collide with any walls by calling checkCollisionList
  let collision_list = checkCollisionList(s, walls);
  
  // move back up 5 pixels to restore sprite to original position.
  s.center_y -= 5;
  
  // if sprite did collide with walls, it must have been on a platform: return true
  // otherwise return false.
  return collision_list.length > 0; 
}

// implement this method.
function resolvePlatformCollisions(s, walls) {
  // add gravity to change_y of sprite
  s.change_y += GRAVITY;

  // move in y-direction by adding change_y to center_y to update y position.
  s.center_y += s.change_y;

  // Now resolve any collision in the y-direction:
  // compute collision_list between sprite and walls(platforms).
  let collisions = checkCollisionList(s, walls);

  /* if collision list is nonempty:
       get the first platform from collision list
       if sprite is moving down(change_y > 0)
         set bottom of sprite to equal top of platform
       else if sprite is moving up
         set top of sprite to equal bottom of platform
       set sprite's change_y to 0
  */
  if (collisions.length > 0) {
    let collided = collisions[0];
    if (s.change_y > 0) {
      s.setBottom(collided.getTop());
    } else if (s.change_y < 0) {
      s.setTop(collided.getBottom());
    }
    s.change_y = 0;
  }

  // move in x-direction by adding change_x to center_x to update x position.
  s.center_x += s.change_x;

  // Now resolve any collision in the x-direction:
  // compute collision_list between sprite and walls(platforms).
  collisions = checkCollisionList(s, walls);
  /* if collision list is nonempty:
       get the first platform from collision list
       if sprite is moving right
         set right side of sprite to equal left side of platform
       else if sprite is moving left
         set left side of sprite to equal right side of platform
  */
  if (collisions.length > 0) {
    let collided = collisions[0];
    if (s.change_x > 0) {
      s.setRight(collided.getLeft());
    } else if (s.change_x < 0) {
      s.setLeft(collided.getRight());
    }
  }
}

// returns whether the two Sprites s1 and s2 collide.
function checkCollision(s1, s2) {
  let noXOverlap =
    s1.getRight() <= s2.getLeft() || s1.getLeft() >= s2.getRight();
  let noYOverlap =
    s1.getBottom() <= s2.getTop() || s1.getTop() >= s2.getBottom();
  if (noXOverlap || noYOverlap) {
    return false;
  } else {
    return true;
  }
}

function checkCollisionList(s, list) {
  let collision_list = [];
  for (let i = 0; i < list.length; i++) {
    if (checkCollision(s, list[i])) collision_list.push(list[i]);
  }
  return collision_list;
}

function createPlatforms(filename) {
  //loop through each row
  for (let r = 0; r < mapData.getRowCount(); r++) {
    let row = mapData.getRow(r);
    //loop through each column
    for (let c = 0; c < mapData.getColumnCount(); c++) {
      //calculate center_x and center_y position for next sprite
      let x = SPRITE_SIZE / 2 + c * SPRITE_SIZE;
      let y = SPRITE_SIZE / 2 + r * SPRITE_SIZE;

      //check which value is in the table
      //and load the appropriate sprite
      if (row.getString(c) == "1") {
        let s = new Sprite("assets/red_brick.png", SPRITE_SCALE, x, y);
        platforms.push(s);
      } else if (row.getString(c) == "2") {
        let s = new Sprite("assets/snow.png", SPRITE_SCALE, x, y);
        platforms.push(s);
      } else if (row.getString(c) == "3") {
        let s = new Sprite("assets/brown_brick.png", SPRITE_SCALE, x, y);
        platforms.push(s);
      } else if (row.getString(c) == "4") {
        let s = new Sprite("assets/crate.png", SPRITE_SCALE, x, y);
        platforms.push(s);
      }
    }
  }
}

// called whenever a key is pressed.
function keyPressed() {
  if (keyCode == RIGHT_ARROW || key === 'd') {
    player.change_x = MOVE_SPEED;
  } else if (keyCode == LEFT_ARROW || key === 'a') {
    player.change_x = -MOVE_SPEED;
  } else if (isOnPlatforms(player, platforms) && (keyCode == UP_ARROW || key === 'w')) {
    player.change_y = -JUMP_SPEED;
    jumpFinished = false;
  } else if (keyCode == DOWN_ARROW || key === 's') {
    player.change_y = JUMP_SPEED;
  }
}

// called whenever a key is released.
function keyReleased() {
  if (keyCode == RIGHT_ARROW || key === 'd') {
    player.change_x = 0;
  } else if (keyCode == LEFT_ARROW || key === 'a') {
    player.change_x = 0;
  } else if (keyCode == UP_ARROW || key === 'w') {
    player.change_y = 0;
  } else if (keyCode == DOWN_ARROW || key === 'd') {
    player.change_y = 0;
  }
}
