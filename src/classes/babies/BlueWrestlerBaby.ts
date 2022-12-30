import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { Callback, spawnProjectile } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Enemies spawn projectiles upon death. */
export class BlueWrestlerBaby extends Baby {
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
      const tear = g.run.room.tears[i];
      if (tear === undefined) {
        error(`Failed to get tear number: ${i}`);
      }

      let velocity = g.p.Position.sub(tear.position);
      velocity = velocity.Normalized();
      velocity = velocity.mul(12);

      spawnProjectile(ProjectileVariant.NORMAL, 0, tear.position, velocity);

      tear.num--;
      if (tear.num === 0) {
        // The dead enemy has shot all of its tears, so we remove the tracking element for it.
        g.run.room.tears.splice(i, 1);
      }
    }
  }
}
