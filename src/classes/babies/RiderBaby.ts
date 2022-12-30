import {
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  EntityType,
  ModCallback,
  PlayerVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import { Callback, sfxManager } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with A Pony (improved) + blindfolded. */
export class RiderBaby extends Baby {
  /** Keep the pony fully charged. */
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const activeItem = g.p.GetActiveItem();

    if (activeItem === CollectibleType.PONY && g.p.NeedsCharge()) {
      g.p.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }

  /** Make the Pony do extra damage. */
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
      source.Type === EntityType.PLAYER &&
      source.Variant === (PlayerVariant.PLAYER as int)
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
