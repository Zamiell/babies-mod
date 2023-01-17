import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { Callback, spawnProjectile } from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { BabyDescription } from "../../types/BabyDescription";
import { Baby } from "../Baby";

interface MultiTearDescription {
  readonly position: Vector;
  num: int;
}

/** Enemies spawn projectiles upon death. */
export class BlueWrestlerBaby extends Baby {
  v = {
    room: {
      multiTearDescriptions: new Map<PtrHash, MultiTearDescription>(),
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this.v);
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const player = Isaac.GetPlayer();

    for (const [ptrHash, multiTearDescription] of this.v.room
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
        this.v.room.multiTearDescriptions.delete(ptrHash);
      }
    }
  }

  /** Mark to fire some tears one frame at a time. */
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    const ptrHash = GetPtrHash(entity);
    const num = this.getAttribute("num");

    this.v.room.multiTearDescriptions.set(ptrHash, {
      position: entity.Position,
      num,
    });
  }
}
