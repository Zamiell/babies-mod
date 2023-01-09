import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  GAME_FRAMES_PER_MINUTE,
  isSelfDamage,
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
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
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
