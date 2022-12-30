import { GridEntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Callus + makes spikes. */
export class EyePatchBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    Isaac.GridSpawn(GridEntityType.SPIKES, 0, g.p.Position);
  }
}
