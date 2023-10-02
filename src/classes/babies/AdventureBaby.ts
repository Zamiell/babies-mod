import {
  CollectibleType,
  Direction,
  GridEntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  directionToVector,
  getGridEntities,
  hasCollectible,
} from "isaacscript-common";
import {
  BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
  COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS,
} from "../../constants";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const DANGEROUS_ANTI_SYNERGY_COLLECTIBLE_TYPES = [
  CollectibleType.IPECAC, // 149
  CollectibleType.FIRE_MIND, // 257
] as const;

const TEAR_ADJUSTMENT_DISTANCE = 15;

const v = {
  run: {
    shootingTear: false,
  },
};

/** Walls have eyes + blindfolded. */
export class AdventureBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...DANGEROUS_ANTI_SYNERGY_COLLECTIBLE_TYPES,
      ...BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
      ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS,
    );
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    if (v.run.shootingTear) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();

    const fireDirection = player.GetFireDirection();
    if (fireDirection === Direction.NO_DIRECTION) {
      return;
    }

    const walls = getGridEntities(GridEntityType.WALL);
    for (const wall of walls) {
      // By default, the tear will get hit by the collision of the wall, so we need to move it
      // closer to the center of the room.
      const tearAdjustment = directionToVector(fireDirection).mul(
        TEAR_ADJUSTMENT_DISTANCE,
      );
      const position = wall.Position.add(tearAdjustment);

      v.run.shootingTear = true;
      player.FireTear(position, tear.Velocity, false, true, false);
      v.run.shootingTear = false;
    }
  }
}
