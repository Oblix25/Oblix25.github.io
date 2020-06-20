import {State, StateMachine} from "./statemachine.js";
import Javelin from "./projectiles/javelin.js";

export default class Player {

  constructor ({
     scene: scene,
     x:x,
     y:y
    })
  {

    //physics body and animation
    this.player = scene.physics.add
       .sprite(x, y, "player", 0)
       .setOrigin(0.5,0.5)
       ;
    this.player.canJump = true;
    this.player.javelinCount = 3;
    //set up StateMachine
    scene.statemachine = new StateMachine( 'idle',
      {
        idle: new IdleState(),
        run: new RunState(),
        jump: new JumpState(),
        stab: new StabState(),
        pick: new PickState(),
        fly: new FlyState(),
        aim: new AimState()
      },
      [scene, this.player]
    );

    this.setPlayerKeys(scene);
    this.setPlayerAnimations(scene);






     this.playerCamera = scene.cameras.main
     .startFollow(this.player)
     .setLerp(0.05)
     .setDeadzone(100,100)
     //.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
     .zoom = 1;



  }

  update(time, delta, scene)
  {
    const {statemachine, speedFollow} = this;

    scene.statemachine.step();

    this.speedFollow(this.contLerp, scene);

    scene.checkPlayerStats.setText([
      " player _state:    " + scene.statemachine.state +
      "\nJavelins: "        + this.player.javelinCount

    ] );
  }

  //makes the camera try to catch up with the player

  speedFollow(conLerp, scene)
  {

    this.distanceFmCam = Phaser.Math.Distance.Between(scene.cameras.main.midPoint.x, scene.cameras.main.midPoint.y, this.player.x, this.player.y);



    if(this.distanceFmCam < 150 && conLerp <= 0.05)
    {
      conLerp -= 0.000000000001;
      scene.cameras.main.setLerp(conLerp);
    }else if( this.distanceFmCam > 150 && conLerp < 0.3){
      //set to 0.05 for glorious motion sickness
      conLerp += 0.06;
      scene.cameras.main.setLerp(conLerp);
    }else if (this.distanceFmCam > 400 && conLerp < 0.75){
      conLerp += -0.002;
      scene.cameras.main.setLerp(conLerp);
      this.playerCamera.shake(3000);
    }

  }

  setPlayerKeys(scene) {


        // Track the arrow keys & WASD
        const {LSHIFT, LEFT, RIGHT, UP, DOWN, SPACE, W, A, D, S, Z, X, C} = Phaser.Input.Keyboard.KeyCodes;
        scene.keys = scene.input.keyboard.addKeys({
          left: LEFT,
          right: RIGHT,
          up: UP,
          down: DOWN,
          space: SPACE,
          lshift: LSHIFT,
          w: W,
          a: A,
          d: D,
          s: S,
          z: Z,
          x: X,
          c: C
        });


  }

setPlayerAnimations(scene){

  scene.anims.create({
    key: 'stab',
    frames: "hit",
    frameRate: 1
  });
}


}



class IdleState extends State {
    enter(scene, player) {
      player.setVelocity(0);
      player.setTexture("player");
    }

    execute(scene, player) {
      const {left, right, space, x, c, w, a, s, d, Lshift} = scene.keys;

      //stab if x is pressed

      if(!player.body.blocked.down){
        scene.statemachine.transition('jump', true);
      }

      if (x.isDown) {
        scene.statemachine.transition('stab');
        return;
      }

      if (c.isDown) {
        scene.statemachine.transition('pick');
        return;
      }
      if(scene.input.activePointer.leftButtonDown() ){
          scene.statemachine.transition('aim');
          return;
      }
/*
      scene.input.on('pointerdown', function (pointer) {

              if (pointer.rightButtonDown())
              {
                  scene.statemachine.transition('aim');
              }
      });
*/
      //stab if pressing x
      if (c.isDown){
        scene.statemachine.transition('pick');
        return;
      }


      // Transition to jump if pressing space
      if (space.isDown && player.canJump === true) {
        player.canJump = false;
        scene.statemachine.transition('jump');
        return;
      }

      // Transition to move if pressing a movement key
      if (left.isDown || right.isDown || a.isDown || d.isDown) {
        scene.statemachine.transition('run');
        return;
      }
    }

    stab(scene) {
      scene.statemachine.transition('stab');
    }

    pick(scene){
      scene.statemachine.transition('pick');
    }
}


export class RunState extends State {
  enter(scene, player) {
    player.setTexture('player');

  }

