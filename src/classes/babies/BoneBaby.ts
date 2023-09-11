import {
  CollectibleType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, hasCollectible, newRNG, onStage } from "isaacscript-common";
import { revealRandomRoom, setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Reveals a random room on room clear. */
export class BoneBaby extends Baby {
  v = v;

  /**
   * - If the player has mapping, this effect is largely useless (but having the Blue Map or Sol is
   *   okay).
   * - We don't want this baby on floors where mapping is useless.
   */
  override isValid(player: EntityPlayer): boolean {
    return (
      !hasCollectible(
        player,
        CollectibleType.COMPASS, // 21
        CollectibleType.TREASURE_MAP, // 54
        CollectibleType.MIND, // 333
      ) &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    revealRandomRoom(v.run.rng);
    return undefined;
  }
}
