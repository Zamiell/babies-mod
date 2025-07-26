import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Summons Monstro every 5 seconds. */
export class SausageLoverBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    if (
      gameFrameCount % (5 * GAME_FRAMES_PER_SECOND) === 0
      // Monstro will target you if there are no enemies in the room (and this is unavoidable).
      && !roomClear
    ) {
      useActiveItemTemp(player, CollectibleType.MONSTROS_TOOTH);
    }
  }
}
