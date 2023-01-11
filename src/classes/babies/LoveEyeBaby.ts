import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getNPCs, spawn } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Falls in loves with the first enemy killed. */
export class LoveEyeBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (g.run.babyBool) {
      return;
    }
    g.run.babyBool = true;

    // Store the killed enemy.
    g.run.babyNPC = {
      entityType: entity.Type,
      variant: entity.Variant,
      subType: entity.SubType,
    };

    // Respawn all of the existing enemies in the room.
    for (const npc of getNPCs()) {
      // Don't respawn the entity that just died.
      if (npc.Index !== entity.Index) {
        spawn(
          npc.Type,
          npc.Variant,
          npc.SubType,
          npc.Position,
          npc.Velocity,
          undefined,
          npc.InitSeed,
        );
        npc.Remove();
      }
    }
  }
}
