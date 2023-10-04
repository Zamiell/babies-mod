import {
  EntityType,
  FireplaceVariant,
  GridEntityXMLType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  newRNG,
  onFirstFloor,
  spawnWithSeed,
} from "isaacscript-common";
import { mod } from "../../mod";
import { onStageWithSpecialRooms, shouldTransformRoomType } from "../../utils";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const COLLECTIBLE_GRID_INDEX = 82;
const FIRE_GRID_INDEXES = [34, 40] as const;

/** All special rooms are Angel shops. */
export class PrettyBaby extends Baby {
  /** We don't want this to interfere with resetting for an item. */
  override isValid(): boolean {
    return onStageWithSpecialRooms() && !onFirstFloor();
  }

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn():
    | [type: EntityType | GridEntityXMLType, variant: int, subType: int]
    | undefined {
    const room = game.GetRoom();
    const roomType = room.GetType();

    if (shouldTransformRoomType(roomType)) {
      return [GridEntityXMLType.EFFECT, 0, 0];
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const roomType = room.GetType();
    const isFirstVisit = room.IsFirstVisit();
    const roomSeed = room.GetSpawnSeed();

    if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
      return;
    }

    const rng = newRNG(roomSeed);
    const collectibleType = getRandomCollectibleTypeFromPool(
      ItemPoolType.ANGEL,
      rng,
    );
    const collectible = mod.spawnCollectible(
      collectibleType,
      COLLECTIBLE_GRID_INDEX,
      rng,
    );
    collectible.Price = 15;
    collectible.ShopItemId = -1;

    // We deliberately do not spawn an Angel Statue because we do not want them to be able to farm a
    // key piece.

    // Spawn the fires.
    for (const gridIndex of FIRE_GRID_INDEXES) {
      spawnWithSeed(
        EntityType.FIREPLACE,
        FireplaceVariant.BLUE,
        0,
        gridIndex,
        rng,
      );
    }
  }
}
