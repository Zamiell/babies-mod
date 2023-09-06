import { DamageFlagZero } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  isShootActionPressed,
  ModCallbackCustom,
} from "isaacscript-common";
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
