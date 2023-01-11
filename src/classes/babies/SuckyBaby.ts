import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Succubus aura. */
export class SuckyBaby extends Baby {
  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.SUCCUBUS)
  postFamiliarInitSuccubus(familiar: EntityFamiliar): void {
    // Make the Succubus invisible. (Setting "familiar.Visible = false" does not work because it
    // will also make the aura invisible.)
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.096_succubus_invisible.anm2", true);
    sprite.Play("IdleDown", true);
  }

  // 8
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.SUCCUBUS)
  postFamiliarUpdateSuccubus(familiar: EntityFamiliar): void {
    // Keep it locked on the player to emulate a Succubus aura.
    familiar.Position = g.p.Position;
  }
}
