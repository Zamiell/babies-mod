import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Forget Me Now on Nth hit (per room). */
export class SteroidsBaby extends Baby {
  v = {
    room: {
      numHits: 0,
    },
  };

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    this.v.room.numHits++;
    if (this.v.room.numHits >= num) {
      this.v.room.numHits = 0;
      useActiveItemTemp(player, CollectibleType.FORGET_ME_NOW);
    }

    return undefined;
  }
}
