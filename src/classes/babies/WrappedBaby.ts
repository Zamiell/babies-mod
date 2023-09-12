import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    numKamikazeEffects: 0,
  },
};

/** Nx Kamikaze effect on hit. */
export class WrappedBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const num = this.getAttribute("num");
    v.room.numKamikazeEffects = num;

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    // If the explosions happen too fast, it looks buggy, so do it instead every 3 frames.
    if (gameFrameCount % 3 === 0 && v.room.numKamikazeEffects > 0) {
      // This should not cause any damage since the player will have invulnerability frames.
      v.room.numKamikazeEffects--;
      useActiveItemTemp(player, CollectibleType.KAMIKAZE);
    }
  }
}
