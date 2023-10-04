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

/** Everything is TNT. */
export class RedWrestlerBaby extends Baby {
  /**
   * There are almost no grid entities on the final floor. Pointy Rib, Mom's Knife and Finger can
   * cause unavoidable damage.
   */
  override isValid(player: EntityPlayer): boolean {
    return (
      !onStage(LevelStage.DARK_ROOM_CHEST) &&
      !hasCollectible(
        player,
        CollectibleType.MOMS_KNIFE,
        CollectibleType.FINGER,
        CollectibleType.POINTY_RIB,
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
