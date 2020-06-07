import {spawner} from './spawner.js';

function mapChange(scene, mapinput)
{

  if (scene.playerGroup) scene.playerGroup.clear(true, true);

  if (scene.playerAttacks) {
    scene.playerAttacks.clear(true, true);
  }

  if (scene.enemyGroup) {
    scene.enemyGroup.children.entries.forEach( (enemy)=>enemy.clearDebug() );
    scene.enemyGroup.clear(true, true);
  }
  //if (scene.enemyNum) scene.enemyNum = 0;


  if (scene.map) scene.map.removeAllLayers();


  //map
  scene.map = scene.make.tilemap({key: `${mapinput}`, tileWidth: 16, tileHeight: 16 });
  scene.map.name = `${mapinput}`

  scene.tileset = scene.map.addTilesetImage('industrial.v2','tiles');

  scene.backGround = scene.map
  .createStaticLayer("background", scene.tileset,0,0)
  .setAlpha(0.9)
  .setDepth(2);

  scene.midGround = scene.map
  .createDynamicLayer("midground", scene.tileset,0,0)
  .setDepth(8);
  scene.foreGround = scene.map
  .createStaticLayer('foreground', scene.tileset,0,0)
  .setDepth(30);

  scene.midGround.setCollisionByProperty({collides: true});

  //spawn in shit using the newly created map
  spawner(scene.map, scene, scene.midGround)
}


export {mapChange};
