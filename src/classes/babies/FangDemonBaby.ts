import {
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  EffectVariant,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const SOFTLOCK_COLLECTIBLE_TYPES = [
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.TECH_X, // 395
] as const;

/** Directed light beams */
export class FangDemonBaby extends Baby {
  /** Some collectibles will cause a softlock, so we remove them from all pools as a quick fix. */
  override onAdd(): void {
    for (const collectibleType of SOFTLOCK_COLLECTIBLE_TYPES) {
      g.itemPool.RemoveCollectible(collectibleType);
    }
  }

  /**
   * Make the light beam damage be based on the player's damage. (Normally, light beams do 2 damage
   * on every tick and are not based on the player's damage.)
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
      source.Variant === (EffectVariant.CRACK_THE_SKY as int)
    ) {
      const damage = g.p.Damage;
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
