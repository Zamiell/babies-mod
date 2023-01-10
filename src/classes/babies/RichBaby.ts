import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with 99 cents. */
export class RichBaby extends Baby {
  /** Money is useless past Depths. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage <= (LevelStage.DEPTHS_2 as int);
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
