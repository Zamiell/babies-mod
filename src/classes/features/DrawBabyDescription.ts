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
  isAfterGameFrame,
  onGameFrame,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { config } from "../../modConfigMenu";
import { BABIES } from "../../objects/babies";
import { isRacingPlusEnabled } from "../../utils";
import { BabyModFeature } from "../BabyModFeature";
import { getBabyType } from "./babySelection/v";

const DESCRIPTION_GAME_FRAME_LENGTH = 2 * GAME_FRAMES_PER_SECOND;

const v = {
  run: {
    showDescriptionUntilFrame: null as int | null,

    /**
     * Needed because the `POST_NEW_LEVEL_REORDERED` callback fires before the
     * `POST_NEW_ROOM_REORDERED` callback.
     */
    setDescriptionFrame: null as int | null,
  },
};

/**
 * Show what the current baby does in the starting room of the floor (or if the player presses the
 * map button).
 */
export class DrawBabyDescription extends BabyModFeature {
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
    if (
      config.showBabyDescriptionOnButtonPress &&
      isActionPressedOnAnyInput(ButtonAction.MAP)
    ) {
      this.setShowDescriptionFrame();
    }
  }

  draw(baby: BabyDescription): void {
    if (
      v.run.showDescriptionUntilFrame === null ||
      isAfterGameFrame(v.run.showDescriptionUntilFrame)
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

  /** We want to draw the baby description text when we arrive at a new floor. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    const player = Isaac.GetPlayer();
    if (
      config.showBabyDescriptionOnNewFloor &&
      // Showing the description would be superfluous if the player has Birthright, since they
      // presumably already know what the effect is.
      !player.HasCollectible(CollectibleType.BIRTHRIGHT)
    ) {
      this.setShowDescriptionFrame();
    }
  }

  /** Clear the description text as soon as we enter another room. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!onGameFrame(v.run.setDescriptionFrame)) {
      v.run.showDescriptionUntilFrame = null;
    }
  }

  setShowDescriptionFrame(): void {
    const gameFrameCount = game.GetFrameCount();
    v.run.showDescriptionUntilFrame =
      gameFrameCount + DESCRIPTION_GAME_FRAME_LENGTH;
    v.run.setDescriptionFrame = gameFrameCount;
  }
}
