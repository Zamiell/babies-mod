import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { Callback, spawnProjectile } from "isaacscript-common";
import { Baby } from "../Baby";

/** Pickups shoot. */
export class CowboyBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_UPDATE)
  postPickupUpdate(pickup: EntityPickup): void {
    const player = Isaac.GetPlayer();
    const sprite = pickup.GetSprite();
    const collected = sprite.IsPlaying("Collect");
    const num = this.getAttribute("num");

    if (
      pickup.FrameCount % num === 0 &&
      !collected // Don't shoot if we already picked it up.
    ) {
      const velocity = player.Position.sub(pickup.Position).Normalized().mul(7);
      spawnProjectile(
        ProjectileVariant.NORMAL,
        0,
        pickup.Position,
        velocity,
        pickup,
      );
    }
  }
}
