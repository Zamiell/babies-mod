import {
  DISTANCE_OF_GRID_TILE,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  useActiveItemTemp,
} from "isaacscript-common";
import g from "../globals";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;

export const postGridEntityUpdateBabyFunctionMap = new Map<
  int,
  (gridEntity: GridEntity) => void
>();

// Gold Baby
postGridEntityUpdateBabyFunctionMap.set(15, (gridEntity: GridEntity) => {
  // Gold gear + gold poops + gold rooms
  const gridEntityType = gridEntity.GetType();
  const gridEntityVariant = gridEntity.GetVariant();

  if (
    gridEntityType === GridEntityType.GRID_POOP &&
    gridEntityVariant !== PoopGridEntityVariant.GOLDEN
  ) {
    gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
  }
});

// Exploding Baby
postGridEntityUpdateBabyFunctionMap.set(320, (gridEntity: GridEntity) => {
  // Kamikaze! effect upon touching an breakable obstacle

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
});
