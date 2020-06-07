import Player from "./player.js";
import Slime from "./enemies/slime.js";
import DumSlime from "./enemies/dumslime.js"
import Pick from "./projectiles/pick.js";
import Edge from "./projectiles/edge.js";
import Javelin from "./projectiles/javelin.js";


function spawner(map, scene)
{

  //let enemyNum = 1;
  //let regName;

  //objects in map are checked by type(assigned in object layer in Tiled) and the appopriate extended sprite is created

    const objects = map.getObjectLayer('stuff'); //find the object layer in the tilemap named 'stuff'


    scene.enemyNum = 1;

    objects.objects.forEach(
     (object) => {

       //create a series of points in our spawnpoints array
       if (object.type === 'player_spawn') {


         scene.player = new Player({
           scene: scene,
           x: object.x,
           y: object.y
         });


          //scene.physics.add.collider(scene.player.player, scene.enemyGroup, ()=> {} );
         scene.playerGroup.add(scene.player.player);

       }

       if (object.type === "enemy") {


         //check the registry to see if the enemy has already been killed. If not create the enemy in the level and register it with the game
         let regName = `_Enemy_${scene.enemyNum}`;
         scene.registry.set(regName, 'active');
         scene.enemyNum += 1;




             if (object.name === 'slime'){


                  let enemy = new Slime({
                  x: object.x,
                  y: object.y,
                  scene: scene
                   });

                 scene.enemyGroup.add(enemy);
                 scene.physics.add.collider(enemy, scene.midGround);
            }

            if (object.name === 'dumslime'){


                 let enemy = new DumSlime({
                 x: object.x,
                 y: object.y,
                 scene: scene
                  });

                scene.enemyGroup.add(enemy);
                scene.physics.add.collider(enemy, scene.midGround);
           }

         }


     });

  //add bullet objects in holding alrea
  scene.holding = new Phaser.Geom.Point(-200,-200);
  scene.edge = new Edge(scene, scene.holding);
  scene.pick = new Pick(scene, scene.holding);

     //add colliders
  scene.physics.add.collider(scene.player.player, scene.midGround, ()=> {scene.player.player.canJump = true});
     //scene.physics.add.collider(scene.playerGroup, scene.midGround, ()=> {scene.player.player.canJump = true});
     //scene.physics.add.collider(scene.enemyGroup, scene.midGround);
}



export {spawner};
