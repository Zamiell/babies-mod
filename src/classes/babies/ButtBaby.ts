import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getPlayerFromEntity,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Farts after shooting. */
export class ButtBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    useActiveItemTemp(player, CollectibleType.BEAN);
  }
}
