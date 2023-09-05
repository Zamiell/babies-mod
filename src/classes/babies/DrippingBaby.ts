import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandom,
  newRNG,
  setSeed,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** N% chance to teleport from breaking rocks. */
export class DrippingBaby extends Baby {
  v = v;

  override onAdd(): void {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    setSeed(v.run.rng, seed);
  }

  @CallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_BROKEN)
  postGridEntityBroken(): void {
    const num = this.getAttribute("num");
    const player = Isaac.GetPlayer();

    const chance = getRandom(v.run.rng);
    if (chance < num) {
      useActiveItemTemp(player, CollectibleType.TELEPORT);
    }
  }
}
