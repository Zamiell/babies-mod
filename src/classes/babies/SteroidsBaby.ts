import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    numHits: 0,
  },
};

/** Forget Me Now on Nth hit (per room). */
export class SteroidsBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.room.numHits++;
    if (v.room.numHits >= num) {
      v.room.numHits = 0;
      useActiveItemTemp(player, CollectibleType.FORGET_ME_NOW);
    }

    return undefined;
  }
}
