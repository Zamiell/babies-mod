import {
  CollectibleType,
  EntityCollisionClass,
  ItemPoolType,
  PickupVariant,
  ProjectileVariant,
} from "isaac-typescript-definitions";
import {
  copyColor,
  GAME_FRAMES_PER_SECOND,
  getCollectibleDevilHeartPrice,
  inStartingRoom,
  repeat,
  spawnCollectible,
  spawnPickup,
  spawnProjectile,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import {
  isRerolledCollectibleBuggedHeart,
  shouldTransformRoomType,
} from "../utils";

export const postPickupUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (pickup: EntityPickup) => void
>();

// 131
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.BUGEYED,
  (pickup: EntityPickup) => {
    // Change pickups into Blue Spiders. (This cannot be in the PostPickupInit callback since the
    // pickups do not have position there.)
    if (
      pickup.FrameCount === 1 && // Frame 0 does not work
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED && // 380
      pickup.Price === 0 // We don't want it to affect shop items
    ) {
      pickup.Remove();

      repeat(3, (i) => {
        // We want to space out the spiders so that you can see each individual one.
        const position = Vector(
          pickup.Position.X + 15 * i,
          pickup.Position.Y + 15 * i,
        );
        g.p.ThrowBlueSpider(position, g.p.Position);
      });
    }
  },
);

// 140
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.NO_ARMS,
  (pickup: EntityPickup) => {
    if (
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED // 380
    ) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (g.p.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - g.p.Position.X;
        const y = pickup.Position.Y - g.p.Position.Y;
        pickup.Velocity = Vector(x / 2, y / 2);
      }
    }
  },
);

// 154
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.RICTUS,
  (pickup: EntityPickup) => {
    if (
      pickup.Variant !== PickupVariant.COLLECTIBLE && // 100
      pickup.Variant !== PickupVariant.SHOP_ITEM && // 150
      pickup.Variant !== PickupVariant.BIG_CHEST && // 340
      pickup.Variant !== PickupVariant.TROPHY && // 370
      pickup.Variant !== PickupVariant.BED && // 380
      pickup.Price === 0 && // We don't want it to affect shop items
      pickup.Position.Distance(g.p.Position) <= 80
    ) {
      // Scared pickups
      let velocity = pickup.Position.sub(g.p.Position);
      velocity = velocity.Normalized();
      velocity = velocity.mul(8);
      pickup.Velocity = velocity;
    }
  },
);

// 158
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.PRETTY,
  (pickup: EntityPickup) => {
    const roomType = g.r.GetType();

    // Ignore some special rooms.
    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    // All special rooms are Angel Shops.
    if (isRerolledCollectibleBuggedHeart(pickup)) {
      // Rerolled items turn into hearts since this is a not an actual Devil Room, so delete the
      // heart and manually create another pedestal item.
      const seed = g.run.room.rng.Next();
      const collectibleType = g.itemPool.GetCollectible(
        ItemPoolType.ANGEL,
        true,
        seed,
      );
      const collectible = spawnCollectible(
        collectibleType,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;

      // Remove the heart.
      pickup.Remove();
    }
  },
);

