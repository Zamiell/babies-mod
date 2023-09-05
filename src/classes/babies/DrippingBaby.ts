import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandom,
  newRNG,
  onStage,
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

  /** Only valid on floors with rocks. */
  override isValid(): boolean {
    return !onStage(
      LevelStage.BLUE_WOMB,
      LevelStage.DARK_ROOM_CHEST,
      LevelStage.HOME,
    );
  }

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
