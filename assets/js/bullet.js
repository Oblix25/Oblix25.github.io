// toDO: fill super() with what's contained in config (and, add sounds, low effort shot blast on spawn)

export class Edge extends Phaser.GameObjects.Sprite
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
    enemy.hurt(1);
    this.die();
  }

  die()
  {
    this.x = this.start.x;
    this.y = this.start.y;
  }



}


export class Pick extends Phaser.GameObjects.Sprite
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


export class Bullet extends Phaser.GameObjects.Sprite

{

  constructor(scene)
    {
      super(scene);
      this.setTexture('bullet');


      var sizeX = 40;
      var sizeY = 40;

      this.speed = 2;
      this.damage = 1;

      this.born = 0;
      this.direction = 0;
      this.xSpeed = 0;
      this.ySpeed = 0;

      this.sprite.setSize(sizeX, sizeY, true);
      this.sprite.setDisplaySize(sizeX, sizeY);
      this.scene.physics.world.enable(this);
      this.scene.physics.add.existing(this);

    }


      freeze()
      {
       this.body.moves = false;
      }

      hit()
     {
      this.die();
     }

     die()
     {
       this.sprite.setPosition(-600);
       this.destroy;
     }

     fire(shooter, target)
     {

       if (!target) return;

      this.setActive(true).setVisible(true);

       this.sprite.setPosition(shooter.sprite.x, shooter.sprite.y);

      this.direction = Math.atan( (target.x-this.sprite.x) / (target.y-this.sprite.y));
      this.sprite.rotation = shooter.sprite.rotation; // angle bullet with shooters rotation

       // Calculate X and y velocity of bullet to moves it from shooter to target
       if (target.y >= this.sprite.y)
         {
           this.xSpeed = this.speed*Math.sin(this.direction);
           this.ySpeed = this.speed*Math.cos(this.direction);
       }
         else
       {
           this.xSpeed = -this.speed*Math.sin(this.direction);
           this.ySpeed = -this.speed*Math.cos(this.direction);

           this.born = 0; // Time since new bullet spawned
         }
    }

     update(time,delta)
     {

       if (!this.active)
       {
         this.destroy;
         return;
       }

//  this.scene.physics.world.collide( this.scene.midGround, this.sprite, () => {this.die();console.log("thumpa")});

       this.sprite.x += this.xSpeed * delta;
           this.sprite.y += this.ySpeed * delta;
           this.born += delta;



           if (this.born > 2000)
           {
               this.setActive(false).setVisible(false);
               this.destroy;
               this.born = 0;
           }

     }

}
