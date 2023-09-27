import {
  BossID,
  CollectibleType,
  LevelStage,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandom,
  levelHasBossID,
  newRNG,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const BOSSES_THAT_CAN_BREAK_ROCKS = [
  BossID.BUMBINO,
  BossID.PILE,
  BossID.TUFF_TWINS,
  BossID.SHELL,
  BossID.HORNFEL,
] as const;

const v = {
  run: {
    rng: newRNG(),
  },
};

/** N% chance to teleport from breaking rocks. */
export class DrippingBaby extends Baby {
  v = v;

  /** Only valid on floors with rocks. Not valid with certain problematic bosses. */
  override isValid(): boolean {
    return (
      !onStage(
        LevelStage.BLUE_WOMB,
        LevelStage.DARK_ROOM_CHEST,
        LevelStage.HOME,
      ) && !levelHasBossID(...BOSSES_THAT_CAN_BREAK_ROCKS)
    );
  }

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_BROKEN)
  postGridEntityBroken(): void {
    const player = Isaac.GetPlayer();

    // We do not use the seed of the rock because we want the chances to happen in order for seeded
    // races.
    const teleportChance = getRandom(v.run.rng);
    const num = this.getAttribute("num");

    if (teleportChance < num) {
      useActiveItemTemp(player, CollectibleType.TELEPORT);
    }
  }
}
