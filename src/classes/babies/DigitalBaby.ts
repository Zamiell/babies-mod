import { ModCallback, SeedEffect } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    appliedSeedEffect: false,
  },
};

/** B00B T00B. */
export class DigitalBaby extends Baby {
  v = v;

  override onRemove(): void {
    const seeds = game.GetSeeds();
    seeds.RemoveSeedEffect(SeedEffect.OLD_TV); // B00B T00B
  }

  /**
   * This baby grants SeedEffect.OLD_TV. However, applying this in the `POST_NEW_LEVEL` callback can
   * cause game crashes. Instead, we manually apply it in the `POST_UPDATE` callback.
   */
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();
    const seeds = game.GetSeeds();

    if (!v.run.appliedSeedEffect && roomFrameCount <= 1) {
      v.run.appliedSeedEffect = true;
      seeds.AddSeedEffect(SeedEffect.OLD_TV);
    }
  }
}
