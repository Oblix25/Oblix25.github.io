import {State, StateMachine} from "../statemachine.js";


export default class Slime extends Phaser.GameObjects.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y)
    this.setTexture("slime");
    this.setOrigin(0.5,0.5);
    this.setTintFill(0x001110);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    //things to check
    this.alive = true;
    this.active = false;
    this.ID;
    this.bite;
    this.blood = 220;
    this.bleeding = false;
    this.cuts = 0;
    this.weak = false;
    this.canAttack = true;

    //stats to use
    this.maxBlood = 220;
    this.normSpeed = 50;
    this.runSpeed = 100;
    this.pickupSpeed = 600;
    this.attackRange = 100;
    this.strength = 25;                          //determines damage when used as attack arg
    this.windUp = 300;                          //time it takes for slime to let out attack
    this.recovery = 600;                        //time it takes for slime to return to movement state
    this.attackInterval = this.recovery + this.recovery/2;                  //time it takes for slime to ready another attack


    //this.body.setMaxVelocity(100);
  //  this.touching = !this.body.touching.none;
  //  this.wasTouching = !this.body.wasTouching.none;


    this.knockbackTimerConfig = {

          delay: 100,
          callback: () => {
            this.slimeControl.rewind();
          },
          callbackScope: this
    };

    this.bleedTimerConfig = {                    //how long it takes for a cut to heal

        delay: 2000,
        callback: () => {
            this.cuts -= 1;


            if(this.cuts > 0) {
              this.bleedTimer.reset(this.bleedTimerConfig);
            }else{
                this.bleedTimer.paused = true;
            }
        },
        callbackScope: this
    };

    this.attackTimerConfig = {

        delay: this.attackInterval,
        callback: () => {
            this.canAttack = true;
            if (this.canAttack = true){
              this.attackTimer.paused = true;
            }
        },
        callbackScope: this
    };

    this.attackTimer = config.scene.time.delayedCall(this.attackTimerConfig);

    this.bleedTimer = config.scene.time.delayedCall(this.bleedTimerConfig);

    this.bloodCheck = this.scene.add.text(this.x - 50, this.y + -20, 'Blood: '

        ,{
          font: '32px monospace',
          fill: "red",
          padding: {x:5, y:5}
      })
      .setScale(0.4)
      .setDepth(30);


    this.alarm = new Alarm({                            // set up alarm to activate enemy when close
        x: config.x,
        y: config.y,
        scene: config.scene,
        enemy: this,

    });



    this.sightLine = this.scene.add.line({                                 // set up line of sight
      x1: this.x,
      y1: this.y,
      x2: config.scene.player.x,
      y2: config.scene.player.y
    }).setOrigin(0,0);//.setLineWidth(5);

    //this.slimeGraphics = this.scene.add.graphics().lineStyle(5, 0xFF0000, 1.0);                        //call this when using sightLine

    this.slimeGraphics = this.scene.add.line().setOrigin(0.5,0.5);

    config.scene.physics.world.enable(this.slimeGraphics);
    this.slimeGraphics.body.setAllowGravity(false);

    this.slimeGraphics.on('overlapstart', () => {
      this.slimeControl.transition('idle');
      this.slimeGraphics.setStrokeStyle(5, 0xFF0030, 0.5);
    }, this);

    this.slimeGraphics.on('overlapend', () => {
      this.slimeControl.transition('chase');
      this.slimeGraphics.setStrokeStyle(5, 0xFF0000, 1.0);
    }, this);

    this.slimeGraphics.on('overlaping', ()=> {
      this.slimeControl.transition('idle');
      this.slimeGraphics.setStrokeStyle(5, 0xFF0030, 0.5);
    },this);

    this.slimeGraphics.on('notoverlaping', ()=> {
        this.slimeControl.transition('chase');
        this.slimeGraphics.setStrokeStyle(5, 0xFF0000, 1.0);
    },this);

    //set up StateMachine
    this.slimeControl = new StateMachine( 'chase',
      {
        idle: new IdleState(),
        chase: new ChaseState(),
        attack: new AttackState(),
        knockback: new KnockedState()
      },
      [config.scene, this]
    );
  }

  update(time,delta)
  {





          //no fluids is fatal
          if(this.blood < 1) { this.kill(); }

          if(this.cuts > 0) {
            this.blood--;
            if(!this.bleedTimer.getProgress() > 0)
            {
              this.bleedTimer.reset(this.bleedTimerConfig);
            }

          }else{
            this.bleeding = false;
          }

          if(this.blood < this.maxBlood/2){
            this.weak = true;
            this.setTintFill('white');
          }
      /*
          //emit the particals
          if(this.bleeding) {
            this.setAlpha(0.5);
            this.blood--
            if(this.blood < this.maxBlood/2){
              this.weak = true;
              this.setTintFill();
            }
          }
      */


      if(this.active){

        this.updateLOS();                                    //handles the movment and overlap of sightLine for each frame
        this.slimeControl.step();
        this.bloodCheck.setText(['blood: ' + this.blood + "\ncuts: " + this.cuts + "\nbleeding: " + this.bleeding + '\nstate: ' + this.slimeControl.state]).setX(this.x - 50).setY(this.y + -90);
        if(this.knockTimer) this.bloodCheck.setText([ this.knockTimer.getProgress()]);

      }



  }

  hurt(damage, exe) {

    this.bleed(damage, exe);

  }

  bleed(damage=1, exe)
  {
      if (exe === true && this.weak === true) this.kill();
      this.cuts = this.cuts + damage;
      this.bleeding = true;

  }

  updateLOS(){

    var tilesInSight = this.scene.midGround.getTilesWithinShape(this.slimeGraphics.geom);
    var isWallThere = false;
    var i;

    for (i=0; i < tilesInSight.length; i++){
      if(tilesInSight[i].collideRight == true){
        isWallThere = true;
        break;
      }
    }

    if(!isWallThere) {
      this.slimeGraphics.body.embedded = false;
    }else{
      this.slimeGraphics.body.embedded = true;
    }

    if (this.slimeGraphics.body.embedded) this.slimeGraphics.body.touching.none = false;

    var touching = !this.slimeGraphics.body.touching.none;
    var wasTouching = !this.slimeGraphics.body.wasTouching.none;


    if (touching && !wasTouching) this.slimeGraphics.emit("overlapstart");
    else if (!touching && wasTouching) this.slimeGraphics.emit("overlapend");

    this.slimeGraphics.setTo(this.x, this.y, this.scene.player.player.x, this.scene.player.player.y);

  }

  clearDebug(){
    this.bloodCheck.setText(' ');
    this.bloodCheck.destroy();
    this.alarm.destroy();
    this.slimeGraphics.setAlpha(0);
    this.slimeGraphics.destroy();
    this.scene.registry.remove(`${this.ID}`);
  }

  kill() {
      // Forget about this enemy
      this.clearDebug();
      this.active = false;
      this.destroy();
  }
