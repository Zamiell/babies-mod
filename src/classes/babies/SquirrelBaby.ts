import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** This cannot be in a `num` property since it would grant that many walnuts. */
const NUM_COLLECTIBLES = 5;

/** Starts with Walnut (improved). */
export class SquirrelBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_TRINKET_BREAK, TrinketType.WALNUT)
  postTrinketBreakWalnut(player: EntityPlayer): void {
    const room = game.GetRoom();

    repeat(NUM_COLLECTIBLES, () => {
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    });
  }
}
