import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero, game, repeat, spawn } from "isaacscript-common";
import { isValidForEnemyDeathEffect } from "../../../utils";
import { Baby } from "../../Baby";

const SWARM_SPIDER_DISPLACEMENT_DISTANCE = 3;

const v = {
  run: {
    spawnedSwarmSpidersGameFrame: 0,
  },
};

/** Enemies spawn N Swarm Spiders on death. */
export class Multidimensional extends Baby {
  v = v;

  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (!isValidForEnemyDeathEffect(entity)) {
      return;
    }

    if (entity.Type === EntityType.SWARM_SPIDER) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount === v.run.spawnedSwarmSpidersGameFrame) {
      return;
    }
    v.run.spawnedSwarmSpidersGameFrame = gameFrameCount;

    const num = this.getAttribute("num");

    repeat(num, () => {
      // Don't spawn all of the Swarm Spiders at the exact same location.
      const randomVector = RandomVector().mul(
        SWARM_SPIDER_DISPLACEMENT_DISTANCE,
      );
      const position = entity.Position.add(randomVector);

      spawn(
        EntityType.SWARM_SPIDER,
        0,
        0,
        position,
        VectorZero,
        entity,
        entity.InitSeed,
      );
    });
  }
}
