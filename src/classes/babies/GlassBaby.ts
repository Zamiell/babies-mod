import {
  LaserVariant,
  ModCallback,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  addFlag,
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModRing";

/** This is copied from Samael's Tech X ability. */
const RING_RADIUS = 66;

const RING_SPRITE_SCALE: Readonly<Vector> = Vector(0.5, 1);

/** Orbiting laser ring. */
export class GlassBaby extends Baby {
  @Callback(ModCallback.POST_LASER_UPDATE)
  postLaserUpdate(laser: EntityLaser): void {
    const data = laser.GetData();
    if (data[DATA_KEY] === true) {
      // Keep the ring centered on the player.
      laser.Position = g.p.Position;
    }
  }

  /** Spawn a laser ring around the player. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const laser = g.p.FireTechXLaser(g.p.Position, VectorZero, RING_RADIUS);

    laser.Variant = LaserVariant.THIN_RED;
    laser.SpriteScale = RING_SPRITE_SCALE;
    laser.TearFlags = addFlag(laser.TearFlags, TearFlag.CONTINUUM);
    laser.CollisionDamage *= 0.66;

    const data = laser.GetData();
    data[DATA_KEY] = true;
  }
}
