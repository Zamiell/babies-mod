import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Sad Bombs + infinite bombs + blindfolded. */
export class RageBaby extends Baby {
  override isValid(): boolean {
    const bombs = g.p.GetNumBombs();
    return bombs < 50;
  }

  override onAdd(): void {
    const numBombs = g.p.GetNumBombs();

    g.run.babyCounters = numBombs; // Store the bomb count so that we can restore it later.
    g.p.AddBombs(99);
  }

  /** Restore the bomb count to what it was before we got this baby. */
  override onRemove(oldBabyCounters: int): void {
    g.p.AddBombs(-99);
    g.p.AddBombs(oldBabyCounters);
  }

  /** Infinite bombs. */
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    g.p.AddBombs(1);
  }
}
