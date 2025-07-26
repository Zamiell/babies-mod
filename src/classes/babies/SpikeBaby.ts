import {
  ChestSubType,
  CollectibleType,
  EntityType,
  LevelStage,
  ModCallback,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getPickups,
  hasTrinket,
  isChest,
  onStage,
  removeEntities,
  spawnCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

const ANTI_SYNERGY_TRINKETS = [
  TrinketType.LEFT_HAND, // 61
  TrinketType.FLAT_FILE, // 151
] as const;

/** All chests are Spiked Chests + all chests have items. */
export class SpikeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      !hasTrinket(player, ...ANTI_SYNERGY_TRINKETS)
      // We don't want this to interfere with the free items from the starting room in The Chest /
      // Dark Room.
      && !onStage(LevelStage.DARK_ROOM_CHEST)
    );
  }

  /**
   * Replace all chests with Spiked Chests. (We do not use the `PRE_ENTITY_SPAWN` callback because
   * that does not work properly for random pickups that are part of the room layout (as
   * demonstrated on seed 61RT H2V3 by walking down from the starting room).
   */
  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInitChest(pickup: EntityPickup): void {
    // Even though it is impossible to get this baby on The Chest (see the `isValid` method above),
    // we need to check for the stage because otherwise, when the player goes from Cathedral to The
    // Chest, the four chests in the starting room will be replaced with Spike Chests before the
    // ability can be taken away.
    if (onStage(LevelStage.DARK_ROOM_CHEST)) {
      return;
    }

    // Prevent infinite loops with Flat File.
    const player = Isaac.GetPlayer();
    if (player.HasTrinket(TrinketType.FLAT_FILE)) {
      return;
    }

    if (pickup.Variant !== PickupVariant.SPIKED_CHEST && isChest(pickup)) {
      pickup.Morph(
        EntityType.PICKUP,
        PickupVariant.SPIKED_CHEST,
        ChestSubType.CLOSED,
        undefined,
        true,
        true,
      );
    }
  }

  /** Replace the contents of Spiked Chests with collectibles. */
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_UPDATE_FILTER,
    PickupVariant.SPIKED_CHEST,
    ChestSubType.OPENED,
  )
  postPickupUpdateSpikedChestOpen(pickup: EntityPickup): void {
    // Remove the spiked chest.
    pickup.Remove();

    // Unfortunately, unlike sacks, Spiked Chest contents do not have the `SpawnerEntity` properly
    // set. Thus, we instead detect the contents by finding pickups on frame 1. (At this point, the
    // spawned pickups have already ticked from frame 0 to frame 1.)
    const pickups = getPickups();
    const pickupsFromSpikedChest = pickups.filter(
      (possiblePickup) => possiblePickup.FrameCount === 1,
    );
    removeEntities(pickupsFromSpikedChest);

    spawnCollectible(CollectibleType.NULL, pickup.Position, pickup.InitSeed);
  }
}
