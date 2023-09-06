import { CardType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, newRNG } from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Random card effect on hit. */
export class LazyBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    // It would be unfair to randomly die.
    const exceptions = [CardType.SUICIDE_KING, CardType.SOUL_LAZARUS];
    const card = mod.getRandomCard(v.run.rng, exceptions);

    // We don't use the `useCardTemp` helper function because we want the random card name to appear
    // as streak text.
    player.UseCard(card);

    return undefined;
  }
}
