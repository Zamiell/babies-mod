import {
  DISTANCE_OF_GRID_TILE,
  getRoomListIndex,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  ModCallbacksCustom,
  ModUpgraded,
  useActiveItemTemp,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby, spawnRandomPickup } from "../utils";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE,
    poop,
    GridEntityType.GRID_POOP, // 14
  );
}

export function main(gridEntity: GridEntity): void {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 320
  // Kamikaze! effect upon touching an breakable obstacle
  if (baby.name !== "Exploding Baby") {
    return;
  }

  // For this baby, we store the Kamikaze cooldown in the "babyFrame" variable
  // Do nothing if the Kamikaze effect is on cooldown
  if (g.run.babyFrame !== 0) {
    return;
  }

  // Only trigger Kamikaze for grid entities that we are close enough to
  if (
    g.p.Position.Distance(gridEntity.Position) > KAMIKAZE_DISTANCE_THRESHOLD
  ) {
    return;
  }

  if (!isGridEntityBreakableByExplosion(gridEntity)) {
    return;
  }

  if (!isGridEntityBroken(gridEntity)) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  g.run.invulnerable = true;
  useActiveItemTemp(g.p, CollectibleType.COLLECTIBLE_KAMIKAZE);
  g.run.invulnerable = false;
  g.run.babyFrame = gameFrameCount + 10;
}

// GridEntityType.GRID_POOP (14)
function poop(gridEntity: GridEntity) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  switch (baby.name) {
    // 15
    case "Gold Baby": {
      goldBaby(gridEntity);
      break;
    }

    // 173
    case "Ate Poop Baby": {
      atePoopBaby(gridEntity);
      break;
    }

    default: {
      break;
    }
  }
}

function goldBaby(gridEntity: GridEntity) {
  // Gold gear + gold poops + gold rooms
  const gridEntityVariant = gridEntity.GetVariant();
  if (gridEntityVariant !== PoopGridEntityVariant.GOLDEN) {
    gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
  }
}

function atePoopBaby(gridEntity: GridEntity) {
  // Destroying poops spawns random pickups
  const gridIndex = gridEntity.GetGridIndex();
  const roomListIndex = getRoomListIndex();

  if (gridEntity.State === PoopState.COMPLETELY_DESTROYED) {
    return;
  }

  // First, check to make sure that we have not already destroyed this poop
  const matchingPoop = g.run.level.killedPoops.find(
    (poopDescription) =>
      poopDescription.roomListIndex === roomListIndex &&
      poopDescription.gridIndex === gridIndex,
  );
  if (matchingPoop !== undefined) {
    return;
  }

  // Second, check to make sure that there is not any existing pickups already on the poop
  const entities = Isaac.FindInRadius(
    gridEntity.Position,
    DISTANCE_OF_GRID_TILE,
    EntityPartition.PICKUP,
  );
  if (entities.length > 0) {
    return;
  }

  spawnRandomPickup(gridEntity.Position);

  // Keep track of it so that we don't spawn another pickup on the next frame
  g.run.level.killedPoops.push({
    roomListIndex,
    gridIndex,
  });
}
