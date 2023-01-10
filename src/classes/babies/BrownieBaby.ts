import { CollectibleType } from "isaac-typescript-definitions";
import { removeCollectibleFromItemTracker, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Level N Meatboy + Level N Meatgirl. */
export class BrownieBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    for (const collectibleType of [
      CollectibleType.CUBE_OF_MEAT,
      CollectibleType.BALL_OF_BANDAGES,
    ]) {
      repeat(num, () => {
        player.AddCollectible(collectibleType);
        removeCollectibleFromItemTracker(collectibleType);
      });
    }
  }

  override onRemove(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    for (const collectibleType of [
      CollectibleType.CUBE_OF_MEAT,
      CollectibleType.BALL_OF_BANDAGES,
    ]) {
      repeat(num, () => {
        player.RemoveCollectible(collectibleType);
      });
    }
  }
}
