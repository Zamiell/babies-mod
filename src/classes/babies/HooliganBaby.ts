import { LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Double enemies. */
export class HooliganBaby extends Baby {
  /**
   * Mom cannot be doubled, so don't give this baby on stage 6. It Lives cannot be doubled, so don't
   * give this baby on stage 8. Furthermore, double enemies would be too hard on the final stages.
   */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return (
      effectiveStage !== LevelStage.DEPTHS_2 &&
      effectiveStage < LevelStage.WOMB_2
    );
  }

  /** Fix the bug where an enemy can sometimes spawn next to where the player spawns. */
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const roomFrameCount = g.r.GetFrameCount();

    if (roomFrameCount === 0) {
      return false;
    }

    return undefined;
  }
}
