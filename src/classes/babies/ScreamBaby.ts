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
  hasCollectible,
  onOrBeforeGameFrame,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const COLLECTIBLES_THAT_DONT_WORK = [
  CollectibleType.INCUBUS, // 360
  CollectibleType.TWISTED_PAIR, // 698
  CollectibleType.SUMPTORIUM, // 713
] as const;

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

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...COLLECTIBLES_THAT_DONT_WORK);
  }

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
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();
    useActiveItemTemp(player, CollectibleType.SHOOP_DA_WHOOP);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (
      v.run.frameShoopUsed === null
      || v.run.activeItemCharge === null
      || v.run.activeItemBatteryCharge === null
    ) {
      return;
    }

    const activeCharge = player.GetActiveCharge();
    const batteryCharge = player.GetBatteryCharge();

    if (
      onOrBeforeGameFrame(v.run.frameShoopUsed + 1)
      && (activeCharge !== v.run.activeItemCharge
        || batteryCharge !== v.run.activeItemBatteryCharge)
    ) {
      const totalCharge =
        v.run.activeItemCharge + v.run.activeItemBatteryCharge;
      player.SetActiveCharge(totalCharge);
      sfxManager.Stop(SoundEffect.BATTERY_CHARGE);
      sfxManager.Stop(SoundEffect.BEEP);
    }
  }
}
