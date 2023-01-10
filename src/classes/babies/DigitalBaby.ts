import { ModCallback, SeedEffect } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** B00B T00B. */
export class DigitalBaby extends Baby {
  override onRemove(): void {
    g.seeds.RemoveSeedEffect(SeedEffect.OLD_TV); // B00B T00B
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const roomFrameCount = g.r.GetFrameCount();

    if (!g.run.babyBool && roomFrameCount <= 1) {
      g.run.babyBool = true;

      // This baby grants SeedEffect.OLD_TV. However, applying this in the `POST_NEW_LEVEL` callback
      // can cause game crashes. Instead, we manually apply it in the `POST_UPDATE` callback.
      g.seeds.AddSeedEffect(SeedEffect.OLD_TV);
    }
  }
}
