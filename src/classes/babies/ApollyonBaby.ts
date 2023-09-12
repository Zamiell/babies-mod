import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Black rune effect on hit. */
export class ApollyonBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useCardTemp(player, CardType.RUNE_BLACK);
    return undefined;
  }
}
