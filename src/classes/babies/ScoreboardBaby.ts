import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_MINUTE,
  isSelfDamage,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Dies 1 minute after getting hit. */
export class ScoreboardBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
  ): boolean | undefined {
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

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    if (g.run.babyCounters !== 0) {
      const remainingTime = g.run.babyCounters - gameFrameCount;
      if (remainingTime <= 0) {
        g.run.babyCounters = 0;
        player.Kill();
      }
    }
  }
}
