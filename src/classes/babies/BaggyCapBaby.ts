import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getDoors } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Cannot bomb through rooms. */
export class BaggyCapBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const roomClear = g.r.IsClear();

    if (roomClear) {
      return;
    }

    for (const door of getDoors()) {
      if (door.IsOpen()) {
        door.Close(true);
      }
    }
  }
}
