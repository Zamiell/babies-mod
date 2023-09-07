import { Keyboard, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  GAME_FRAMES_PER_SECOND,
  game,
  getScreenCenterPos,
  isKeyboardPressed,
} from "isaacscript-common";
import { MOD_NAME, VERSION } from "../../constants";
import { BabyModFeature } from "../BabyModFeature";

const v = {
  run: {
    showVersionUntilFrame: null as int | null,
  },
};

export class DrawVersion extends BabyModFeature {
  v = v;

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const isPaused = game.IsPaused();
    if (isPaused) {
      return;
    }

    this.checkVInput();
    this.draw();
  }

  /** Make the baby description persist on the screen after the player presses the "v" key. */
  checkVInput(): void {
    if (isKeyboardPressed(Keyboard.V)) {
      const gameFrameCount = game.GetFrameCount();
      v.run.showVersionUntilFrame = gameFrameCount + 2 * GAME_FRAMES_PER_SECOND;
    }
  }

  draw(): void {
    const gameFrameCount = game.GetFrameCount();

    if (
      v.run.showVersionUntilFrame === null ||
      gameFrameCount > v.run.showVersionUntilFrame
    ) {
      return;
    }

    const centerPos = getScreenCenterPos();
    let text: string;
    let scale: int;
    let x: number;
    let y: number;

    // Render the version of the mod.
    text = MOD_NAME;
    scale = 1;
    x = centerPos.X - 3 * scale * text.length;
    y = centerPos.Y;
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);

    text = VERSION;
    scale = 1;
    x = centerPos.X - 3 * scale * text.length;
    y = centerPos.Y + 15;
    Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);
  }
}
