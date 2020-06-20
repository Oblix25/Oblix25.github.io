//import StuckJavelin from './stuckjavelin.js';
import {StateMachine, State} from '../statemachine.js';

export default class Javelin extends Phaser.GameObjects.Sprite
{
  constructor(config)
  {
    super(config.scene);
    this.scene = config.scene;
    this.setTexture("jav");
    this.setOrigin(0.5,0.5);
    this.setSize(20,20);
    //this.setDisplayOrigin(0.5,0.5);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.scene.playerAttacks.add(this);



    //stats
    this.TURN_RATE = 5; //turn rate in degrees per frame
    this.SPEED = 9000;   // speed in pixels per second
    this.DAMAGE = 1;    // how many cuts this will inflict to an enemy
    this.THROWTIME = 100;  // how long to accelerate in ms
    this.DIRECTION = 0;
    this.ENEMYNAME;
    this.collider1;
    this.collider2;
    this.overlap1;
    this.THING;

    this.javBrain = new StateMachine( 'fly',{
      fly: new FlyState(),
      stuck: new StuckState()
    },
    [this.scene, this]
  );

  }

  update(time,delta)
  {

     this.javBrain.step(delta);
  }

  fire(config)
  {

    // unpack and lable
    const startX = config.x;
    const startY = config.y;
    const targetX = config.targetX;
    const targetY = config.targetY;

    // add our starting point
    this.setActive(true).setVisible(true);
    this.setPosition( startX, startY );


    // find out where we need to go and point the sprite there
    this.rotation = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);

    const vectX = Math.cos(this.rotation) * this.SPEED;
    const vectY = Math.sin(this.rotation) * this.SPEED;

    //report
    console.log(this.rotation);

    //push body
    this.body.setAcceleration(vectX, vectY);
    this.scene.time.delayedCall(this.THROWTIME,
          () => {
            if(this.body) {this.body.setAcceleration(0,0)}else{return;}
          }, this);
    //this.body.setVelocity(vectX, vectY);


  }

  updateRotation(delta)
  {
    const dir = this.body.velocity;
    const step = delta * 0.001 * 5; // convert to sec
    const targetRot = Phaser.Math.Angle.Wrap( dir.angle());

    // Update the rotation smoothly.
    if ( dir.x > 0.05 || dir.x < -0.05) {
      //  this.rotation = Phaser.Math.Linear(this.rotation, targetRot, step);
      this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetRot, step);
    }
  }

  hit(thing=0)
  {
    if(thing.alive)
    {
      thing.hurt(1);
    }//else if( thing === )
    this.THING = thing;
    this.stuck();
  }

  pickUp(thing=0){
    if(thing.alive){
      thing.hurt(1, true);
    }
    this.kill();
  }

  stuck()
  {


        this.javBrain.transition('stuck');
  }

  kill()
  {
    // Forget about this bullet
    this.overlap1.destroy();
    this.collider1.destroy();
    this.active = false;
    this.scene.playerAttacks.remove(this);
    this.destroy();
  }

}

class FlyState extends State
{
  enter(scene, jav){

    jav.body.setAllowGravity(true);
    jav.overlap1 = scene.physics.add.overlap(jav, scene.enemyGroup, (jav, enemy) => {
      if(jav.javBrain.state === 'fly') jav.hit(enemy)
    });

    jav.collider1 = scene.physics.add.collider(jav, scene.midGround, (jav, ground) => jav.stuck() );
  }

  execute(scene, jav, delta){
    jav.updateRotation(delta);
  }
}

class StuckState extends State
{
  enter(scene, jav){
    jav.body.setVelocityX(0);                                                               // stop jav from moving
    jav.body.setVelocityY(0);
    jav.body.setAllowGravity(false);

    jav.overlap2 = scene.physics.add.overlap(jav, scene.player.player, (jav, player) => {   //player pulls out jav and flipps up when touching

          jav.scene.statemachine.transition("jump");
          player.body.setVelocityY(-700);
          player.javelinCount++;
          jav.pickUp(jav.THING);
        });
  }

  execute(scene, jav){


    if(jav.THING){
      if (scene.children.getByName(`${jav.THING.name}`)){
        const enemy = scene.children.getByName(`${jav.THING.name}`);
        jav.body.velocity.x = enemy.body.velocity.x;                                          // move jav with it if so
        jav.body.velocity.y = enemy.body.velocity.y;
      }else{
        jav.javBrain.rewind();
        jav.THING = 0;
      }                                                                  // check if thing jav is stuck in is fleash and blood
    }

  }

}
