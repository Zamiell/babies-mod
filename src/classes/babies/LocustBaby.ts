import { FamiliarVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  removeAllFamiliars,
  repeat,
  spawnFamiliar,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with 20 Abyss Locusts + blindfolded. */
export class LocustBaby extends Baby {
  override onRemove(): void {
    removeAllFamiliars(FamiliarVariant.ABYSS_LOCUST);
  }

  /** This does not work in the `babyAdd` method. */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (g.run.babyBool) {
      return;
    }
    g.run.babyBool = true;

    const num = this.getAttribute("num");

    repeat(num, () => {
      spawnFamiliar(FamiliarVariant.ABYSS_LOCUST, 0, player.Position);
    });
  }
}
