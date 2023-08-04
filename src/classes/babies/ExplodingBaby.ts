import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  DISTANCE_OF_GRID_TILE,
  ModCallbackCustom,
  game,
  isGridEntityBreakableByExplosion,
  isGridEntityBroken,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const KAMIKAZE_DISTANCE_THRESHOLD = DISTANCE_OF_GRID_TILE - 4;

/** Kamikaze effect upon touching a breakable obstacle. */
export class ExplodingBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    // Check to see if we need to reset the cooldown (after we used the Kamikaze effect upon
    // touching an obstacle).
    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      g.run.babyFrame = 0;
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_GRID_ENTITY_UPDATE)
  postGridEntityUpdate(gridEntity: GridEntity): void {
    // For this baby, we store the Kamikaze cooldown in the "babyFrame" variable. Do nothing if the
    // Kamikaze effect is on cooldown.
    if (g.run.babyFrame !== 0) {
      return;
    }

    // Only trigger Kamikaze for grid entities that we are close enough to.
    const player = Isaac.GetPlayer();
    if (
      player.Position.Distance(gridEntity.Position) >
      KAMIKAZE_DISTANCE_THRESHOLD
    ) {
      return;
    }

    if (!isGridEntityBreakableByExplosion(gridEntity)) {
      return;
    }

    if (!isGridEntityBroken(gridEntity)) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();

    g.run.invulnerable = true;
    useActiveItemTemp(player, CollectibleType.KAMIKAZE);
    g.run.invulnerable = false;
    g.run.babyFrame = gameFrameCount + 10;
  }
}
