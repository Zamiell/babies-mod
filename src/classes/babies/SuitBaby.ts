import {
  EntityType,
  FireplaceVariant,
  GridEntityType,
  ItemPoolType,
  ModCallback,
  PickupVariant,
  StatueVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getCollectibleDevilHeartPrice,
  gridCoordinatesToWorldPosition,
  isQuestCollectible,
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

/** All special rooms are Devil Rooms. */
export class SuitBaby extends Baby {
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.COLLECTIBLE)
  postPickupUpdateCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;
    const roomType = g.r.GetType();

    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    if (isQuestCollectible(collectible.SubType)) {
      return;
    }

    // If the price is not correct, update it. (We have to check on every frame in case the health
    // situation changes.)
    const price = getCollectibleDevilHeartPrice(collectible.SubType, g.p);
    if (collectible.Price !== (price as int)) {
      collectible.AutoUpdatePrice = false;
      collectible.Price = price;
    }
  }

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
        ItemPoolType.DEVIL,
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

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const roomType = g.r.GetType();
    const isFirstVisit = g.r.IsFirstVisit();

    // Ignore some special rooms.
    if (!isFirstVisit || !shouldTransformRoomType(roomType)) {
      return;
    }

    // All special rooms are Devil Rooms.
    const collectibleType = getRandomCollectibleTypeFromPool(
      ItemPoolType.DEVIL,
    );
    const position = gridCoordinatesToWorldPosition(6, 4);
    const collectible = mod.spawnCollectible(
      collectibleType,
      position,
      g.run.room.rng,
    );
    collectible.AutoUpdatePrice = false;
    collectible.Price = getCollectibleDevilHeartPrice(collectibleType, g.p);

    // Spawn the Devil Statue.
    const oneTileAboveCenterGridIndex = 52;
    spawnGridEntityWithVariant(
      GridEntityType.STATUE,
      StatueVariant.DEVIL,
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
        FireplaceVariant.NORMAL,
        0,
        firePosition,
        g.run.room.rng,
      );
    }
  }
}
