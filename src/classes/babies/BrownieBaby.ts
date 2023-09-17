import { CollectibleType } from "isaac-typescript-definitions";
import {
  addCollectible,
  removeCollectible,
  removeCollectibleFromItemTracker,
  repeat,
} from "isaacscript-common";
import { Baby } from "../Baby";

const COLLECTIBLES = [
  CollectibleType.CUBE_OF_MEAT,
  CollectibleType.BALL_OF_BANDAGES,
] as const;

/** Starts with Level N Meatboy + Level N Meatgirl. */
export class BrownieBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      addCollectible(player, ...COLLECTIBLES);
      removeCollectibleFromItemTracker(...COLLECTIBLES);
    });
  }

  override onRemove(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      removeCollectible(player, ...COLLECTIBLES);
    });
  }
}
