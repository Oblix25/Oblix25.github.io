

export default class Javelin extends Phaser.GameObjects.Sprite
{
  constructor(config)
  {
    super(config.scene);
    this.scene = config.scene;
    this.setTexture("jav");
    this.setOrigin(0.5,0.5);
    this.setSize(20,20);
    this.setDisplayOrigin(0.5,0.5);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.scene.playerAttacks.add(this);

    //add collisions
    config.scene.physics.add.overlap(this, this.scene.enemyGroup, (jav, enemy) => jav.hit(enemy));
    config.scene.physics.add.overlap(this, this.scene.midGround, (jav, ground) => jav.stuck() );

    //stats
    this.TURN_RATE = 5; //turn rate in degrees per frame
    this.SPEED = 9000;   // speed in pixels per second
    this.DAMAGE = 1;    // how many cuts this will inflict to an enemy
    this.THROWTIME = 100;  // how long to accelerate in ms
    this.DIRECTION = 0;
  }

  update(time,delta)
  {
     this.updateRotation(delta);
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
    if ( dir.x > 0.05) {
      this.rotation = Phaser.Math.Linear(this.rotation, targetRot, step);
    }
  }

  hit(thing=1)
  {
    if(thing.alive)
    {
      thing.hurt(2);
    }//else if( thing === )

    this.stuck(thing);
  }

  stuck(thing=1)
  {

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.setAllowGravity(false);

    // can be picked up now
    this.scene.physics.add.overlap(this, this.scene.player.player, (jav, player) => {

      this.scene.statemachine.transition("jump");
      player.body.setVelocityY(-700);

      jav.pickUp(thing);

    });
  }

  pickUp(thing)
  {
    if(!thing===1){
      thing.hurt(1, true);
    }
    this.kill();
  }

  kill()
  {
    // Forget about this bullet
    this.active = false;
    this.scene.playerAttacks.remove(this);
    this.destroy();
  }

}
