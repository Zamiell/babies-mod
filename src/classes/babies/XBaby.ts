import { ModCallback } from "isaac-typescript-definitions";
import { Callback, hasCollectible } from "isaacscript-common";
import { EXPLOSIVE_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    extraTearsCounter: 0,
  },
};

/** Shoots 4 tears diagonally. */
export class XBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(player, ...EXPLOSIVE_COLLECTIBLE_TYPES);
  }

  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Velocity = tear.Velocity.Rotated(45);

    v.room.extraTearsCounter++;
    if (v.room.extraTearsCounter < 4) {
      const newVelocity = tear.Velocity.Rotated(45);
      player.FireTear(player.Position, newVelocity, false, true, false);
    } else {
      v.room.extraTearsCounter = 0;
    }
  }
}
