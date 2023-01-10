import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Rocket in a Jar + infinite bombs + blindfolded. */
export class BulletBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    const numBombs = player.GetNumBombs();

    g.run.babyCounters = numBombs; // Store the bomb count so that we can restore it later.
    player.AddBombs(99);
  }

  /** Restore the bomb count to what it was before we got this baby. */
  override onRemove(player: EntityPlayer, oldBabyCounters: number): void {
    player.AddBombs(-99);
    player.AddBombs(oldBabyCounters);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    player.AddBombs(1);
  }
}
