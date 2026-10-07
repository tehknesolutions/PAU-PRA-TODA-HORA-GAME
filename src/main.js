import Phaser from "phaser";
import {GAME_SETTINGS} from "./game/config.js";
import {BootScene,MenuScene,CharacterSelectScene,FightScene} from "./scenes.js";
new Phaser.Game({type:Phaser.AUTO,parent:"game",width:GAME_SETTINGS.width,height:GAME_SETTINGS.height,backgroundColor:GAME_SETTINGS.backgroundColor,pixelArt:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[BootScene,MenuScene,CharacterSelectScene,FightScene]});
