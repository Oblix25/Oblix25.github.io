
//import CylinderChan from "./cylinderChan.js";
import BootScene from "./bootscene.js";
import PreloadScene from "./preloadscene.js";
import {spawner} from './spawner.js';
import BattleScene from './battlescene.js';


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y:800},
        debug: true,
        fps: 60
      }
    },
    scene:
        [BootScene, PreloadScene, BattleScene],
    extend: {
      time: 0
    }


};


window.addEventListener('load', ()=>
{
    window.game = new Phaser.Game(config);
});
