import { CollectibleType } from "isaac-typescript-definitions";
import { addCollectible, removeCollectible, repeat } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with N Knife Piece 1 + N Knife Piece 2. */
export class PunkboyBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      addCollectible(
        player,
        CollectibleType.KNIFE_PIECE_1,
        CollectibleType.KNIFE_PIECE_2,
      );
    });
  }

  override onRemove(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    repeat(num, () => {
      removeCollectible(
        player,
        CollectibleType.KNIFE_PIECE_1,
        CollectibleType.KNIFE_PIECE_2,
      );
    });
  }
}
