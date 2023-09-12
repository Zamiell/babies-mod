import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Giant cell effect on room clear. */
export class HiveKingBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.GIANT_CELL);
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): boolean | undefined {
    const player = Isaac.GetPlayer();

    let gaveGiantCell = false;
    if (!player.HasCollectible(CollectibleType.GIANT_CELL)) {
      player.AddCollectible(CollectibleType.GIANT_CELL, 0, false);
      gaveGiantCell = true;
    }

    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);

    // The hurt sound effect is confusing, because we are not actually being damaged.
    sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);

    if (gaveGiantCell) {
      player.RemoveCollectible(CollectibleType.GIANT_CELL);
    }

    return undefined;
  }
}
