import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Spawns a random heart on room clear. */
export class LoveBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  private postFireTear(tear: EntityTear) {}
}
