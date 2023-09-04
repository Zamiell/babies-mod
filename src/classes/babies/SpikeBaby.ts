import {
  BombSubType,
  ChestSubType,
  CollectibleType,
  EntityType,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getBombPickups,
  isChestVariant,
  removeEntities,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Hard-coding this makes it easier to clean up the pickups afterwards. */
const SPIKED_CHEST_SEED_THAT_SPAWNS_TWO_BOMBS = 12 as Seed;

/** All chests are Mimics + all chests have items. */
export class SpikeBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasTrinket(TrinketType.LEFT_HAND);
  }

  /** Replace all chests with Mimics. */
  @CallbackCustom(ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER, EntityType.PICKUP)
  preEntitySpawnPickup(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    _initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    const pickupVariant = variant as PickupVariant;

    // This check includes Spiked Chests because we need to respawn Spiked Chests to have a specific
    // seed.
    if (isChestVariant(pickupVariant)) {
      return [
        entityType,
        PickupVariant.MIMIC_CHEST,
        ChestSubType.CLOSED,
        SPIKED_CHEST_SEED_THAT_SPAWNS_TWO_BOMBS,
      ];
    }

    return undefined;
  }

  /** Replace the contents of the Spiked Chests with collectibles. */
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_UPDATE_FILTER,
    PickupVariant.SPIKED_CHEST,
    ChestSubType.OPENED,
  )
  postPickupUpdateSpikedChestOpen(pickup: EntityPickup): void {
    // Remove the spiked chest.
    pickup.Remove();

    // All spiked chests have a specific seed that results in 2 normal bomb pickups. We have to
    // manually remove them before spawning the random collectible.
    const bombPickups = getBombPickups();

    // Unfortunately, unlike sacks, Spiked Chest contents do not have the `SpawnerEntity` properly
    // set. Thus, we instead detect the contents by finding bombs on frame 1. (At this point, the
    // spawned bombs have already ticked from frame 0 to frame 1.)
    const bombsFromSpikedChest = bombPickups.filter(
      (bombPickup) =>
        bombPickup.SubType === BombSubType.NORMAL &&
        bombPickup.FrameCount === 1,
    );
    removeEntities(bombsFromSpikedChest);

    // We can't use the Spiked Chest's init seed because it is always hard-coded to a specific
    // value.
    const room = game.GetRoom();
    const roomSeed = room.GetAwardSeed();
    mod.spawnCollectible(CollectibleType.NULL, pickup.Position, roomSeed);
  }
}
