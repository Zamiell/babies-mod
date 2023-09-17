import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, VectorZero, repeat, spawn } from "isaacscript-common";
import { Baby } from "../../Baby";

const SWARM_SPIDER_DISPLACEMENT_DISTANCE = 3;

/** Enemies spawn N Swarm Spiders on death. */
export class Multidimensional extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    const npc = entity.ToNPC();
    if (npc === undefined) {
      return;
    }

    if (npc.Type === EntityType.SWARM_SPIDER) {
      return;
    }

    const num = this.getAttribute("num");

    repeat(num, () => {
      // Don't spawn all of the Swarm Spiders at the exact same location.
      const randomVector = RandomVector().mul(
        SWARM_SPIDER_DISPLACEMENT_DISTANCE,
      );
      const position = npc.Position.add(randomVector);

      spawn(
        EntityType.SWARM_SPIDER,
        0,
        0,
        position,
        VectorZero,
        npc,
        npc.InitSeed,
      );
    });
  }
}
