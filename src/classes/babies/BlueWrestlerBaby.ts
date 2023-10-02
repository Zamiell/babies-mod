import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { Callback, spawnProjectile } from "isaacscript-common";
import { isValidForEnemyDeathEffect } from "../../utils";
import { Baby } from "../Baby";

interface MultiTearDescription {
  readonly position: Vector;
  num: int;
}

const v = {
  room: {
    multiTearDescriptions: new Map<PtrHash, MultiTearDescription>(),
  },
};

/** Enemies spawn projectiles upon death. */
export class BlueWrestlerBaby extends Baby {
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const player = Isaac.GetPlayer();

    for (const [ptrHash, multiTearDescription] of v.room
      .multiTearDescriptions) {
      let velocity = player.Position.sub(multiTearDescription.position);
      velocity = velocity.Normalized();
      velocity = velocity.mul(12);

      spawnProjectile(
        ProjectileVariant.NORMAL,
        0,
        multiTearDescription.position,
        velocity,
      );

      multiTearDescription.num--;
      if (multiTearDescription.num === 0) {
        // The dead enemy has shot all of its tears, so we remove the tracking element for it.
        v.room.multiTearDescriptions.delete(ptrHash);
      }
    }
  }

  /** Mark to fire some tears one frame at a time. */
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (!isValidForEnemyDeathEffect(entity)) {
      return;
    }

    const ptrHash = GetPtrHash(entity);
    const num = this.getAttribute("num");

    v.room.multiTearDescriptions.set(ptrHash, {
      position: entity.Position,
      num,
    });
  }
}
