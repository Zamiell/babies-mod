import {
  ButtonAction,
  CollectibleType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  game,
  getScreenCenterPos,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { isRacingPlusEnabled } from "../../utils";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const v = {
  run: {
    showIntroUntilFrame: null as int | null,

    /**
     * Needed because the `POST_NEW_LEVEL_REORDERED` callback fires before the
     * `POST_NEW_ROOM_REORDERED` callback.
     */
    setIntroFrame: null as int | null,
  },
};

/** Show what the current baby does in the intro room (or if the player presses the map button). */
export class DrawBabyIntro extends BabyModFeature {
  v = v;

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const babyType = getBabyType();
    if (babyType === undefined) {
      return;
    }

    const baby = BABIES[babyType];

    this.checkMapInput();
    this.draw(baby);
  }

  /** Make the baby description persist on the screen after the player presses the map button. */
  checkMapInput(): void {
    if (isActionPressedOnAnyInput(ButtonAction.MAP)) {
      this.setShowIntroFrame();
    }
  }

  draw(baby: BabyDescription): void {
    const gameFrameCount = game.GetFrameCount();
    if (
      v.run.showIntroUntilFrame === null ||
      gameFrameCount > v.run.showIntroUntilFrame
    ) {
      return;
    }

    const centerPos = getScreenCenterPos();
    const scale = 1.75;

    let text: string;
    let x: number;
    let y: number;

    // We do not want the baby description to overlap with the level streak text. The Racing+ streak
    // text is lower on the screen than the vanilla streak text.
    const hasRacingPlusStreakText =
      isRacingPlusEnabled() && VanillaStreakText !== true;
    const yAdjustment = hasRacingPlusStreakText ? 130 : 80;
    const startingY = centerPos.Y - yAdjustment;

    // Render the baby's name.
    text = baby.name;
    x = centerPos.X - 3 * scale * text.length;
    y = startingY;
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);

    // Render the baby's description.
    text = baby.description;
    x = centerPos.X - 3 * text.length;
    y += 25;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);

    // The description might be really long and spill over onto a second line.
    if (baby.description2 !== undefined) {
      text = baby.description2;
      x = centerPos.X - 3 * text.length;
      y += 15;
      Isaac.RenderText(text, x, y, 2, 2, 2, 2);
    }
  }

  /**
   * We want to draw the baby intro text when we arrive at a new floor. But showing it if the player
   * has Birthright would be superfluous, since they presumably already know what the effect is.
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    const player = Isaac.GetPlayer();
    if (player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
      return;
    }

    this.setShowIntroFrame();
  }

  /** Clear the intro text as soon as we enter another room. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount !== v.run.setIntroFrame) {
      v.run.showIntroUntilFrame = null;
    }
  }

  setShowIntroFrame(): void {
    const gameFrameCount = game.GetFrameCount();
    v.run.showIntroUntilFrame = gameFrameCount + 2 * GAME_FRAMES_PER_SECOND;
    v.run.setIntroFrame = gameFrameCount;
  }
}
