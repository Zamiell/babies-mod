import { FamiliarVariant } from "isaac-typescript-definitions";
import { removeAllFamiliars } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Book of Virtues + Unicorn Stump. */
export class LowfaceBaby extends Baby {
  override onRemove(): void {
    removeAllFamiliars(FamiliarVariant.WISP);
  }
}
