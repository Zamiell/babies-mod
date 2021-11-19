import g from "../globals";
import { getItemHeartPrice, incrementRNG } from "../util";

export const postPickupUpdateBabyFunctionMap = new Map<
  int,
  (pickup: EntityPickup) => void
>();

// Bugeyed Baby
postPickupUpdateBabyFunctionMap.set(131, (pickup: EntityPickup) => {
  // Change pickups into Blue Spiders
  // (this cannot be in the PostPickupInit callback since the pickups do not have position there)
  if (
    pickup.FrameCount === 1 && // Frame 0 does not work
    pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE && // 100
    pickup.Variant !== PickupVariant.PICKUP_SHOPITEM && // 150
    pickup.Variant !== PickupVariant.PICKUP_BIGCHEST && // 340
    pickup.Variant !== PickupVariant.PICKUP_TROPHY && // 370
    pickup.Variant !== PickupVariant.PICKUP_BED && // 380
    pickup.Price === 0 // We don't want it to affect shop items
  ) {
    pickup.Remove();
    for (let i = 0; i < 3; i++) {
      // We want to space out the spiders so that you can see each individual one
      const position = Vector(
        pickup.Position.X + 15 * i,
        pickup.Position.X + 15 * i,
      );
      g.p.ThrowBlueSpider(position, g.p.Position);
    }
  }
});

// No Arms Baby
postPickupUpdateBabyFunctionMap.set(140, (pickup: EntityPickup) => {
  if (
    pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE && // 100
    pickup.Variant !== PickupVariant.PICKUP_SHOPITEM && // 150
    pickup.Variant !== PickupVariant.PICKUP_BIGCHEST && // 340
    pickup.Variant !== PickupVariant.PICKUP_TROPHY && // 370
    pickup.Variant !== PickupVariant.PICKUP_BED // 380
  ) {
    // Make it impossible for the player to pick up this pickup
    if (pickup.EntityCollisionClass !== EntityCollisionClass.ENTCOLL_NONE) {
      pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    }

    // Make it bounce off the player if they get too close
    if (g.p.Position.Distance(pickup.Position) <= 25) {
      const x = pickup.Position.X - g.p.Position.X;
      const y = pickup.Position.Y - g.p.Position.Y;
      pickup.Velocity = Vector(x / 2, y / 2);
    }
  }
});

// Rictus Baby
postPickupUpdateBabyFunctionMap.set(154, (pickup: EntityPickup) => {
  if (
    pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE && // 100
    pickup.Variant !== PickupVariant.PICKUP_SHOPITEM && // 150
    pickup.Variant !== PickupVariant.PICKUP_BIGCHEST && // 340
    pickup.Variant !== PickupVariant.PICKUP_TROPHY && // 370
    pickup.Variant !== PickupVariant.PICKUP_BED && // 380
    pickup.Price === 0 && // We don't want it to affect shop items
    pickup.Position.Distance(g.p.Position) <= 80
  ) {
    // Scared pickups
    let velocity = pickup.Position.sub(g.p.Position);
    velocity = velocity.Normalized();
    velocity = velocity.mul(8);
    pickup.Velocity = velocity;
  }
});

// Spike Baby
postPickupUpdateBabyFunctionMap.set(166, (pickup: EntityPickup) => {
  const data = pickup.GetData();
  if (
    // Frame 0 does not work and frame 1 interferes with Racing+ replacement code
    pickup.FrameCount === 2 &&
    (pickup.Variant === PickupVariant.PICKUP_CHEST || // 50
      pickup.Variant === PickupVariant.PICKUP_BOMBCHEST || // 51
      pickup.Variant === PickupVariant.PICKUP_ETERNALCHEST || // 53
      pickup.Variant === PickupVariant.PICKUP_LOCKEDCHEST || // 60
      pickup.Variant === PickupVariant.PICKUP_REDCHEST) && // 360
    // Racing+ will change some Spiked Chests / Mimic Chests to normal chests
    // to prevent unavoidable damage in rooms with a 1x1 path
    // It will set "data.unavoidableReplacement = true" when it does this
    data.unavoidableReplacement === undefined
  ) {
    // Replace all chests with Mimics (5.54)
    // (this does not work in the PostPickupSelection callback because
    // the chest will not initialize properly for some reason)
    // (this does not work in the PostPickupInit callback because the position is not initialized)
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_MIMICCHEST,
      pickup.Position,
      pickup.Velocity,
      pickup.Parent,
      0,
      pickup.InitSeed,
    );
    pickup.Remove();
  } else if (
    pickup.Variant === PickupVariant.PICKUP_SPIKEDCHEST &&
    pickup.SubType === 0 // SubType of 0 is open and 1 is closed
  ) {
    // Replace the contents of the chest with an item
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      pickup.Position,
      Vector.Zero,
      undefined,
      0,
      pickup.InitSeed,
    );
    pickup.Remove();
  }
});

