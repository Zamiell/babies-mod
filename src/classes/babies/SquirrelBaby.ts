import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  newRNG,
  repeat,
} from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Starts with Walnut (improved). */
export class SquirrelBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_TRINKET_BREAK, TrinketType.WALNUT)
  postTrinketBreakWalnut(player: EntityPlayer): void {
    const room = game.GetRoom();
    const num = this.getAttribute("num");

    repeat(num, () => {
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      mod.spawnCollectible(CollectibleType.NULL, position, v.run.rng);
    });
  }
}
