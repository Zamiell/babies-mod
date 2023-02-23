import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns N Blue Spiders on hit. */
export class HostBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    const num = this.getAttribute("num");

    repeat(num, () => {
      // We use a random position so that all of the spiders don't instantly die. (They will
      // over-kill whatever they touch, leaving no spiders left over.)
      const randomPosition = room.GetRandomPosition(0);
      player.AddBlueSpider(randomPosition);
    });

    return undefined;
  }
}
