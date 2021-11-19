import { getCollectibleDevilHeartPrice } from "isaacscript-common";
import g from "../globals";
import { setRandomColor } from "../util";

export const postPickupInitBabyFunctionMap = new Map<
  int,
  (pickup: EntityPickup) => void
>();

// Lil' Baby
postPickupInitBabyFunctionMap.set(36, (pickup: EntityPickup) => {
  // Everything is tiny
  pickup.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
postPickupInitBabyFunctionMap.set(37, (pickup: EntityPickup) => {
  // Everything is giant
  // Make an exception for the 4 Golden Chests,
  // as those will be made giant before the babies effect is removed
  if (
    g.l.GetStage() !== 11 ||
    g.l.GetCurrentRoomIndex() !== g.l.GetStartingRoomIndex()
  ) {
    pickup.SpriteScale = Vector(2, 2);
  }
});

// Shopkeeper Baby
postPickupInitBabyFunctionMap.set(215, (pickup: EntityPickup) => {
  // Free items in shops
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    const roomType = g.r.GetType();
    if (
      roomType === RoomType.ROOM_SHOP || // 2
      roomType === RoomType.ROOM_ERROR // 3
    ) {
      pickup.Price = 0;
    }
  }
});

// Wizard Baby
postPickupInitBabyFunctionMap.set(253, (pickup: EntityPickup) => {
  // Make all cards and runes face-up
  if (pickup.Variant !== PickupVariant.PICKUP_TAROTCARD) {
    return;
  }

  if (
    (pickup.SubType >= Card.CARD_FOOL && // 1
      pickup.SubType <= Card.RUNE_ALGIZ) || // 39
    // Blank Rune (40) and Black Rune (41) are handled in Racing+
    pickup.SubType === Card.CARD_CHAOS || // 42
    // Credit Card (43) has a unique card back in vanilla
    pickup.SubType === Card.CARD_RULES || // 44
    // A Card Against Humanity (45) has a unique card back in vanilla
    pickup.SubType === Card.CARD_SUICIDE_KING || // 46
    pickup.SubType === Card.CARD_GET_OUT_OF_JAIL || // 47
    // (Get out of Jail Free Card has a unique card back in vanilla, but this one looks better)
    pickup.SubType === Card.CARD_QUESTIONMARK || // 48
    // Dice Shard (49) has a unique card back in vanilla
    // Emergency Contact (50) has a unique card back in vanilla
    // Holy Card (51) has a unique card back in vanilla
    (pickup.SubType >= Card.CARD_HUGE_GROWTH && // 52
      pickup.SubType <= Card.CARD_ERA_WALK) // 54
  ) {
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(0, `gfx/cards/${pickup.SubType}.png`);
    sprite.LoadGraphics();
  }
});

// Scary Baby
postPickupInitBabyFunctionMap.set(317, (pickup: EntityPickup) => {
  // Items cost hearts
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    pickup.AutoUpdatePrice = false;
    pickup.Price = getCollectibleDevilHeartPrice(pickup.SubType, g.p);
  }
});

// 404 Baby
postPickupInitBabyFunctionMap.set(463, (pickup: EntityPickup) => {
  setRandomColor(pickup);
});

// Demon Baby
postPickupInitBabyFunctionMap.set(527, (pickup: EntityPickup) => {
  // Free devil deals
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    const roomType = g.r.GetType();
    if (
      roomType === RoomType.ROOM_DEVIL || // 14
      roomType === RoomType.ROOM_BLACK_MARKET // 22
    ) {
      pickup.Price = 0;
    }
  }
});

// Fate's Reward
postPickupInitBabyFunctionMap.set(537, (pickup: EntityPickup) => {
  // Items cost money
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    const roomType = g.r.GetType();
    if (
      roomType === RoomType.ROOM_DEVIL || // 14
      roomType === RoomType.ROOM_BLACK_MARKET // 22
    ) {
      pickup.AutoUpdatePrice = false;
    }
    if (pickup.Price <= 0) {
      pickup.Price = 15;
    }
  }
});