  execute(scene, player) {
    const {left, right, space, x, c, w, a, s, d, Lshift} = scene.keys;



    //scene.input.keyboard.once("keydown-X", ()=> {this.stab(scene)}, this );
    //scene.input.keyboard.once("keydown-C", ()=> {this.pick(scene)}, this );
    if(!player.body.blocked.down){
      scene.statemachine.transition('jump', true);
    }

    if(scene.input.activePointer.leftButtonDown() ){
        scene.statemachine.transition('aim');
        return;
    }

    if (x.isDown) {
      player.body.velocity.x = 0;
      scene.statemachine.transition('stab');
      return;
    }

    if (c.isDown) {
      scene.statemachine.transition('pick');
      return;
    }

    if(scene.input.activePointer.rightButtonDown() ){
        scene.statemachine.transition('aim');
        return;
    }

    //jump if pressing space
    if (space.isDown && player.canJump === true && player.body.blocked.down){
      player.canJump = false;
      scene.statemachine.transition('jump');
      return;
    }

    if (!(left.isDown || right.isDown)) {
      if(!(a.isDown || d.isDown)){
        scene.statemachine.transition('idle');
      }
    }

    if (left.isDown){
      player.setVelocityX(-200);
      player.flipX = true;
    }else if (right.isDown){
      player.setVelocityX(200);
      player.flipX = false;
    }else if (a.isDown){
      player.setVelocityX(-200);
      player.flipX = true;
    }else if (d.isDown){
      player.setVelocityX(200);
      player.flipX = false;
    }



  }


}


class StabState extends State {
  enter(scene, player){
    const {w, s, up, down} = scene.keys;
    let direction;


    if(up.isDown || w.isDown || down.isDown || s.isDown)
    {
          if (s.isDown || down.isDown)
            {
             direction = "down";
           }else{
             direction = "up";
           }

    }

    scene.edge.swing(player.x, player.y, player.flipX, scene, direction);
    player.setTexture("player_att");
    scene.time.delayedCall( 100, ()=> {scene.statemachine.rewind()} );


  }

  execute(scene, player){

  }

}

class AimState extends State {
  enter(scene, player){
    player.setTexture("player_hold");
    player.setVelocity(0);
  }

  execute(scene, player){
    const {} = scene.keys;

    if(player.javelinCount >= 1) {

            if(scene.input.activePointer.leftButtonReleased() ){


              let jav = new Javelin({
                scene: scene
              });

              if (jav){                                                       //check if jave we created still exists
                player.javelinCount--;                                          //and remove one jav from the bag
                jav.fire({                                                    //abd fire it
                  x: player.x,
                  y: player.y,
                  targetX: scene.input.activePointer.worldX,
                  targetY: scene.input.activePointer.worldY
                });
              }

              scene.statemachine.transition('idle');
            }
          //right button released, throw jav  //return to idle early if we don't have javelins in our bag
    }else{
      scene.statemachine.rewind();
    }




  }
}

class PickState extends State {
  enter(scene, player){
    player.setVelocityX(0);
    scene.pick.swing(player.x, player.y, player.flipX, scene);
    player.setTexture("player_att");
    scene.time.delayedCall( 300, ()=> {scene.statemachine.rewind()} );

  }

  execute(scene, player){

  }

}

class FlyState extends State {
  enter(scene, player){
    player.body.setAllowGravity(false);
  }

  execute(scene, player){
        const {left, right, up, down, space, a, s, d, w} = scene.keys;
        const speed = 800;

            if (left.isDown){
              player.setVelocityX(-speed);
              player.flipX = true;
            }else if(a.isDown){
              player.setVelocityX(-speed);
              player.flipX = true;
            }else if (right.isDown){
              player.setVelocityX(speed);
              player.flipX = false;
          }else if(d.isDown){
            player.setVelocityX(speed);
            player.flipX = false;
          }else{
            player.setVelocityX(0);
          }

          if (up.isDown){
            player.setVelocityY(-speed);
          }else if(w.isDown){
            player.setVelocityY(-speed);
          }else if (down.isDown){
            player.setVelocityY(speed);
          }else if(s.isDown){
            player.setVelocityY(speed);
          }else{
            player.setVelocityY(0);
          }

          if (space.isDown && down.isDown){
            player.body.setAllowGravity(true);
            scene.statemachine.transition("idle");
          }else if(space.isDown && s.isDown){
            player.body.setAllowGravity(true);
            scene.statemachine.transition("idle");
          }
  }
}


export class JumpState extends State {

    enter(scene, player, nojump=false) {
      player.anims.stop();
      if(nojump == false){
        if(scene.statemachine.stateStack[1] != 'stab')
        {
            player.setVelocityY(-400);
        }
      }
     player.canJump = false;
    }

    execute(scene, player) {
      const {left, right, space, up, w, a, s, d, x} = scene.keys;


          player.rotation++;
      if(x.isDown){
       scene.statemachine.transition('stab');
      }

      if (left.isDown){
        player.setVelocityX(-200);
        player.flipX = true;
      }else if (right.isDown){
        player.setVelocityX(200);
        player.flipX = false;
      }else if (a.isDown){
        player.setVelocityX(-200);
        player.flipX = true;
      }else if (d.isDown){
        player.setVelocityX(200);
        player.flipX = false;
      }else if (right.isUp && left.isUp){
      player.setVelocityX(0);
    }

    if (space.isDown && up.isDown){
      player.rotation = 0;
      scene.statemachine.transition('fly');
    }else if(space.isDown && w.isDown){
      player.rotation = 0;
      scene.statemachine.transition('fly');
    }

    if  (player.canJump === true && player.body.blocked.down === true){
      if (player.velocityX === 0) {
      player.rotation = 0;
      scene.statemachine.transition('idle');
    }
    player.rotation = 0;
    scene.statemachine.transition('run');

   }
 }
}
