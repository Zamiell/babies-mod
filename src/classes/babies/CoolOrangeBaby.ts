import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  GAME_FRAMES_PER_SECOND,
  getEffects,
  spawnEffect,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../types/EffectVariantCustom";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Summons random missiles. */
export class CoolOrangeBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    everyNSeconds(() => {
      const position = Isaac.GetRandomPosition();
      const target = spawnEffect(
        EffectVariantCustom.FETUS_BOSS_TARGET,
        0,
        position,
      );
      const sprite = target.GetSprite();
      sprite.Play("Blink", true);
    }, 1);
  }

  // 55
  @Callback(
    ModCallback.POST_EFFECT_UPDATE,
    EffectVariantCustom.FETUS_BOSS_TARGET,
  )
  postEffectUpdateFetusBossTarget(effect: EntityEffect): void {
    const num = this.getAttribute("num");

    if (effect.FrameCount === num * GAME_FRAMES_PER_SECOND) {
      const rocket = spawnEffect(
        EffectVariantCustom.FETUS_BOSS_ROCKET,
        0,
        effect.Position,
      );
      const rocketHeightOffset = Vector(0, -300);
      rocket.SpriteOffset = rocket.SpriteOffset.add(rocketHeightOffset);
    }
  }

  // 55
  @Callback(
    ModCallback.POST_EFFECT_UPDATE,
    EffectVariantCustom.FETUS_BOSS_ROCKET,
  )
  postEffectUpdateFetusBossRocket(effect: EntityEffect): void {
    const rocketFallSpeed = Vector(0, 30);
    effect.SpriteOffset = effect.SpriteOffset.add(rocketFallSpeed);
    if (effect.SpriteOffset.Y >= 0) {
      Isaac.Explode(effect.Position, undefined, 50); // 49 deals 1 half heart of damage.
      effect.Remove();
      const targets = getEffects(EffectVariantCustom.FETUS_BOSS_TARGET);
      const target = targets[0];
      if (target !== undefined) {
        target.Remove();
      }
    }
  }
}
