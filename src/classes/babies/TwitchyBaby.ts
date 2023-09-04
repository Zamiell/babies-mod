import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

const MIN_FIRE_DELAY_MODIFIER = -4;
const MAX_FIRE_DELAY_MODIFIER = 4;

const v = {
  run: {
    fireDelayIncreasing: false,
    fireDelayModifier: 0,
  },
};

/** Tear rate oscillates per room. */
export class TwitchyBaby extends Baby {
  v = v;

  /** Start with the default tears. */
  override onAdd(): void {
    v.run.fireDelayIncreasing = false;

    // This will tick to 0 in the starting room and then to -1 in the first battle room (which
    // corresponds to the tear stat increasing for the first time in the first battle room).
    v.run.fireDelayModifier = 1;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();

    if (v.run.fireDelayIncreasing) {
      v.run.fireDelayModifier++;
      if (v.run.fireDelayModifier >= MAX_FIRE_DELAY_MODIFIER) {
        v.run.fireDelayIncreasing = false;
      }
    } else {
      v.run.fireDelayModifier--;
      if (v.run.fireDelayModifier <= MIN_FIRE_DELAY_MODIFIER) {
        v.run.fireDelayIncreasing = true;
      }
    }

    player.AddCacheFlags(CacheFlag.FIRE_DELAY);
    player.EvaluateItems();
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay += v.run.fireDelayModifier;
  }
}
