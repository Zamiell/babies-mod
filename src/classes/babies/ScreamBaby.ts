import {
  CollectibleType,
  EntityType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  game,
  getPlayerFromEntity,
  ModCallbackCustom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shoop tears. */
export class ScreamBaby extends Baby {
  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.SHOOP_DA_WHOOP)
  postUseItemShoopDaWhoop(
    _collectibleType: CollectibleType,
    _RNG: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();

    g.run.babyFrame = gameFrameCount;
    g.run.babyCounters = activeCharge;
    g.run.babyNPC.entityType = batteryCharge as EntityType;

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();
    useActiveItemTemp(player, CollectibleType.SHOOP_DA_WHOOP);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();

    // - We store the main charge in the "babyCounters" variable.
    // - We store the Battery charge in the "babyNPC.entityType" variable.
    if (
      g.run.babyFrame !== 0 &&
      gameFrameCount <= g.run.babyFrame + 1 &&
      (activeCharge !== g.run.babyCounters ||
        batteryCharge !== (g.run.babyNPC.entityType as int))
    ) {
      player.SetActiveCharge(
        g.run.babyCounters + (g.run.babyNPC.entityType as int),
      );
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      sfxManager.Stop(SoundEffect.BEEP);
    }
  }
}
