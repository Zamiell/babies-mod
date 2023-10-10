import {
  CardType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback, ReadonlySet } from "isaacscript-common";
import { Baby } from "../Baby";

const FACE_UP_CARD_TYPES = new ReadonlySet([
  CardType.FOOL, // 1
  CardType.MAGICIAN, // 2
  CardType.HIGH_PRIESTESS, // 3
  CardType.EMPRESS, // 4
  CardType.EMPEROR, // 5
  CardType.HIEROPHANT, // 6
  CardType.LOVERS, // 7
  CardType.CHARIOT, // 8
  CardType.JUSTICE, // 9
  CardType.HERMIT, // 10
  CardType.WHEEL_OF_FORTUNE, // 11
  CardType.STRENGTH, // 12
  CardType.HANGED_MAN, // 13
  CardType.DEATH, // 14
  CardType.TEMPERANCE, // 15
  CardType.DEVIL, // 16
  CardType.TOWER, // 17
  CardType.STARS, // 18
  CardType.MOON, // 19
  CardType.SUN, // 20
  CardType.JUDGEMENT, // 21
  CardType.WORLD, // 22
  CardType.TWO_OF_CLUBS, // 23
  CardType.TWO_OF_DIAMONDS, // 24
  CardType.TWO_OF_SPADES, // 25
  CardType.TWO_OF_HEARTS, // 26
  CardType.ACE_OF_CLUBS, // 27
  CardType.ACE_OF_DIAMONDS, // 28
  CardType.ACE_OF_SPADES, // 29
  CardType.ACE_OF_HEARTS, // 30
  CardType.JOKER, // 31
  CardType.RUNE_HAGALAZ, // 32
  CardType.RUNE_JERA, // 33
  CardType.RUNE_EHWAZ, // 34
  CardType.RUNE_DAGAZ, // 35
  CardType.RUNE_ANSUZ, // 36
  CardType.RUNE_PERTHRO, // 37
  CardType.RUNE_BERKANO, // 38
  CardType.RUNE_ALGIZ, // 39
  // - CardType.RUNE_BLANK (40) is handled in Racing+.
  // - CardType.RUNE_BLACK (41) is handled in Racing+.
  CardType.CHAOS, // 42
  // - Cardtype.CREDIT (43) has a unique card back in vanilla.
  CardType.RULES, // 44
  // - CardType.AGAINST_HUMANITY (45) has a unique card back in vanilla.
  CardType.SUICIDE_KING, // 46
  // Get out of Jail Free Card has a unique card back in vanilla, but our version looks better.
  CardType.GET_OUT_OF_JAIL_FREE, // 47
  CardType.QUESTION_MARK, // 48
  // - CardType.DICE_SHARD (49) has a unique card back in vanilla.
  // - CardType.EMERGENCY_CONTACT (50) has a unique card back in vanilla.
  // - CardType.HOLY (51) has a unique card back in vanilla.
  CardType.HUGE_GROWTH, // 52
  CardType.ANCIENT_RECALL, // 53
  CardType.ERA_WALK, // 54
  // - CardType.RUNE_SHARD (55) already has a unique sprite.
  CardType.REVERSE_FOOL, // 56
  CardType.REVERSE_MAGICIAN, // 57
  CardType.REVERSE_HIGH_PRIESTESS, // 58
  CardType.REVERSE_EMPRESS, // 59
  CardType.REVERSE_EMPEROR, // 60
  CardType.REVERSE_HIEROPHANT, // 61
  CardType.REVERSE_LOVERS, // 62
  CardType.REVERSE_CHARIOT, // 63
  CardType.REVERSE_JUSTICE, // 64
  CardType.REVERSE_HERMIT, // 65
  CardType.REVERSE_WHEEL_OF_FORTUNE, // 66
  CardType.REVERSE_STRENGTH, // 67
  CardType.REVERSE_HANGED_MAN, // 68
  CardType.REVERSE_DEATH, // 69
  CardType.REVERSE_TEMPERANCE, // 70
  CardType.REVERSE_DEVIL, // 71
  CardType.REVERSE_TOWER, // 72
  CardType.REVERSE_STARS, // 73
  CardType.REVERSE_MOON, // 74
  CardType.REVERSE_SUN, // 75
  CardType.REVERSE_JUDGEMENT, // 76
  CardType.REVERSE_WORLD, // 77
  // - CardType.CRACKED_KEY (78) already has a unique sprite.
  CardType.QUEEN_OF_HEARTS, // 79
  CardType.WILD, // 80
  // - CardType.SOUL_ISAAC (81) through CardType.SOUL_JACOB (97) already have a unique sprites.
]);

/** Most cards are face up. */
export class WizardBaby extends Baby {
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.TAROT_CARD)
  postPickupInitTarotCard(pickup: EntityPickup): void {
    const card = pickup as EntityPickupCard;

    if (FACE_UP_CARD_TYPES.has(card.SubType)) {
      const sprite = pickup.GetSprite();
      sprite.ReplaceSpritesheet(0, `gfx/cards/${pickup.SubType}.png`);
      sprite.LoadGraphics();
    }
  }
}