// Aban Baby
postPickupUpdateBabyFunctionMap.set(177, (pickup: EntityPickup) => {
  if (pickup.Variant !== PickupVariant.PICKUP_COIN) {
    return;
  }

  const data = pickup.GetData();
  if (
    data.touched !== undefined || // Don't mess with coins anymore after we have picked them up
    data.recovery === undefined // We only want to target manually spawned coins
  ) {
    return;
  }

  const sprite = pickup.GetSprite();
  if (pickup.FrameCount <= 60) {
    // Make it impossible for the player to pick up this pickup
    if (pickup.EntityCollisionClass !== EntityCollisionClass.ENTCOLL_NONE) {
      pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    }

    // Make it bounce off the player if they get too close
    if (g.p.Position.Distance(pickup.Position) <= 25) {
      const x = pickup.Position.X - g.p.Position.X;
      const y = pickup.Position.Y - g.p.Position.Y;
      pickup.Velocity = Vector(x / 2, y / 2);
    }

    // Play the custom "Blink" animation
    if (!sprite.IsPlaying("Blink")) {
      sprite.Play("Blink", true);
    }
  } else {
    // The coin has been spawned for a while, so set the collision back to normal
    if (pickup.EntityCollisionClass !== EntityCollisionClass.ENTCOLL_ALL) {
      pickup.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL;
    }

    // Stop the custom "Blink" animation
    if (!sprite.IsPlaying("Idle")) {
      sprite.Play("Idle", true);
    }

    // Make it start to fade away
    const color = pickup.GetColor();
    const fadeAmount = 1 - (pickup.FrameCount - 60) * 0.01;
    if (fadeAmount <= 0) {
      pickup.Remove();
    } else {
      const newColor = Color(
        color.R,
        color.G,
        color.B,
        fadeAmount,
        color.RO,
        color.GO,
        color.BO,
      );
      pickup.SetColor(newColor, 0, 0, true, true);
    }
  }
});

// Fancy Baby
postPickupUpdateBabyFunctionMap.set(216, (pickup: EntityPickup) => {
  const currentRoomIndex = g.l.GetCurrentRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  if (
    pickup.Variant === PickupVariant.PICKUP_HEART &&
    pickup.SubType === HeartSubType.HEART_FULL &&
    pickup.Price === 3 &&
    currentRoomIndex === startingRoomIndex
  ) {
    // Delete the rerolled teleports
    pickup.Remove();
  }
});

// Suit Baby
postPickupUpdateBabyFunctionMap.set(287, (pickup: EntityPickup) => {
  // Ignore some select special rooms
  const roomType = g.r.GetType();
  if (
    roomType === RoomType.ROOM_DEFAULT || // 1
    roomType === RoomType.ROOM_ERROR || // 3
    roomType === RoomType.ROOM_BOSS || // 5
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL || // 15
    roomType === RoomType.ROOM_DUNGEON || // 16
    roomType === RoomType.ROOM_BOSSRUSH || // 17
    roomType === RoomType.ROOM_BLACK_MARKET // 22
  ) {
    return;
  }

  // All special rooms are Devil Rooms
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    // If the price is not correct, update it
    // (we have to check on every frame in case the health situation changes)
    const price = getItemHeartPrice(pickup.SubType);
    if (pickup.Price !== price) {
      pickup.AutoUpdatePrice = false;
      pickup.Price = price;
    }
  } else if (
    pickup.Variant === PickupVariant.PICKUP_HEART &&
    pickup.SubType === HeartSubType.HEART_FULL &&
    pickup.Price === 3
  ) {
    // Rerolled items turn into hearts since this is a not an actual Devil Room,
    // so delete the heart and manually create another pedestal item
    g.run.room.RNG = incrementRNG(g.run.room.RNG);
    const item = g.itemPool.GetCollectible(
      ItemPoolType.POOL_DEVIL,
      true,
      g.run.room.RNG,
    );
    const pedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        pickup.Position,
        Vector.Zero,
        undefined,
        item,
        pickup.InitSeed,
      )
      .ToPickup();
    if (pedestal !== undefined) {
      // Set the price
      pedestal.AutoUpdatePrice = false;
      pedestal.Price = getItemHeartPrice(pedestal.SubType);
    }

    // Remove the heart
    pickup.Remove();
  }
});

