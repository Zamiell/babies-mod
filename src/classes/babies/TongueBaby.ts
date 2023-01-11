import { EntityType } from "isaac-typescript-definitions";
import {
  addRoomClearCharge,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Recharge bombs. */
export class TongueBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    if (bomb.SpawnerType !== EntityType.PLAYER) {
      return;
    }

    addRoomClearCharge(g.p, false);
  }
}
