import {
  CardType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Baby } from "../Baby";

/** Most cards are face up. */
export class WizardBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.TAROT_CARD)
  postPickupInitTarotCard(pickup: EntityPickup): void {
    const card = pickup as EntityPickupCard;

    if (
      (card.SubType >= CardType.FOOL && // 1
        card.SubType <= CardType.RUNE_ALGIZ) || // 39
      // Blank Rune (40) and Black Rune (41) are handled in Racing+.
      card.SubType === CardType.CHAOS || // 42
      // Credit Card (43) has a unique card back in vanilla.
      card.SubType === CardType.RULES || // 44
      // A Card Against Humanity (45) has a unique card back in vanilla.
      card.SubType === CardType.SUICIDE_KING || // 46
      card.SubType === CardType.GET_OUT_OF_JAIL_FREE || // 47
      // (Get out of Jail Free Card has a unique card back in vanilla, but this one looks better.)
      card.SubType === CardType.QUESTION_MARK || // 48
      // Dice Shard (49) has a unique card back in vanilla Emergency Contact (50) has a unique card
      // back in vanilla Holy Card (51) has a unique card back in vanilla.
      (card.SubType >= CardType.HUGE_GROWTH && // 52
        card.SubType <= CardType.ERA_WALK) || // 54
      (card.SubType >= CardType.REVERSE_FOOL && // 56
        card.SubType <= CardType.REVERSE_WORLD) || // 77
      card.SubType === CardType.QUEEN_OF_HEARTS || // 79
      card.SubType === CardType.WILD // 80
    ) {
      const sprite = pickup.GetSprite();
      sprite.ReplaceSpritesheet(0, `gfx/cards/${pickup.SubType}.png`);
      sprite.LoadGraphics();
    }
  }
}
