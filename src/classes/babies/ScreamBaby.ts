import {
  CollectibleType,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getPlayerFromEntity,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    frameShoopUsed: null as int | null,
    activeItemCharge: null as int | null,
    activeItemBatteryCharge: null as int | null,
  },
};

/** Shoop tears. */
export class ScreamBaby extends Baby {
  v = v;

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

    v.run.frameShoopUsed = gameFrameCount;
    v.run.activeItemCharge = activeCharge;
    v.run.activeItemBatteryCharge = batteryCharge;

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
    if (
      v.run.frameShoopUsed === null ||
      v.run.activeItemCharge === null ||
      v.run.activeItemBatteryCharge === null
    ) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();

    if (
      gameFrameCount <= v.run.frameShoopUsed + 1 &&
      (activeCharge !== v.run.activeItemCharge ||
        batteryCharge !== v.run.activeItemBatteryCharge)
    ) {
      const totalCharge =
        v.run.activeItemCharge + v.run.activeItemBatteryCharge;
      player.SetActiveCharge(totalCharge);
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      sfxManager.Stop(SoundEffect.BEEP);
    }
  }
}
