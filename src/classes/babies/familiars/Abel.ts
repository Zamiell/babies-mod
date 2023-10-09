import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  GAME_FRAMES_PER_SECOND,
  isMissedTear,
} from "isaacscript-common";
import { isValidForMissedTearsEffect } from "../../../utils";
import { Baby } from "../../Baby";

const FREEZE_GAME_FRAMES = 2 * GAME_FRAMES_PER_SECOND;

const v = {
  run: {
    numMissedTears: 0,
  },

  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Every Nth missed tear causes 2 seconds of paralysis. */
export class Abel extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return isValidForMissedTearsEffect(player);
  }

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    if (!isMissedTear(tear)) {
      return;
    }

    const player = Isaac.GetPlayer();
    const num = this.getAttribute("num");

    // The baby effect only applies to the Nth missed tear.
    v.run.numMissedTears++;
    if (v.run.numMissedTears === num) {
      v.run.numMissedTears = 0;

      player.AnimateSad();
      player.AddControlsCooldown(FREEZE_GAME_FRAMES);
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }
}
