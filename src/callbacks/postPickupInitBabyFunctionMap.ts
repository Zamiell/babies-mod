import {
  Card,
  CollectibleType,
  LevelStage,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  getCollectibleDevilHeartPrice,
  inStartingRoom,
  setEntityRandomColor,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

export const postPickupInitBabyFunctionMap = new Map<
  RandomBabyType,
  (pickup: EntityPickup) => void
>();

// 514
postPickupInitBabyFunctionMap.set(
  RandomBabyType.LIL,
  (pickup: EntityPickup) => {
    // Everything is tiny
    pickup.SpriteScale = Vector(0.5, 0.5);
  },
);

// 37
postPickupInitBabyFunctionMap.set(
  RandomBabyType.BIG,
  (pickup: EntityPickup) => {
    const stage = g.l.GetStage();

    // Make an exception for the 4 Golden Chests, as those will be made giant before the babies
    // effect is removed.
    if (stage === LevelStage.DARK_ROOM_CHEST && inStartingRoom()) {
      return;
    }

    // Everything is giant
    pickup.SpriteScale = Vector(2, 2);
  },
);

// 42
postPickupInitBabyFunctionMap.set(
  RandomBabyType.COLORFUL,
  (pickup: EntityPickup) => {
    setEntityRandomColor(pickup);
  },
);

// 215
postPickupInitBabyFunctionMap.set(
  RandomBabyType.SHOPKEEPER,
  (pickup: EntityPickup) => {
    // Free items in shops.
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      const roomType = g.r.GetType();
      if (
        roomType === RoomType.SHOP || // 2
        roomType === RoomType.ERROR // 3
      ) {
        pickup.Price = 0;
      }
    }
  },
);

// 253
postPickupInitBabyFunctionMap.set(
  RandomBabyType.WIZARD,
  (pickup: EntityPickup) => {
    // Make all cards and runes face-up.
    if (pickup.Variant !== PickupVariant.TAROT_CARD) {
      return;
    }

    const card = pickup as EntityPickupCard;

    if (
      (card.SubType >= Card.FOOL && // 1
        card.SubType <= Card.RUNE_ALGIZ) || // 39
      // Blank Rune (40) and Black Rune (41) are handled in Racing+.
      card.SubType === Card.CHAOS || // 42
      // Credit Card (43) has a unique card back in vanilla.
      card.SubType === Card.RULES || // 44
      // A Card Against Humanity (45) has a unique card back in vanilla.
      card.SubType === Card.SUICIDE_KING || // 46
      card.SubType === Card.GET_OUT_OF_JAIL_FREE || // 47
      // (Get out of Jail Free Card has a unique card back in vanilla, but this one looks better.)
      card.SubType === Card.QUESTION_MARK || // 48
      // Dice Shard (49) has a unique card back in vanilla Emergency Contact (50) has a unique card
      // back in vanilla Holy Card (51) has a unique card back in vanilla.
      (card.SubType >= Card.HUGE_GROWTH && // 52
        card.SubType <= Card.ERA_WALK) || // 54
      (card.SubType >= Card.REVERSE_FOOL && // 56
        card.SubType <= Card.REVERSE_WORLD) || // 77
      card.SubType === Card.QUEEN_OF_HEARTS || // 79
      card.SubType === Card.WILD // 80
    ) {
      const sprite = pickup.GetSprite();
      sprite.ReplaceSpritesheet(0, `gfx/cards/${pickup.SubType}.png`);
      sprite.LoadGraphics();
    }
  },
);

// 317
postPickupInitBabyFunctionMap.set(
  RandomBabyType.SCARY,
  (pickup: EntityPickup) => {
    // Items cost hearts
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      pickup.AutoUpdatePrice = false;
      pickup.Price = getCollectibleDevilHeartPrice(
        pickup.SubType as CollectibleType,
        g.p,
      );
    }
  },
);

// 566
postPickupInitBabyFunctionMap.set(
  RandomBabyType.DEMON,
  (pickup: EntityPickup) => {
    // Free devil deals
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      const roomType = g.r.GetType();
      if (
        roomType === RoomType.DEVIL || // 14
        roomType === RoomType.BLACK_MARKET // 22
      ) {
        pickup.Price = 0;
      }
    }
  },
);

// 576
postPickupInitBabyFunctionMap.set(
  RandomBabyType.FATES_REWARD,
  (pickup: EntityPickup) => {
    // Items cost money
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      pickup.AutoUpdatePrice = false;
      pickup.Price = 15;
    }
  },
);
