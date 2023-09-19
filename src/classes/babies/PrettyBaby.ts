import {
  EntityType,
  FireplaceVariant,
  GridEntityXMLType,
  ItemPoolType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  gridCoordinatesToWorldPosition,
  newRNG,
  onFirstFloor,
  onStageOrLower,
  spawnWithSeed,
} from "isaacscript-common";
import { mod } from "../../mod";
import { shouldTransformRoomType } from "../../utils";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const FIRE_GRID_INDEXES = [34, 40] as const;

/** All special rooms are Angel shops. */
export class PrettyBaby extends Baby {
  /**
   * Should only be valid if the floor has special rooms. Additionally, we don't want this to
   * interfere with resetting for an item.
   */
  override isValid(): boolean {
    return onStageOrLower(LevelStage.SHEOL_CATHEDRAL) && !onFirstFloor();
  }

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(): [EntityType | GridEntityXMLType, int, int] | undefined {
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
    const position = gridCoordinatesToWorldPosition(6, 4);
    const collectible = mod.spawnCollectible(collectibleType, position, rng);
    collectible.AutoUpdatePrice = false;
    collectible.Price = 15;

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
      Isaac.DebugString("GETTING HERE");
    }
  }
}
