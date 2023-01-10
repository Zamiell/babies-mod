import { LevelStage } from "isaac-typescript-definitions";
import { getEffectiveStage } from "isaacscript-common";
import { Baby } from "../Baby";

/** Destroying poops spawns random pickups. */
export class AtePoopBaby extends Baby {
  /** There are almost no poops on The Chest. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.DARK_ROOM_CHEST;
  }
}
