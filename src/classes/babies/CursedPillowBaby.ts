import {
  DamageFlagZero,
  EntityType,
  GridEntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  isMissedTear,
} from "isaacscript-common";
import {
  getBabyPlayerFromEntity,
  isValidForMissedTearsEffect,
} from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numTearMisses: 0,
  },

  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Every Nth missed tear causes damage. */
export class CursedPillowBaby extends Baby {
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

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (!isMissedTear(tear)) {
      return;
    }

    const num = this.getAttribute("num");

    v.run.numTearMisses++;
    if (v.run.numTearMisses === num) {
      v.run.numTearMisses = 0;
      player.TakeDamage(1, DamageFlagZero, EntityRef(player), 0);
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
