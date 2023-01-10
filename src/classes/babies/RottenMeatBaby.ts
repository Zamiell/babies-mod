import { CardType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Teleport to starting room on hit. */
export class RottenMeatBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    player.UseCard(CardType.FOOL);

    return undefined;
  }
}
