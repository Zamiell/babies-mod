import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Forget Me Now on 2nd hit (per room). */
export class SteroidsBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    g.run.babyCountersRoom++;
    if (g.run.babyCountersRoom >= 2) {
      useActiveItemTemp(player, CollectibleType.FORGET_ME_NOW);
    }

    return undefined;
  }
}
