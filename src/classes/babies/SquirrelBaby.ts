import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Starts with Walnut (improved). */
export class SquirrelBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_TRINKET_BREAK, TrinketType.WALNUT)
  postTrinketBreakWalnut(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    });
  }
}
