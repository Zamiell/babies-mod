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

  override onAdd(): void {
    const numCoins = g.p.GetNumCoins();

    g.run.babyCounters = numCoins;
    g.p.AddCoins(99);
  }

  override onRemove(oldBabyCounters: int): void {
    const numCoins = g.p.GetNumCoins();
    const oldNumCoins = oldBabyCounters;
    const difference = oldNumCoins - numCoins;

    if (difference < 0) {
      g.p.AddCoins(difference);
    }
  }
}
