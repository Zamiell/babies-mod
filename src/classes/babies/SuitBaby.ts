import {
  EntityType,
  FireplaceVariant,
  GridEntityType,
  GridEntityXMLType,
  ItemPoolType,
  LevelStage,
  ModCallback,
  StatueVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getCollectibleDevilHeartPrice,
  newRNG,
  onFirstFloor,
  onStageOrLower,
  spawnGridEntityWithVariant,
  spawnWithSeed,
} from "isaacscript-common";
import { mod } from "../../mod";
import { shouldTransformRoomType } from "../../utils";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const COLLECTIBLE_GRID_INDEX = 82;
const FIRE_GRID_INDEXES = [34, 40] as const;

/** All special rooms are Devil Rooms. */
export class SuitBaby extends Baby {
  /**
   * Should only be valid if the floor has special rooms. Additionally, we don't want this to
   * interfere with resetting for an item.
   */
  override isValid(): boolean {
    return onStageOrLower(LevelStage.SHEOL_CATHEDRAL) && !onFirstFloor();
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
    const player = Isaac.GetPlayer();

    if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
      return;
    }

    const rng = newRNG(roomSeed);
    const collectibleType = getRandomCollectibleTypeFromPool(
      ItemPoolType.DEVIL,
      rng,
    );
    const collectible = mod.spawnCollectible(
      collectibleType,
      COLLECTIBLE_GRID_INDEX,
      rng,
    );
    collectible.Price = getCollectibleDevilHeartPrice(collectibleType, player);
    collectible.ShopItemId = -2;

    // Spawn the Devil Statue.
    const oneTileAboveCenterGridIndex = 52;
    spawnGridEntityWithVariant(
      GridEntityType.STATUE,
      StatueVariant.DEVIL,
      oneTileAboveCenterGridIndex,
    );

    // Spawn the fires.
    for (const gridIndex of FIRE_GRID_INDEXES) {
      spawnWithSeed(
        EntityType.FIREPLACE,
        FireplaceVariant.NORMAL,
        0,
        gridIndex,
        rng,
      );
    }
  }
}
