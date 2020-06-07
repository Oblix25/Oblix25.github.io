


export default class Slime extends Phaser.GameObjects.Sprite
{
  constructor(config)
  {
    super(config.scene, config.x, config.y)
    this.setTexture("slime");
    this.setOrigin(0.5,0.5);

    //this.beenSeen = false;
    this.alive = true;
    this.maxBlood = 239;
    this.blood = 220;
    this.bleeding = false;
    this.cuts = 0;
    this.weak = false;
    this.normSpeed = 50;
    this.runSpeed = 100;


    this.bleedTimerConfig = {

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

    this.bleedTimer = config.scene.time.delayedCall(this.bleedTimerConfig);

    this.bloodCheck = this.scene.add.text(this.x - 50, this.y + -20, 'Blood: '

        ,{
          font: '32px monospace',
          fill: "red",
          padding: {x:5, y:5}
      })
      .setScale(0.4)
      .setDepth(30);


    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    //config.scene.physics.world.collide(this, config.scene.midGround);
  }

  update(time,delta)
  {


    /*
    if(!this.active) {
      return;
    }
*/

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
      this.setTintFill();
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
      this.bloodCheck.setText(['blood: ' + this.blood + "\ncuts: " + this.cuts + "\nbleeding: " + this.bleeding]).setX(this.x - 50).setY(this.y + -70);
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

  eed(damage=1, exe=false)
  {
    if (exe === true && this.weak ===true) this.kill;
    this.cuts = this.cuts + damage;
    this.scene.time.addEvent({delay: 2000, callback: ()=> this.cuts = this.cuts - 1, callbackScope: this});
  }

  leed(damage=1) {

    if(!this.bleeding) this.bleeding = true;

    if(damage === 1){
        this.cuts = this.cuts + 1;
        this.scene.time.addEvent({delay: 500, repeatCount: 4, callback: bloodLoss, callbackScope: this, loop: true});
        this.scene.time.addEvent({delay: 2000, callback: ()=> {this.cuts = this.cuts - 1; this.bleeding = false}, callbackScope: this});

        function bloodLoss() {
          if(this.cuts > 0){
            this.blood = this.blood - 10;
          }
        }
    }
  //  this.scene.time.delayedCall(300, )
  }

  clearDebug(){
    this.bloodCheck.destroy();
  }

  kill() {
      // Forget about this enemy
      this.active = false;
      this.clearDebug();
      //this.scene.enemyGroup.remove(this);
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
