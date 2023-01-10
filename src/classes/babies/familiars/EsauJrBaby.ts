import { CardType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../../Baby";

/** Soul of Jacob and Esau effect on hit. */
export class EsauJrBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    player.UseCard(CardType.SOUL_JACOB);

    return undefined;
  }
}
