import { FamiliarVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../../globals";
import { Baby } from "../../Baby";

const NEW_FAMILIAR_ANM2 = "gfx/003.089_censer_invisible.anm2";

/** Censer aura. */
export class Seraphim extends Baby {
  @Callback(ModCallback.POST_FAMILIAR_UPDATE, FamiliarVariant.CENSER)
  postFamiliarUpdateCenser(familiar: EntityFamiliar): void {
    familiar.Position = g.p.Position;

    const sprite = familiar.GetSprite();
    const filename = sprite.GetFilename();
    if (filename !== NEW_FAMILIAR_ANM2) {
      sprite.Load(NEW_FAMILIAR_ANM2, true);
      sprite.Play("Idle", true);
    }
  }
}
