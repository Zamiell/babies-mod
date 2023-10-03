import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Random rocks. */
export class RaccoonBaby extends Baby {
  /** There are no rocks on The Chest and Home. */
  override isValid(): boolean {
    return !onStage(LevelStage.DARK_ROOM_CHEST) && !onStage(LevelStage.HOME);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();
    const isFirstVisit = room.IsFirstVisit();

    // Reroll all of the rocks in the room. This does not work if we do it in the `POST_NEW_ROOM`
    // callback. This does not work if we do it on the 0th frame.
    if (roomFrameCount === 1 && isFirstVisit) {
      useActiveItemTemp(player, CollectibleType.D12);
    }
  }
}
