export default class Edge extends Phaser.GameObjects.Sprite
{
  constructor(scene, start)
  {
    super(scene,start);

    this.start = start

    this.x = start.x;
    this.y = start.y;
    this.setTexture("hit");
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setAllowGravity(false);
    scene.physics.add.overlap(this, scene.enemyGroup, (edge, enemy) => edge.hit(enemy));
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
  swing(x, y, goLeft, scene, direction )
  {
    this.y = y;

    if (!goLeft) {
      this.x = x + 40;
     this.body.velocity.x = 1000;
   }else{
     this.x = x - 40;
     this.body.velocity.x = -1000;
   }

  //check if there is tilt and modify xy accordingly/

    if(direction){

      if(direction == "down"){
        this.y = y + 30;
      }else{
        this.y = y - 30;
      }
    }

   scene.time.delayedCall(50, ()=> {this.die()} );

  }

  //collision detected
  //damage is calulated as
  hit(enemy)
  {
    enemy.hurt(1);
    this.die();
  }

  die()
  {
    this.x = this.start.x;
    this.y = this.start.y;
  }



}
