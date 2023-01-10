import { CollectibleType } from "isaac-typescript-definitions";
import { removeCollectibleFromItemTracker, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Level N Meatboy + Level N Meatgirl. */
export class BrownieBaby extends Baby {
  override onAdd(): void {
    const num = this.getAttribute("num");

    for (const collectibleType of [
      CollectibleType.CUBE_OF_MEAT,
      CollectibleType.BALL_OF_BANDAGES,
    ]) {
      repeat(num, () => {
        g.p.AddCollectible(collectibleType);
        removeCollectibleFromItemTracker(collectibleType);
      });
    }
  }

  override onRemove(): void {
    const num = this.getAttribute("num");

    for (const collectibleType of [
      CollectibleType.CUBE_OF_MEAT,
      CollectibleType.BALL_OF_BANDAGES,
    ]) {
      repeat(num, () => {
        g.p.RemoveCollectible(collectibleType);
      });
    }
  }
}
