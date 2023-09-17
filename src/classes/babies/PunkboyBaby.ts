import { CollectibleType } from "isaac-typescript-definitions";
import {
  addCollectible,
  removeCollectible,
  removeCollectibleFromItemTracker,
  repeat,
} from "isaacscript-common";
import { Baby } from "../Baby";

const COLLECTIBLES = [
  CollectibleType.KNIFE_PIECE_1,
  CollectibleType.KNIFE_PIECE_2,
] as const;

/** Starts with Nx Knife Piece 1 + Nx Knife Piece 2. */
export class PunkboyBaby extends Baby {
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
