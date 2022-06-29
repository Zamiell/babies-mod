import { EntityPartition, GridEntityType } from "isaac-typescript-definitions";
import {
  DISTANCE_OF_GRID_TILE,
  getRoomListIndex,
  ModCallbackCustom,
  ModUpgraded,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby, spawnRandomPickup } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_BROKEN,
    poop,
    GridEntityType.POOP,
  );
}

function poop(gridEntity: GridEntity) {
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // 173
  // Destroying poops spawns random pickups.
  if (baby.name !== "Ate Poop Baby") {
    return;
  }

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
