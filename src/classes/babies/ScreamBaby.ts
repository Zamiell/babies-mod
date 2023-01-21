import {
  CollectibleType,
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
import { Baby } from "../Baby";

/** Shoop tears. */
export class ScreamBaby extends Baby {
  v = {
    run: {
      frameShoopUsed: null as int | null,
      activeItemCharge: null as int | null,
      activeItemBatteryCharge: null as int | null,
    },
  };

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

    this.v.run.frameShoopUsed = gameFrameCount;
    this.v.run.activeItemCharge = activeCharge;
    this.v.run.activeItemBatteryCharge = batteryCharge;

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
      this.v.run.frameShoopUsed === null ||
      this.v.run.activeItemCharge === null ||
      this.v.run.activeItemBatteryCharge === null
    ) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();

    if (
      gameFrameCount <= this.v.run.frameShoopUsed + 1 &&
      (activeCharge !== this.v.run.activeItemCharge ||
        batteryCharge !== this.v.run.activeItemBatteryCharge)
    ) {
      const totalCharge =
        this.v.run.activeItemCharge + this.v.run.activeItemBatteryCharge;
      player.SetActiveCharge(totalCharge);
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      sfxManager.Stop(SoundEffect.BEEP);
    }
  }
}
