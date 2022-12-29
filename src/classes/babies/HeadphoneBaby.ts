import { ModCallback, TearVariant } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Soundwave tears. */
export class HeadphoneBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.ChangeVariant(TearVariant.PUPULA);

    // We don't give it a tear flag of `TEAR_FLAT` because that makes it look worse.
    tear.Scale *= 10;

    // For some reason, changing the tear variant on this frame will cause the tear to point towards
    // the right. To work around this, make the tear invisible and make it visible on the next
    // frame.
    tear.Visible = false;
  }
}
