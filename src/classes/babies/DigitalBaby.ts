import { ModCallback, SeedEffect } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** B00B T00B. */
export class DigitalBaby extends Baby {
  override onRemove(): void {
    const seeds = game.GetSeeds();
    seeds.RemoveSeedEffect(SeedEffect.OLD_TV); // B00B T00B
  }

  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();
    const seeds = game.GetSeeds();

    if (!g.run.babyBool && roomFrameCount <= 1) {
      g.run.babyBool = true;

      // This baby grants SeedEffect.OLD_TV. However, applying this in the `POST_NEW_LEVEL` callback
      // can cause game crashes. Instead, we manually apply it in the `POST_UPDATE` callback.
      seeds.AddSeedEffect(SeedEffect.OLD_TV);
    }
  }
}
