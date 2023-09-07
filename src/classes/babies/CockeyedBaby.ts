import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandomInt } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    shootingExtraTear: false,
  },
};

/** Shoots extra tears with random velocity. */
export class CockeyedBaby extends Baby {
  v = v;

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    if (v.room.shootingExtraTear) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    // Spawn a new tear with a random velocity.
    const rng = tear.GetDropRNG();
    const rotation = getRandomInt(0, 359, rng);
    const velocity = tear.Velocity.Rotated(rotation);
    v.room.shootingExtraTear = true;
    player.FireTear(player.Position, velocity, false, true, false);
    v.room.shootingExtraTear = false;
  }
}
