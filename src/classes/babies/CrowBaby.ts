import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Soul of Eve effect on hit. */
export class CrowBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useCardTemp(player, CardType.SOUL_EVE);

    return undefined;
  }
}
