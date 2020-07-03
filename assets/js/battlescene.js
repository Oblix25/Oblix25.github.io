//import Player from "./player.js";
import Player from './player.js';
import {spawner} from './spawner.js';
import {mapChange} from './mapchange.js';


export default class BattleScene extends Phaser.Scene
{



  constructor()
  {
    super({
      key: 'battleScene'
    });

  }

  preload()
{

}

  create()
  {

   this.start = this.registry.get('map1');
   this.second = this.registry.get('map2');
   this.third = this.registry.get("map3");
   this.fourth = this.registry.get("map4");







  this.debugKeys(this);


  this.checkPlayerStats = this.add.text(100,100, "  "

    ,{
      font: '32px monospace',
      fill: '#000',
      padding: {x:5, y:5},
      backgroundColor: '#ffffff'
  })
  .setScale(0.4)
  .setScrollFactor(0)
  .setDepth(30);

  this.checkStats = this.add.text(100,200, "  "

    ,{
      font: '32px monospace',
      fill: '#000',
      padding: {x:5, y:5},
      backgroundColor: '#ffffff'
  })
  .setScale(0.4)
  .setScrollFactor(0)
  .setDepth(30);


  this.stuffConfig = {};

  this.playerGroup = this.add.group();
  //this.javelinBagGroup = this.add.group();
  this.enemyGroup = this.add.group();
  this.playerAttacks = this.add.group();
  this.enemyBullets = this.add.group();
  this.alarms = this.add.group();


  //this.physics.add.overlap(this.enemyGroup, this.playerAttacks, (enemy, attack) => attack.hit(enemy) );



  mapChange(this, this.second);
  this.setUpPointer(this);



}

  setUpPointer(scene)
  {

      //scene.reticle = scene.physics.add.sprite(scene.player.player.y,scene.player.player.x, "crosshair");
      //scene.reticle.body.setAllowGravity(false)

      // Move reticle upon locked pointer move
      scene.input.on('pointermove', function (pointer) {
        if (scene.reticle)
        {
            // Move reticle with mouse
            scene.reticle.x += pointer.movementX;
            scene.reticle.y += pointer.movementY;

            // Only works when camera follows player
            var distX = scene.reticle.x-scene.player.player.x;
            var distY = scene.reticle.y-scene.player.player.y;

            // Ensures reticle cannot be moved offscreen
            if (distX > 400)
                scene.reticle.x = scene.player.player.x+400;
            else if (distX < -400)
                scene.reticle.x = scene.player.player.x-400;

            if (distY > 400)
                scene.reticle.y = scene.player.player.y+400;
            else if (distY < -400)
                scene.reticle.y = scene.player.player.y-400;
        }
      }, scene);


  }

 debugKeys(scene)
 {


   let mapSwitch1 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE)
   let mapSwitch2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO)
   let mapSwitch3 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE)
   let mapSwitch4 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)

   mapSwitch1.on("down", (key, event) => {
     mapChange(scene, scene.start);
   });

   mapSwitch2.on("down", (key, event) => {
     mapChange(scene, scene.second);
   });

   mapSwitch3.on("down", (key, event) => {
     mapChange(scene, scene.third);
   });

   mapSwitch4.on("down", (key, event) => {
     mapChange(scene, scene.fourth);
   });


 }






  update(time, delta)
  {

    this.player.update(time, delta, this);
    //this.reticle.body.velocity.x = this.player.player.body.velocity.x;
    //this.reticle.body.velocity.y = this.player.player.body.velocity.y;

  this.enemyGroup.children.entries.forEach(
    (child)=>{
      if (child.active)
      {
        child.update(time, delta, this);
      }
    }
  );

  this.playerAttacks.children.entries.forEach(
    (child)=>{
      if (child.active)
      {
        child.update(time, delta, this);
      }
    }
  );

  this.alarms.children.entries.forEach(
    (child)=>{
      if (child.active)
      {
        child.update(this.player.player);
      }
    }
  );

  this.checkStats.setText([
    'current map:' + this.map.name +
    '\nplayer blood: ' + this.player.player.blood
  ]);


  }



}
