
export default class BootScene extends Phaser.Scene
{
constructor()
{
super({key: 'boot'});
}

preload()
{
this.load.json('assets','assets/json/assets.json');
this.load.image('title','assets/art/title.png');
}

create()
{
 this.scene.start('preloadScene');
}

}
