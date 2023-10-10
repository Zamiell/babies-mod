import type { DoorState } from "isaac-typescript-definitions";
import {
  CardType,
  CollectibleType,
  ItemPoolType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  closeDoorFast,
  game,
  getDoors,
  levelHasRoomType,
  newRNG,
  onFirstFloor,
  useCardTemp,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const ITEM_POOL_TYPES = [
  ItemPoolType.DEVIL,
  ItemPoolType.ANGEL,
  ItemPoolType.BOSS,
  ItemPoolType.PLANETARIUM,
  ItemPoolType.ULTRA_SECRET,
] as const;

/** Create red doors on hit + improved Ultra Secret Rooms (5 items). */
export class BloodiedBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    // We do not want players to explicitly reset for this baby, so we exclude it from the first
    // floor.
    return (
      levelHasRoomType(RoomType.ULTRA_SECRET) &&
      !player.HasCollectible(CollectibleType.RED_KEY) &&
      !onFirstFloor()
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    /** Indexed by target room index. */
    const doorStateMap = new Map<int, DoorState>();

    for (const door of getDoors()) {
      doorStateMap.set(door.TargetRoomIndex, door.State);
    }

    useCardTemp(player, CardType.SOUL_OF_CAIN);

    if (roomClear) {
      return;
    }

    // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms.
    for (const door of getDoors()) {
      const oldState = doorStateMap.get(door.TargetRoomIndex);
      if (oldState === undefined) {
        continue;
      }

      if (oldState !== door.State) {
        closeDoorFast(door);
      }
    }

    return undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_NEW_ROOM_REORDERED,
    RoomType.ULTRA_SECRET,
  )
  postNewRoomReordered(): void {
    const room = game.GetRoom();

    const isFirstVisit = room.IsFirstVisit();
    if (!isFirstVisit) {
      return;
    }

    const center = room.GetCenterPos();
    const seed = room.GetAwardSeed();
    const rng = newRNG(seed);

    for (const itemPoolType of ITEM_POOL_TYPES) {
      const position = room.FindFreePickupSpawnPosition(center, 1, true);
      const collectibleType = getRandomCollectibleTypeFromPool(
        itemPoolType,
        rng,
      );
      mod.spawnCollectible(collectibleType, position, rng);
    }
  }
}
