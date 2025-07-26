import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import { hasCollectible, newRNG, onStage, repeat } from "isaacscript-common";
import { revealRandomRoom, setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },

  level: {
    explored: false,
  },
};

/** N rooms are already explored. */
export class EarwigBaby extends Baby {
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
      )
      && !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(): void {
    const num = this.getAttribute("num");

    setInitialBabyRNG(v.run.rng);
    repeat(num, () => {
      revealRandomRoom(v.run.rng);
    });
  }
}
