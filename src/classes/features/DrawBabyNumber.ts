import {
  ModCallback,
  RoomType,
  SeedEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  KColorDefault,
  fonts,
  game,
  getHUDOffsetVector,
  getHeartsUIWidth,
  inRoomType,
} from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { config } from "../../modConfigMenu";
import { isRacingPlusEnabled } from "../../utils";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const UI_HEARTS_RIGHT_SPACING = 55;

/** Draw the baby's number next to the heart count. */
export class DrawBabyNumber extends BabyModFeature {
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const babyType = getBabyType();
    if (babyType !== undefined) {
      this.draw(babyType);
    }
  }

  draw(babyType: RandomBabyType): void {
    if (!config.showBabyNumber) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // The `HUD.IsVisible` method does not take into account `SeedEffect.NO_HUD`.
    const seeds = game.GetSeeds();
    if (seeds.HasSeedEffect(SeedEffect.NO_HUD)) {
      return;
    }

    const HUDOffsetVector = getHUDOffsetVector();
    const heartsUIWidth = getHeartsUIWidth();

    // Racing+ draws the number of sacrifices in the top left corner, which interferes with the baby
    // number text.
    if (isRacingPlusEnabled() && inRoomType(RoomType.SACRIFICE)) {
      return;
    }

    const text = `#${babyType}`;

    let x = HUDOffsetVector.X + heartsUIWidth + UI_HEARTS_RIGHT_SPACING;
    if (
      babyType === RandomBabyType.HOPELESS || // 125
      babyType === RandomBabyType.MOHAWK // 138
    ) {
      // These babies draw text next to the hearts, so account for this so that the number text does
      // not overlap.
      x += 20;
    }

    const y = 10;

    fonts.droid.DrawString(text, x, y, KColorDefault, 0, true);
  }
}
