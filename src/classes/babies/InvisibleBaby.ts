import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Invisibility. */
export class TrollBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const roomFrameCount = g.r.GetFrameCount();

    if (roomFrameCount === 1) {
      // The sprite is a blank PNG, but we also want to remove the shadow. Doing this in the
      // `POST_NEW_ROOM` callback won't work. Doing this on frame 0 won't work.
      g.p.Visible = false;
    }
  }
}
