import { ModCallback } from "isaac-typescript-definitions";
import { Callback, repeat } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** X splitting tears. */
export class SpeakerBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType !== 1 || tear.FrameCount < 20) {
      return;
    }

    tear.Remove();

    let rotation = 45;
    repeat(4, () => {
      rotation += 90;
      const rotatedVelocity = tear.Velocity.Rotated(rotation);
      g.run.babyBool = true;
      const xTear = g.p.FireTear(
        g.p.Position,
        rotatedVelocity,
        false,
        true,
        false,
      );
      g.run.babyBool = false;
      xTear.Position = tear.Position;
      xTear.Height = tear.Height;
    });
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    if (!g.run.babyBool) {
      tear.SubType = 1; // Mark that we shot this tear.
    }
  }
}
