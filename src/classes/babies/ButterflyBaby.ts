import type { ActiveSlot, UseFlag } from "isaac-typescript-definitions";
import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  inRoomType,
  levelHasRoomType,
  newRNG,
  onFirstFloor,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const BABY_ROOM_TYPE = RoomType.SUPER_SECRET;

const ITEM_POOL_TYPES = [
  ItemPoolType.DEVIL,
  ItemPoolType.ANGEL,
  ItemPoolType.BOSS,
  ItemPoolType.PLANETARIUM,
] as const;

/** Improved Super Secret Rooms (4 items). */
export class ButterflyBaby extends Baby {
  override isValid(): boolean {
    // We do not want players to explicitly reset for this baby, so we exclude it from the first
    // floor.
    return levelHasRoomType(BABY_ROOM_TYPE) && !onFirstFloor();
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, BABY_ROOM_TYPE)
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

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.D6)
  preUseItemD6(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    _useFlags: BitFlags<UseFlag>,
    _activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    if (inRoomType(BABY_ROOM_TYPE)) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.ETERNAL_D6)
  preUseItemEternalD6(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    _useFlags: BitFlags<UseFlag>,
    _activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    if (inRoomType(BABY_ROOM_TYPE)) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }
}
