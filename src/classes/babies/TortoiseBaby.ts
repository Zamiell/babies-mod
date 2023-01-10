import {
  CallbackCustom,
  getRandom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 50% chance to ignore damage. */
export class TortoiseBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    // 0.5x speed + 50% chance to ignore damage.
    const avoidChance = getRandom(g.run.rng);
    if (avoidChance <= 0.5) {
      return false;
    }

    return undefined;
  }
}
