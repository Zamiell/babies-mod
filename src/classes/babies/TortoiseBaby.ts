import {
  CallbackCustom,
  getRandom,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 50% chance to ignore damage. */
export class TortoiseBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const avoidChance = getRandom(g.run.rng);
    if (avoidChance <= 0.5) {
      return false;
    }

    return undefined;
  }
}
