import { ButtonAction, ModCallback } from "isaac-typescript-definitions";
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
import { getCurrentBaby } from "../../utilsBaby";
import { BabyModFeature } from "../BabyModFeature";

const v = {
  run: {
    showIntroUntilFrame: null as int | null,
  },
};

/** Show what the current baby does in the intro room (or if the player presses the map button). */
export class DrawBabyIntro extends BabyModFeature {
  v = v;

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const currentBaby = getCurrentBaby();
    if (currentBaby === undefined) {
      return;
    }
    const { baby } = currentBaby;

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

    // Render the baby's name.
    text = baby.name;
    x = centerPos.X - 3 * scale * text.length;
    y = centerPos.Y - 130;
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

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    this.setShowIntroFrame();
  }

  setShowIntroFrame(): void {
    const gameFrameCount = game.GetFrameCount();
    v.run.showIntroUntilFrame = gameFrameCount + 2 * GAME_FRAMES_PER_SECOND;
  }
}