// 166
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.SPIKE,
  (pickup: EntityPickup) => {
    const data = pickup.GetData();
    if (
      // Frame 0 does not work and frame 1 interferes with Racing+ replacement code.
      pickup.FrameCount === 2 &&
      (pickup.Variant === PickupVariant.CHEST || // 50
        pickup.Variant === PickupVariant.BOMB_CHEST || // 51
        pickup.Variant === PickupVariant.ETERNAL_CHEST || // 53
        pickup.Variant === PickupVariant.LOCKED_CHEST || // 60
        pickup.Variant === PickupVariant.RED_CHEST) && // 360
      // Racing+ will change some Spiked Chests / Mimic Chests to normal chests to prevent
      // unavoidable damage in rooms with a 1x1 path. It will set "data.unavoidableReplacement =
      // true" when it does this.
      data["unavoidableReplacement"] === undefined
    ) {
      // Replace all chests with Mimics (5.54). This does not work in the PostPickupSelection
      // callback because the chest will not initialize properly for some reason. This does not work
      // in the PostPickupInit callback because the position is not initialized.
      pickup.Remove();
      spawnPickup(
        PickupVariant.MIMIC_CHEST,
        0,
        pickup.Position,
        pickup.Velocity,
        pickup.Parent,
        pickup.InitSeed,
      );
    } else if (
      pickup.Variant === PickupVariant.SPIKED_CHEST &&
      pickup.SubType === 0 // SubType of 0 is open and 1 is closed
    ) {
      // Replace the contents of the chest with an item.
      pickup.Remove();
      spawnCollectible(CollectibleType.NULL, pickup.Position, pickup.InitSeed);
    }
  },
);

// 177
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.ABAN,
  (pickup: EntityPickup) => {
    if (pickup.Variant !== PickupVariant.COIN) {
      return;
    }

    const sprite = pickup.GetSprite();
    const collected = sprite.IsPlaying("Collect");
    const data = pickup.GetData();

    if (
      collected || // Don't mess with coins anymore after we have picked them up
      data["recovery"] === undefined // We only want to target manually spawned coins
    ) {
      return;
    }

    if (pickup.FrameCount <= 2 * GAME_FRAMES_PER_SECOND) {
      // Make it impossible for the player to pick up this pickup.
      if (pickup.EntityCollisionClass !== EntityCollisionClass.NONE) {
        pickup.EntityCollisionClass = EntityCollisionClass.NONE;
      }

      // Make it bounce off the player if they get too close.
      if (g.p.Position.Distance(pickup.Position) <= 25) {
        const x = pickup.Position.X - g.p.Position.X;
        const y = pickup.Position.Y - g.p.Position.Y;
        pickup.Velocity = Vector(x / 2, y / 2);
      }

      // Play the custom "Blink" animation.
      if (!sprite.IsPlaying("Blink")) {
        sprite.Play("Blink", true);
      }
    } else {
      // The coin has been spawned for a while, so set the collision back to normal.
      pickup.EntityCollisionClass = EntityCollisionClass.ALL;

      // Stop the custom "Blink" animation.
      if (!sprite.IsPlaying("Idle")) {
        sprite.Play("Idle", true);
      }

      // Make it start to fade away.
      const color = pickup.GetColor();
      const fadeAmount = 1 - (pickup.FrameCount - 60) * 0.01;
      if (fadeAmount <= 0) {
        pickup.Remove();
      } else {
        const newColor = copyColor(color);
        newColor.A = fadeAmount;
        pickup.SetColor(newColor, 0, 0, true, true);
      }
    }
  },
);

// 216
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.FANCY,
  (pickup: EntityPickup) => {
    // Can purchase teleports to special rooms.
    if (isRerolledCollectibleBuggedHeart(pickup) && inStartingRoom()) {
      // Delete the rerolled teleports.
      pickup.Remove();
    }
  },
);

// 287
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.SUIT,
  (pickup: EntityPickup) => {
    const roomType = g.r.GetType();

    // Ignore some special rooms.
    if (!shouldTransformRoomType(roomType)) {
      return;
    }

    // All special rooms are Devil Rooms.
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      // If the price is not correct, update it. (We have to check on every frame in case the health
      // situation changes.)
      const price = getCollectibleDevilHeartPrice(
        pickup.SubType as CollectibleType,
        g.p,
      );
      if (pickup.Price !== (price as int)) {
        pickup.AutoUpdatePrice = false;
        pickup.Price = price;
      }
    } else if (isRerolledCollectibleBuggedHeart(pickup)) {
      // Rerolled items turn into hearts since this is a not an actual Devil Room, so delete the
      // heart and manually create another pedestal item.
      const seed = g.run.room.rng.Next();
      const collectibleType = g.itemPool.GetCollectible(
        ItemPoolType.DEVIL,
        true,
        seed,
      );
      const collectible = spawnCollectible(
        collectibleType,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = getCollectibleDevilHeartPrice(
        collectible.SubType,
        g.p,
      );

      // Remove the heart
      pickup.Remove();
    }
  },
);