// Scary Baby
postPickupUpdateBabyFunctionMap.set(317, (pickup: EntityPickup) => {
  const roomType = g.r.GetType();

  // Items cost hearts
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    // If the price is not correct, update it
    // (we have to check on every frame in case the health situation changes)
    const price = getItemHeartPrice(pickup.SubType);
    if (pickup.Price !== price) {
      pickup.AutoUpdatePrice = false;
      pickup.Price = price;
    }
  } else if (
    pickup.Variant === PickupVariant.PICKUP_HEART &&
    pickup.SubType === HeartSubType.HEART_FULL &&
    pickup.Price === 3 &&
    roomType !== RoomType.ROOM_SHOP
  ) {
    // Rerolled items turn into hearts since we are not in a Devil Room,
    // so delete the heart and manually create another pedestal item
    const pedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        pickup.Position,
        Vector.Zero,
        undefined,
        0,
        pickup.InitSeed,
      )
      .ToPickup();
    if (pedestal !== undefined) {
      // Set the price
      pedestal.AutoUpdatePrice = false;
      pedestal.Price = getItemHeartPrice(pedestal.SubType);
    }

    // Remove the heart
    pickup.Remove();
  }
});

// Orange Pig Baby
postPickupUpdateBabyFunctionMap.set(381, (pickup: EntityPickup) => {
  const gameFrameCount = g.g.GetFrameCount();
  const isFirstVisit = g.r.IsFirstVisit();

  // Double items
  // (we can't do this in the PostPickupInit callback because the position is not set)
  if (
    pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE &&
    isFirstVisit &&
    // Frame 0 does not work
    // Frame 1 works but we need to wait an extra frame for Racing+ to replace the pedestal
    pickup.FrameCount === 2 &&
    pickup.State !== 2 && // We mark a state of 2 to indicate a duplicated pedestal
    (g.run.babyCountersRoom === 0 || g.run.babyCountersRoom === gameFrameCount)
  ) {
    const position = g.r.FindFreePickupSpawnPosition(pickup.Position, 1, true);
    g.run.randomSeed = incrementRNG(g.run.randomSeed);
    const pedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        Vector.Zero,
        undefined,
        0,
        g.run.randomSeed,
      )
      .ToPickup();
    if (pedestal !== undefined) {
      // We don't want it to automatically be bought
      pedestal.Price = pickup.Price;
      // We want it to keep the behavior of the room
      pedestal.OptionsPickupIndex = pickup.OptionsPickupIndex;
      // Mark it so that we don't duplicate it again
      pedestal.State = 2;
    }

    // We only want to duplicate pedestals once per room to avoid duplicating rerolled pedestals
    // (the state will go back to 0 for a rerolled pedestal)
    g.run.babyCountersRoom = gameFrameCount;
  }
});

// Cowboy Baby
postPickupUpdateBabyFunctionMap.set(394, (pickup: EntityPickup) => {
  // Pickups shoot
  if (
    pickup.FrameCount % 35 === 0 && // Every 1.17 seconds
    !pickup.GetSprite().IsPlaying("Collect") // Don't shoot if we already picked it up
  ) {
    let velocity = g.p.Position.sub(pickup.Position);
    velocity = velocity.Normalized();
    velocity = velocity.mul(7);
    Isaac.Spawn(
      EntityType.ENTITY_PROJECTILE,
      ProjectileVariant.PROJECTILE_NORMAL,
      0,
      pickup.Position,
      velocity,
      pickup,
    );
  }
});

// Fate's Reward
postPickupUpdateBabyFunctionMap.set(537, (pickup: EntityPickup) => {
  // Rerolled items turn into hearts
  // so delete the heart and manually create another pedestal item
  const roomType = g.r.GetType();
  if (
    roomType !== RoomType.ROOM_SHOP && // 2
    roomType !== RoomType.ROOM_ERROR && // 3
    pickup.Variant === PickupVariant.PICKUP_HEART &&
    pickup.SubType === HeartSubType.HEART_FULL &&
    pickup.Price === 3
  ) {
    g.run.room.RNG = incrementRNG(g.run.room.RNG);
    const pedestal = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        pickup.Position,
        Vector.Zero,
        undefined,
        0,
        g.run.room.RNG,
      )
      .ToPickup();
    if (pedestal !== undefined) {
      pedestal.Price = 15;
    }
    pickup.Remove();
  }
});
