import { DamageFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  GAME_FRAMES_PER_MINUTE,
  isFirstPlayer,
  isSelfDamage,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Dies 1 minute after getting hit. */
export class ScoreboardBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      const remainingTime = g.run.babyCounters - gameFrameCount;
      if (remainingTime <= 0) {
        g.run.babyCounters = 0;
        g.p.Kill();
      }
    }
  }

  // 11
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
  ): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      return;
    }

    if (isSelfDamage(damageFlags)) {
      return;
    }

    g.run.babyCounters = gameFrameCount + GAME_FRAMES_PER_MINUTE;

    return undefined;
  }
}