// 317
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.SCARY,
  (pickup: EntityPickup) => {
    // Items cost hearts
    if (pickup.Variant === PickupVariant.COLLECTIBLE) {
      // If the price is not correct, update it. (We have to check on every frame in case the health
      // situation changes.)
      const price = getCollectibleDevilHeartPrice(
        pickup.SubType as CollectibleType,
        g.p,
      );
      if (pickup.Price !== (price as int)) {
        pickup.AutoUpdatePrice = false;
        pickup.Price = price;
      }
    } else if (isRerolledCollectibleBuggedHeart(pickup)) {
      // Rerolled items turn into hearts since we are not in a Devil Room, so delete the heart and
      // manually create another pedestal item.
      const collectible = spawnCollectible(
        CollectibleType.NULL,
        pickup.Position,
        pickup.InitSeed,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = getCollectibleDevilHeartPrice(
        collectible.SubType,
        g.p,
      );

      // Remove the heart
      pickup.Remove();
    }
  },
);

// 381
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.ORANGE_PIG,
  (pickup: EntityPickup) => {
    const gameFrameCount = g.g.GetFrameCount();
    const isFirstVisit = g.r.IsFirstVisit();

    // Double items. We can't do this in the PostPickupInit callback because the position is not
    // set.
    if (
      pickup.Variant === PickupVariant.COLLECTIBLE &&
      isFirstVisit &&
      // Frame 0 does not work. Frame 1 works but we need to wait an extra frame for Racing+ to
      // replace the pedestal.
      pickup.FrameCount === 2 &&
      pickup.State !== 2 && // We mark a state of 2 to indicate a duplicated pedestal
      (g.run.babyCountersRoom === 0 ||
        g.run.babyCountersRoom === gameFrameCount)
    ) {
      const position = g.r.FindFreePickupSpawnPosition(
        pickup.Position,
        1,
        true,
      );
      const collectible = spawnCollectible(
        CollectibleType.NULL,
        position,
        g.run.rng,
      );

      // We don't want it to automatically be bought.
      collectible.Price = pickup.Price;

      // We want it to keep the behavior of the room.
      collectible.OptionsPickupIndex = pickup.OptionsPickupIndex;

      // Mark it so that we don't duplicate it again.
      collectible.State = 2;

      // We only want to duplicate pedestals once per room to avoid duplicating rerolled pedestals.
      // (The state will go back to 0 for a rerolled pedestal.)
      g.run.babyCountersRoom = gameFrameCount;
    }
  },
);

// 394
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.COWBOY,
  (pickup: EntityPickup) => {
    const sprite = pickup.GetSprite();
    const collected = sprite.IsPlaying("Collect");

    // Pickups shoot
    if (
      pickup.FrameCount % 35 === 0 && // Every 1.17 seconds
      !collected // Don't shoot if we already picked it up
    ) {
      const velocity = g.p.Position.sub(pickup.Position).Normalized().mul(7);
      spawnProjectile(
        ProjectileVariant.NORMAL,
        0,
        pickup.Position,
        velocity,
        pickup,
      );
    }
  },
);

// 574
postPickupUpdateBabyFunctionMap.set(
  RandomBabyType.FATES_REWARD,
  (pickup: EntityPickup) => {
    // Rerolled items turn into hearts so delete the heart and manually create another pedestal
    // item.
    if (isRerolledCollectibleBuggedHeart(pickup)) {
      pickup.Remove();

      const collectible = spawnCollectible(
        CollectibleType.NULL,
        pickup.Position,
        g.run.room.rng,
      );
      collectible.AutoUpdatePrice = false;
      collectible.Price = 15;
    }
  },
);
