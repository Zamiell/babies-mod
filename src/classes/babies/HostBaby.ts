import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns 10 Blue Spiders on hit. */
export class HostBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  private entityTakeDmgPlayer(entity: Entity): boolean | undefined {
    const num = this.getAttribute("num");

    const player = entity.ToPlayer();
    if (player === undefined) {
      return;
    }

    repeat(num, () => {
      // We use a random position so that all of the spiders don't instantly die. (They will
      // over-kill whatever they touch, leaving no spiders left over.)
      const randomPosition = g.r.GetRandomPosition(0);
      player.AddBlueSpider(randomPosition);
    });

    return undefined;
  }
}
