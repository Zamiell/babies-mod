import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Card Against Humanity on hit. */
export class CupBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useCardTemp(player, CardType.AGAINST_HUMANITY);

    return undefined;
  }
}
