import {
  EntityType,
  FireplaceVariant,
  GridEntityType,
  GridEntityXMLType,
  ItemPoolType,
  ModCallback,
  PickupVariant,
  StatueVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  gridCoordinatesToWorldPosition,
  ModCallbackCustom,
  spawnGridEntityWithVariant,
  spawnWithSeed,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import {
  getRandomCollectibleTypeFromPool,
  isRerolledCollectibleBuggedHeart,
  shouldTransformRoomType,
} from "../../utils";
import { Baby } from "../Baby";

/** All special rooms are Angel shops. */
export class PrettyBaby extends Baby {
  /**
   * Rerolled collectibles turn into hearts, so delete the heart and manually create another
   * pedestal item.
   */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    const roomType = g.r.GetType();

    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectibleType = getRandomCollectibleTypeFromPool(
        ItemPoolType.ANGEL,
      );
      const collectible = mod.spawnCollectible(
        collectibleType,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;
    }
  }

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(): [EntityType | GridEntityXMLType, int, int] | undefined {
    const roomType = g.r.GetType();

    if (shouldTransformRoomType(roomType)) {
      return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing.
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomType = g.r.GetType();
    const isFirstVisit = g.r.IsFirstVisit();

    if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
      return;
    }

    const collectibleType = getRandomCollectibleTypeFromPool(
      ItemPoolType.ANGEL,
    );
    const position = gridCoordinatesToWorldPosition(6, 4);
    const collectible = mod.spawnCollectible(
      collectibleType,
      position,
      g.run.room.rng,
    );
    collectible.AutoUpdatePrice = false;
    collectible.Price = 15;

    // Spawn the Angel Statue.
    const oneTileAboveCenterGridIndex = 52;
    spawnGridEntityWithVariant(
      GridEntityType.STATUE,
      StatueVariant.ANGEL,
      oneTileAboveCenterGridIndex,
    );

    // Spawn the two fires.
    const firePositions = [
      gridCoordinatesToWorldPosition(3, 1),
      gridCoordinatesToWorldPosition(9, 1),
    ];
    for (const firePosition of firePositions) {
      spawnWithSeed(
        EntityType.FIREPLACE,
        FireplaceVariant.BLUE,
        0,
        firePosition,
        g.run.room.rng,
      );
    }
  }
}
