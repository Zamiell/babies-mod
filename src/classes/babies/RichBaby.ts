import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType, onFirstFloor } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    originalNumCoins: 0,
  },
};

/** Starts with 99 cents. */
export class RichBaby extends Baby {
  v = v;

  /** We don't want this baby to interfere with resetting (since they could start a shop item). */
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP) && !onFirstFloor();
  }

  override onAdd(player: EntityPlayer): void {
    v.run.originalNumCoins = player.GetNumCoins();
    player.AddCoins(99);
  }

  override onRemove(player: EntityPlayer): void {
    const numCoins = player.GetNumCoins();
    const difference = v.run.originalNumCoins - numCoins;

    if (difference < 0) {
      player.AddCoins(difference);
    }
  }
}
