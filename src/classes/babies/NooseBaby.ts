import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  isShootActionPressed,
} from "isaacscript-common";
import { drawTimer } from "../../timer";
import { Baby } from "../Baby";

const v = {
  run: {
    timer: 0,
  },
};

/** Takes damage if shooting when the timer reaches 0. */
export class NooseBaby extends Baby {
  v = v;

  override onAdd(): void {
    this.resetTimer();
  }

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    drawTimer(v.run.timer);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    const remainingGameFrames = v.run.timer - gameFrameCount;
    if (remainingGameFrames > 0) {
      return;
    }

    this.resetTimer();

    if (isShootActionPressed(player.ControllerIndex)) {
      player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
    }
  }

  resetTimer(): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    v.run.timer = gameFrameCount + num;
  }
}
