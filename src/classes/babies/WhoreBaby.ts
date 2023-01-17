import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** 49 deals 1 half heart of damage. */
const DAMAGE_AMOUNT = 50;

/** All enemies explode. */
export class WhoreBaby extends Baby {
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    // We cannot explode enemies in the `POST_ENTITY_KILL` callback due to a crash having to do with
    // black hearts.
    mod.runInNGameFrames(
      () => {
        Isaac.Explode(entity.Position, undefined, DAMAGE_AMOUNT);
      },
      0,
      true,
    );
  }
}
