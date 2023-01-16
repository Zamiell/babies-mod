import {
  addRoomClearCharge,
  CallbackCustom,
  getPlayerFromEntity,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Recharge bombs. */
export class TongueBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const player = getPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    addRoomClearCharge(player, false);
  }
}
