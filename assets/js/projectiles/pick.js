
export default class Pick extends Phaser.GameObjects.Sprite
{
  constructor(scene, start)
  {
    super(scene,start);

    this.start = start

    this.x = start.x;
    this.y = start.y;
    this.setTexture("pick");
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setAllowGravity(false);
    scene.physics.add.overlap(this, scene.enemyGroup, (pick, enemy) => pick.hit(enemy));
/*
    this.swingTime = new TimerEvent({
      delay: 30,
      callback: function (this.x, this.y) => {
        this.x = start.x;
        this.y = start.y;
      },
      callbackScope: this

    });
*/
  }


  //physics body is moved in front of player
  swing(x, y, goLeft, scene)
  {
    this.y = y;

    if (!goLeft) {
      this.x = x + 40;
     this.velocityX = 200;
   }else{
     this.x = x - 40;
     this.velocityX = -200;
   }

   scene.time.delayedCall(100, ()=> {this.die()} );

  }

  //collision detected
  //damage is calulated as
  hit(enemy)
  {
    let exe = true;
    enemy.hurt(2, exe);
    this.die();
  }

  die()
  {
    this.x = this.start.x;
    this.y = this.start.y;
  }



}
