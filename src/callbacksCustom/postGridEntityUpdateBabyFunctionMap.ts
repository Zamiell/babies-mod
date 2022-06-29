import {
  CollectibleType,
  GridEntityType,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import {
  DISTANCE_OF_GRID_TILE,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  useActiveItemTemp,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;

export const postGridEntityUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (gridEntity: GridEntity) => void
>();

// 15
postGridEntityUpdateBabyFunctionMap.set(
  RandomBabyType.GOLD,
  (gridEntity: GridEntity) => {
    // Gold gear + gold poops + gold rooms.
    const gridEntityType = gridEntity.GetType();
    const gridEntityVariant = gridEntity.GetVariant();

    if (
      gridEntityType === GridEntityType.POOP &&
      gridEntityVariant !== (PoopGridEntityVariant.GOLDEN as int)
    ) {
      gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
    }
  },
);

// 320
postGridEntityUpdateBabyFunctionMap.set(
  RandomBabyType.EXPLODING,
  (gridEntity: GridEntity) => {
    // Kamikaze effect upon touching an breakable obstacle.

    // For this baby, we store the Kamikaze cooldown in the "babyFrame" variable. Do nothing if the
    // Kamikaze effect is on cooldown.
    if (g.run.babyFrame !== 0) {
      return;
    }

    // Only trigger Kamikaze for grid entities that we are close enough to.
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
    useActiveItemTemp(g.p, CollectibleType.KAMIKAZE);
    g.run.invulnerable = false;
    g.run.babyFrame = gameFrameCount + 10;
  },
);
