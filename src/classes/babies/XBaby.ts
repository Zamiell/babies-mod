import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
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

  /** Certain collectibles make the baby too dangerous. */
  override isValid(player: EntityPlayer): boolean {
    return (
      !player.HasCollectible(CollectibleType.IPECAC) &&
      !player.HasCollectible(CollectibleType.FIRE_MIND)
    );
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
