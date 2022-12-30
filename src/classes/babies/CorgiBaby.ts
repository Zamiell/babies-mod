import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawn } from "isaacscript-common";
import { g } from "../../globals";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a fly every N seconds. */
export class CorgiBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawn(EntityType.FLY, 0, 0, g.p.Position);
    }, num);
  }
}
