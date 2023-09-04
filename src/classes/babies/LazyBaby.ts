import { CardType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Random card effect on hit. */
export class LazyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const exceptions = [CardType.SUICIDE_KING]; // It would be unfair to randomly die.
    const card = mod.getRandomCard(g.run.rng, exceptions);

    // We don't use the `useCardTemp` helper function because we want the random card name to appear
    // as streak text.
    player.UseCard(card);

    return undefined;
  }
}
