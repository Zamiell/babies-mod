import {
  DamageFlag,
  DamageFlagZero,
  EffectVariant,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, getEffects } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Spear of Destiny (improved) + flight. */
export class ElfBaby extends Baby {
  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // The Speak of Destiny effect is not yet spawned in the `POST_NEW_ROOM` callback. Thus, we
    // check for it on every frame instead. As an unfortunate side effect, the Spear of Destiny will
    // show as the vanilla graphic during room transitions.
    const spears = getEffects(EffectVariant.SPEAR_OF_DESTINY);
    for (const spear of spears) {
      const sprite = spear.GetSprite();
      const filename = sprite.GetFilename();

      if (filename === "gfx/1000.083_Spear Of Destiny.anm2") {
        sprite.Load("gfx/1000.083_spear of destiny2.anm2", true);
        sprite.Play("Idle", true);
      }
    }
  }

  /**
   * Make the Spear of Destiny do extra damage. (This does not work if we set
   * `effect.CollisionDamage` in the `POST_EFFECT_INIT` callback; the damage appears to be
   * hard-coded.)
   */
  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (g.run.dealingExtraDamage) {
      return undefined;
    }

    if (
      source.Type === EntityType.EFFECT &&
      source.Variant === (EffectVariant.SPEAR_OF_DESTINY as int)
    ) {
      const damage = g.p.Damage * 4;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(g.p),
        countdownFrames,
      );
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  }
}
