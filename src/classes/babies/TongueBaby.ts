import {
  addRoomClearCharge,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Recharge bombs. */
export class TongueBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const player = getBabyPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    addRoomClearCharge(player, false);
  }
}
