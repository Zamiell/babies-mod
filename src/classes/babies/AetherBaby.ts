import { ModCallback } from "isaac-typescript-definitions";
import { Callback, hasCollectible } from "isaacscript-common";
import { EXPLOSIVE_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    rotationAngle: 0,
  },
};

/** All direction tears. */
export class AetherBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...EXPLOSIVE_COLLECTIBLE_TYPES);
  }

  /** Shoot 8 tears at a time. */
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    v.room.rotationAngle += 45;
    if (v.room.rotationAngle < 360) {
      const velocity = tear.Velocity.Rotated(v.room.rotationAngle);
      player.FireTear(player.Position, velocity, false, true, false);
    } else {
      v.room.rotationAngle = 0;
    }
  }
}
