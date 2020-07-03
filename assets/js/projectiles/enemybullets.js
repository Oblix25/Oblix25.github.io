
export default class Bite extends Phaser.GameObjects.Sprite
{
  constructor(config)
  {
    super(config.scene, config.damage);

    let scene = config.scene;
    let damage = config.damage;




    this.damage = damage;


    this.x = -100;
    this.y = -100;
    this.setTexture("hit");
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setAllowGravity(false);
    scene.enemyBullets.add(this);
    scene.physics.add.overlap(this, scene.player.player, (bite, player) => bite.hit(player));


  }


  //physics body is moved in front of enemy
  swing(config)             //should contain: confing x, y, goLeft, scene
  {


    if(this.active == true){

      this.y = config.y;

      if (!config.goLeft) {
        this.x = config.x + 40;
       this.body.velocity.x = 1000;
     }else{
       this.x = config.x - 40;
       this.body.velocity.x = -1000;
     }


     config.scene.time.delayedCall(50, ()=> {this.die()} );
    }

  }

  //collision detected
  //damage is calulated as
  hit(enemy)
  {
    enemy.hurt(this.damage);
    this.die();
  }

  die()
  {
    if(this.active == true){
      this.x = -100;
      this.y = -100;
      this.body.velocity.x = 0;
    }

  }



}
