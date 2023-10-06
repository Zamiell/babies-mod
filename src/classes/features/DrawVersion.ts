import { Keyboard, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  ModFeature,
  RENDER_FRAMES_PER_SECOND,
  game,
  getScreenCenterPos,
  isBeforeRenderFrame,
  isKeyboardPressed,
} from "isaacscript-common";
import { MOD_NAME, VERSION } from "../../constants";

const SHOW_VERSION_HOTKEY = Keyboard.F1;
const SECONDS_SHOWN = 2;

const v = {
  run: {
    showVersionUntilRenderFrame: null as int | null,
  },
};

/**
 * We do not extend from `BabyModFeature` since we want to show the version on other characters than
 * Random Baby.
 */
export class DrawVersion extends ModFeature {
  v = v;

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const hud = game.GetHUD();

    if (!hud.IsVisible()) {
      return;
    }

    if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
      return;
    }

    // We do not have to check to see if the game is paused because the text will not be drawn on
    // top of the pause menu.

    this.checkInput();
    this.checkDraw();
  }

  /** Make the version persist on the screen after the player presses the hotkey. */
  checkInput(): void {
    if (isKeyboardPressed(SHOW_VERSION_HOTKEY)) {
      const renderFrameCount = Isaac.GetFrameCount();
      v.run.showVersionUntilRenderFrame =
        renderFrameCount + SECONDS_SHOWN * RENDER_FRAMES_PER_SECOND;
    }
  }

  checkDraw(): void {
    if (
      v.run.showVersionUntilRenderFrame === null ||
      isBeforeRenderFrame(v.run.showVersionUntilRenderFrame)
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
