import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** Genesis effect after N hits. */
export class KoalaBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.numHits = 0;
      useActiveItemTemp(player, CollectibleType.GENESIS);
    }

    return undefined;
  }
}
