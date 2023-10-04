import { DamageFlagZero, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  hasCollectible,
  isShootActionPressed,
} from "isaacscript-common";
import { COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS } from "../../constantsCollectibleTypes";
import { timerDraw } from "../../timer";
import { Baby } from "../Baby";

const v = {
  run: {
    timer: 0,
  },
};

/** Takes damage if shooting when the timer reaches 0. */
export class NooseBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS,
    );
  }

  override onAdd(): void {
    this.resetTimer();
  }

  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    timerDraw(v.run.timer);
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
