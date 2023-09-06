import {
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { isValidForMissingTearsEffect } from "../../../utils";
import { Baby } from "../../Baby";

const v = {
  run: {
    numMissedTears: 0,
  },

  room: {
    playerTearPtrHashes: new Set<PtrHash>(),
  },
};

/** Every Nth missed tear causes paralysis. */
export class Abel extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return isValidForMissingTearsEffect(player);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.playerTearPtrHashes.has(ptrHash)) {
      return;
    }

    // Tears will not die if they hit an enemy, but they will die if they hit a wall or object.
    if (tear.IsDead()) {
      return;
    }

    const num = this.getAttribute("num");
    const player = Isaac.GetPlayer();

    // The baby effect only applies to the Nth missed tear.
    v.run.numMissedTears++;
    if (v.run.numMissedTears === num) {
      v.run.numMissedTears = 0;
      player.UsePill(PillEffect.PARALYSIS, PillColor.NULL);
      // (We can't cancel the animation or it will cause a bug where the player cannot pick up
      // pedestal items.)
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.playerTearPtrHashes.add(ptrHash);
  }
}
