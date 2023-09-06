import {
  LaserVariant,
  ModCallback,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  addFlag,
  newReadonlyVector,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** This is copied from Samael's Tech X ability. */
const RING_RADIUS = 66;

const RING_SPRITE_SCALE = newReadonlyVector(0.5, 1);

const v = {
  room: {
    laserRingPtrHash: null as PtrHash | null,
  },
};

/** Orbiting laser ring. */
export class GlassBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_LASER_UPDATE)
  postLaserUpdate(laser: EntityLaser): void {
    const ptrHash = GetPtrHash(laser);
    if (ptrHash !== v.room.laserRingPtrHash) {
      return;
    }

    // Keep the ring centered on the player.
    const player = Isaac.GetPlayer();
    laser.Position = player.Position;
  }

  /** Spawn a laser ring around the player. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();
    const laser = player.FireTechXLaser(
      player.Position,
      VectorZero,
      RING_RADIUS,
    );

    laser.Variant = LaserVariant.THIN_RED;
    laser.SpriteScale = RING_SPRITE_SCALE;
    laser.TearFlags = addFlag(laser.TearFlags, TearFlag.CONTINUUM);
    laser.CollisionDamage *= 0.66;

    const ptrHash = GetPtrHash(laser);
    v.room.laserRingPtrHash = ptrHash;
  }
}
