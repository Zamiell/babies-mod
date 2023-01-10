import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Card Against Humanity on hit. */
export class CupBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    player.UseCard(CardType.AGAINST_HUMANITY);
    // (The animation will automatically be canceled by the damage.)

    return undefined;
  }
}
