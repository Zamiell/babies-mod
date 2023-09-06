import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CollectibleType,
  DamageFlagZero,
  EffectVariant,
  EntityPartition,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  VectorZero,
  game,
  hasCollectible,
  spawnEffect,
} from "isaacscript-common";
import { Baby } from "../Baby";

const SOFTLOCK_COLLECTIBLE_TYPES = [
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.TECH_X, // 395

  // Crack the Sky does not cause a softlock, but we remove it since the beam effect would overlap.
  CollectibleType.CRACK_THE_SKY, // 160

  // White Pony does not cause a softlock, but we remove it since the beam effect would overlap.
  CollectibleType.WHITE_PONY, // 181

  // Eye of the Occult does not cause a softlock, but we remove it since it changes the effect
  // variant of the target.
  CollectibleType.EYE_OF_THE_OCCULT, // 572
] as const;

const TARGET_DAMAGE_RADIUS = 30;

const v = {
  run: {
    dealingExtraDamage: false,
  },

  room: {
    cooldownUntilFrame: 0,
  },
};

/** Directed light beams */
export class FangDemonBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...SOFTLOCK_COLLECTIBLE_TYPES);
  }

  /** Some collectibles will cause a softlock, so we remove them from all pools as a quick fix. */
  override onAdd(): void {
    const itemPool = game.GetItemPool();

    for (const collectibleType of SOFTLOCK_COLLECTIBLE_TYPES) {
      itemPool.RemoveCollectible(collectibleType);
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
    if (v.run.dealingExtraDamage) {
      return undefined;
    }

    if (
      source.Type === EntityType.EFFECT &&
      source.Variant === (EffectVariant.CRACK_THE_SKY as int)
    ) {
      const player = Isaac.GetPlayer();
      const damage = player.Damage;
      v.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(player),
        countdownFrames,
      );
      v.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  }

  /**
   * By default, the Marked target spawns at the center of the room, and we want it to be spawned at
   * the player instead. If we change the position in this callback, it won't work, so make the
   * effect invisible in the meantime.
   */
  // 54
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariant.TARGET)
  postEffectInitTarget(effect: EntityEffect): void {
    effect.Visible = false;
  }

  // 55
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariant.TARGET)
  postEffectUpdateTarget(effect: EntityEffect): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    if (effect.FrameCount === 1) {
      // By default, the Marked target spawns at the center of the room, and we want it to be
      // spawned at the player instead.
      effect.Position = player.Position;
      effect.Visible = true;
      return;
    }

    if (gameFrameCount < v.room.cooldownUntilFrame) {
      return;
    }

    // Check to see if there is a nearby NPC.
    const closeEntities = Isaac.FindInRadius(
      effect.Position,
      TARGET_DAMAGE_RADIUS,
      EntityPartition.ENEMY,
    );
    if (closeEntities.length > 0) {
      // Fire the beam.
      spawnEffect(
        EffectVariant.CRACK_THE_SKY,
        0,
        effect.Position,
        VectorZero,
        player,
      );
      v.room.cooldownUntilFrame = gameFrameCount + num;
    }
  }
}
