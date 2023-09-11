import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numBombs: 0,
  },
};

/** Spending bombs uses up keys first. */
export class TwotoneBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    const keys = player.GetNumKeys();
    return keys > 0;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const oldBombs = v.run.numBombs;
    const newBombs = player.GetNumBombs();
    v.run.numBombs = newBombs;

    const keys = player.GetNumKeys();

    if (newBombs < oldBombs && keys > 0) {
      player.AddBombs(1);
      player.AddKeys(-1);
    }
  }
}
