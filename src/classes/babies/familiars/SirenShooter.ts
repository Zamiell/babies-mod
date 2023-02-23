import { CollectibleType } from "isaac-typescript-definitions";
import { CallbackCustom, game, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

/** Spawns a pedestal item after N hits. */
export class SirenShooter extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    const num = this.getAttribute("num");

    g.run.babyCounters++;
    if (g.run.babyCounters === num) {
      g.run.babyCounters = 0;
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    }

    return undefined;
  }
}
