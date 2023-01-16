import {
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
} from "isaacscript-common";
import { g } from "../../globals";
import { isValidRandomBabyPlayer } from "../../utils";
import { Baby } from "../Baby";

/** Starts with A Pony (improved) + blindfolded. */
export class RiderBaby extends Baby {
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

    if (source.Entity === undefined) {
      return undefined;
    }

    const player = source.Entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    if (!isValidRandomBabyPlayer(player)) {
      return undefined;
    }

    const damage = g.p.Damage * 4;
    g.run.dealingExtraDamage = true;
    entity.TakeDamage(damage, DamageFlagZero, EntityRef(g.p), countdownFrames);
    g.run.dealingExtraDamage = false;
    return false;
  }

  /** Keep the pony fully charged. */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const activeItem = player.GetActiveItem();

    if (activeItem === CollectibleType.PONY && player.NeedsCharge()) {
      player.FullCharge();
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
    }
  }
}
