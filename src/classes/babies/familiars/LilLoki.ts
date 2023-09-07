import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { Baby } from "../../Baby";

const v = {
  room: {
    rotationAngle: 0,
  },
};

/** Cross tears. */
export class LilLoki extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    v.room.rotationAngle += 90;
    if (v.room.rotationAngle < 360) {
      const velocity = tear.Velocity.Rotated(v.room.rotationAngle);
      player.FireTear(player.Position, velocity, false, true, false);
    } else {
      v.room.rotationAngle = 0;
    }
  }
}
