import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { Callback, spawnProjectile, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Enemies spawn projectiles upon death. */
export class BlueWrestlerBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const player = Isaac.GetPlayer();

    for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
      const tear = g.run.room.tears[i];
      if (tear === undefined) {
        error(`Failed to get tear number: ${i}`);
      }

      let velocity = player.Position.sub(tear.position);
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

  /** Mark to fire some tears one frame at a time. */
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    const num = this.getAttribute("num");

    g.run.room.tears.push({
      frame: 0,
      position: entity.Position,
      velocity: VectorZero,
      num,
    });
  }
}
