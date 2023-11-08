import {
  EntityType,
  GridEntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GAME_FRAMES_PER_SECOND,
  ModCallbackCustom,
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

  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(
    tear: EntityTear,
    collider: Entity,
    _low: boolean,
  ): boolean | undefined {
    if (collider.Type !== EntityType.FIREPLACE) {
      return undefined;
    }

    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.delete(ptrHash);
    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_COLLISION,
    GridEntityType.POOP,
    undefined,
    EntityType.TEAR,
  )
  postGridEntityCollisionPoop(_gridEntity: GridEntity, entity: Entity): void {
    const ptrHash = GetPtrHash(entity);
    v.room.tearPtrHashes.delete(ptrHash);
  }
}
