import {
  EntityPartition,
  GridEntityType,
  LevelStage,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  getEffectiveStage,
  getRoomListIndex,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { spawnRandomPickup } from "../../utils";
import { Baby } from "../Baby";

/** Destroying poops spawns random pickups. */
export class AtePoopBaby extends Baby {
  /** There are almost no poops on The Chest. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.DARK_ROOM_CHEST;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_BROKEN,
    GridEntityType.POOP,
  )
  postGridEntityBrokenPoop(gridEntity: GridEntity): void {
    const gridIndex = gridEntity.GetGridIndex();
    const roomListIndex = getRoomListIndex();

    // First, check to make sure that we have not already destroyed this poop.
    const matchingPoop = g.run.level.killedPoops.find(
      (poopDescription) =>
        poopDescription.roomListIndex === roomListIndex &&
        poopDescription.gridIndex === gridIndex,
    );
    if (matchingPoop !== undefined) {
      return;
    }

    // Second, check to make sure that there is not any existing pickups already on the poop.
    const entities = Isaac.FindInRadius(
      gridEntity.Position,
      DISTANCE_OF_GRID_TILE,
      EntityPartition.PICKUP,
    );
    if (entities.length > 0) {
      return;
    }

    spawnRandomPickup(gridEntity.Position);

    // Keep track of it so that we don't spawn another pickup on the next frame.
    g.run.level.killedPoops.push({
      roomListIndex,
      gridIndex,
    });
  }
}
