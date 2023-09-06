import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandom,
  newRNG,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
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
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_BROKEN)
  postGridEntityBroken(): void {
    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    const chance = getRandom(v.run.rng);
    if (chance < num) {
      useActiveItemTemp(player, CollectibleType.TELEPORT);
    }
  }
}
