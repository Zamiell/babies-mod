import { RoomType } from "isaac-typescript-definitions";
import { levelHasRoomType } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with 99 cents. */
export class RichBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP);
  }

  override onAdd(player: EntityPlayer): void {
    const numCoins = player.GetNumCoins();

    g.run.babyCounters = numCoins;
    player.AddCoins(99);
  }

  override onRemove(player: EntityPlayer, oldBabyCounters: int): void {
    const numCoins = player.GetNumCoins();
    const oldNumCoins = oldBabyCounters;
    const difference = oldNumCoins - numCoins;

    if (difference < 0) {
      player.AddCoins(difference);
    }
  }
}
