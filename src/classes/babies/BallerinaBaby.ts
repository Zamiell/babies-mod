import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** Summons a Restock Machine after N hits. */
export class BallerinaBaby extends Baby {
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.numHits = 0;
      useCardTemp(player, CardType.REVERSE_JUDGEMENT);
    }

    return undefined;
  }
}
