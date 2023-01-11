import { ModCallback } from "isaac-typescript-definitions";
import { addRoomClearCharge, Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Extra charge on room clear. */
export class JammiesBaby extends Baby {
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    addRoomClearCharge(g.p);
    return undefined;
  }
}