/*
  activated() {
      // Method to check if an enemy is activated, the enemy will stay put
      // until activated so that starting positions is correct
      if (!this.alive) {
          if (this.y > 240) {
              this.kill();
          }
          return false;
      }
      if (!this.beenSeen) {
          // check if it's being seen now and if so, activate it
          if (this.x < this.scene.cameras.main.scrollX + this.scene.sys.game.canvas.width + 32) {
              this.beenSeen = true;
              this.body.velocity.x = this.direction;
              this.body.allowGravity = true;
              return true;
          }
          return false;
      }
      return true;
  }
*/
}

//states

class IdleState extends State {
  enter(scene, slime){
    slime.setTexture("slime");
    slime.body.setVelocityX(0);
    slime.body.setAccelerationX(0);
  }

  execute(scene, slime){

  }

  exit(){

  }

}

class ChaseState extends IdleState {
  enter(scene, slime){

  }

  exit(){

  }

  execute(scene, slime){

      this.chase(scene, slime);
      this.checkAttack(scene, slime);


  }

  checkAttack(scene, slime){
    if(scene.player.player.y - slime.attackRange < slime.y && scene.player.player.y + slime.attackRange > slime.y){
      if(scene.player.player.x - slime.attackRange < slime.x && scene.player.player.x + slime.attackRange > slime.x){
        if(slime.canAttack == true) slime.slimeControl.transition('attack');
      }
    }

  }

  exit(scene, slime){
    slime.body.setAccelerationX(0);
  }

  chase(scene, slime){

    //make slime attack if in range //slime.attackRange


    if(scene.player.player.x - 30 > slime.x ){
      slime.body.setAccelerationX(slime.pickupSpeed);
    }else if(scene.player.player.x + 30 < slime.x){
      slime.body.setAccelerationX(-slime.pickupSpeed);
    }

    if(slime.body.velocity.x > slime.runSpeed){
      slime.body.velocity.x = slime.runSpeed;
    }else if(slime.body.velocity.x < -slime.runSpeed){
      slime.body.velocity.x = -slime.runSpeed;
    }
  }

}

class AttackState extends IdleState {
  enter(scene, slime){
    slime.body.setVelocityX(0);
    let attackLeft;
    slime.canAttack = false;
    if(scene.player.player.x > slime.x)
    {
      attackLeft = false;
    }else{
      attackLeft = true;
    }
    scene.time.delayedCall(slime.windUp, () => {
      if(slime.slimeControl.state = "attack") this.attack(scene, slime, attackLeft); }, [], this );


    scene.time.delayedCall(slime.recovery, () => {
      if(slime.slimeControl.state = "attack") slime.slimeControl.rewind(); }, [], this);


    scene.time.delayedCall(slime.attackInterval, () => slime.canAttack = true, [], this);

  }

  exit(){

  }

  execute(scene, slime){

  }

  attack(scene, slime, attackLeft){
    slime.bite.swing({
      scene: scene,
      x: slime.x,
      y: slime.y,
      goLeft: attackLeft
    });

    slime.attackTimer.reset();

  }
}

class KnockedState {
  enter(scene, slime){

    slime.knockTimer = scene.time.delayedCall( 100, () => slime.slimeControl.rewind(), [], this );
/*
   slime.knockTimer = scene.time.delayedCall({


     callback: () => {
       this.slimeControl.rewind();
     },
     delay: 100,
     callbackScope: slime
   });*/
  }

  exit(){

  }

  execute(scene, slime){

  }
}

 class Alarm extends Phaser.GameObjects.GameObject{
  constructor(config){
    super(config.scene, config.enemy, config.x, config.y);
    config.scene.alarms.add(this);
    this.scene = config.scene;
    this.enemy = config.enemy;
    this.x = config.x;
    this.y = config.y;

  }

  update(player){
    if (this.x - 500 < player.x && this.x + 500 > player.x ){
      if(this.y + 500 > player.y && this.y - 500 < player.y){
        this.enemy.setActive(true);
        this.enemy.clearTint();

      }
    }

  }

}
