import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Summons a Sprinkler every N seconds. */
export class MutatedFishBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (gameFrameCount % (num * GAME_FRAMES_PER_SECOND) === 0) {
      useActiveItemTemp(player, CollectibleType.SPRINKLER);
    }
  }
}
