import type { EntityType } from "isaac-typescript-definitions";
import {
  CollectibleType,
  GridEntityXMLType,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  hasCollectible,
  isGridEntityXMLType,
  onStage,
} from "isaacscript-common";
import { GRID_ENTITY_REPLACEMENT_EXCEPTIONS } from "../../constants";
import { Baby } from "../Baby";

const COLLECTIBLE_TYPES_THAT_AUTOMATICALLY_EXPLODE_TNT = [
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.FINGER, // 467
  CollectibleType.POINTY_RIB, // 544
] as const;

/** Everything is TNT. */
export class RedWrestlerBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      // There are almost no grid entities on Dark Room, The Chest, and Home.
      !onStage(LevelStage.DARK_ROOM_CHEST, LevelStage.HOME) &&
      !hasCollectible(
        player,
        ...COLLECTIBLE_TYPES_THAT_AUTOMATICALLY_EXPLODE_TNT,
      )
    );
  }

  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
    _variant: int,
    _subType: int,
    _gridIndex: int,
    _initSeed: Seed,
  ):
    | [type: EntityType | GridEntityXMLType, variant: int, subType: int]
    | undefined {
    const room = game.GetRoom();
    if (!room.IsFirstVisit()) {
      return undefined;
    }

    // We only convert grid entities.
    if (!isGridEntityXMLType(entityTypeOrGridEntityXMLType)) {
      return undefined;
    }

    if (GRID_ENTITY_REPLACEMENT_EXCEPTIONS.has(entityTypeOrGridEntityXMLType)) {
      return undefined;
    }

    return [GridEntityXMLType.TNT, 0, 0];
  }
}
