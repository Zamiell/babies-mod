import {
  copyColor,
  GAME_FRAMES_PER_SECOND,
  getKnives,
  getNPCs,
  repeat,
  setEntityRandomColor,
  spawnEffect,
  spawnProjectile,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../babies";
import g from "../globals";
import { TearData } from "../types/TearData";
import { getCurrentBaby } from "../utils";

export const postTearUpdateBabyFunctionMap = new Map<
  int,
  (tear: EntityTear) => void
>();

// Colorful Baby
postTearUpdateBabyFunctionMap.set(42, (tear: EntityTear) => {
  if (tear.FrameCount === 0) {
    setEntityRandomColor(tear);
  }
});

// Ed Baby
postTearUpdateBabyFunctionMap.set(100, (tear: EntityTear) => {
  // Fire trail tears
  if (tear.SubType === 1 && tear.FrameCount % 2 === 0) {
    const fire = spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, tear.Position);
    fire.SpriteScale = Vector(0.5, 0.5);

    // Fade the fire so that it is easier to see everything
    const color = fire.GetColor();
    const fadeAmount = 0.5;
    const newColor = copyColor(color);
    newColor.A = fadeAmount;
    fire.SetColor(newColor, 0, 0, true, true);
  }
});

// Skinny Baby
postTearUpdateBabyFunctionMap.set(213, (tear: EntityTear) => {
  if (tear.SubType === 1 && tear.FrameCount >= 10) {
    // Find the nearest alive & vulnerable enemy
    let closestNPC: EntityNPC | null = null;
    let closestDistance = math.huge;
    for (const npc of getNPCs()) {
      const distance = npc.Position.Distance(g.p.Position);
      if (
        npc.IsVulnerableEnemy() &&
        !npc.IsDead() &&
        distance < closestDistance
      ) {
        closestNPC = npc;
        closestDistance = g.p.Position.Distance(npc.Position);
      }
    }
    if (closestNPC === null) {
      return;
    }

    // Super homing tears
    const initialSpeed = tear.Velocity.LengthSquared();
    tear.Velocity = closestNPC.Position.sub(tear.Position);
    tear.Velocity = tear.Velocity.Normalized();
    while (tear.Velocity.LengthSquared() < initialSpeed) {
      tear.Velocity = tear.Velocity.mul(1.1);
    }
  }
});

// Hanger Baby
postTearUpdateBabyFunctionMap.set(228, (tear: EntityTear) => {
  const roomFrameCount = g.r.GetFrameCount();

  // Abel's tears hurt you
  if (
    tear.FrameCount === 1 &&
    tear.SpawnerType === EntityType.ENTITY_FAMILIAR &&
    tear.SpawnerVariant === FamiliarVariant.ABEL
  ) {
    if (roomFrameCount >= 30) {
      // Abel is spawned on top of the player when the player first enters a room;
      // don't shoot if this is the case
      spawnProjectile(
        tear.Variant,
        tear.SubType,
        tear.Position,
        tear.Velocity,
        tear.SpawnerEntity,
        tear.InitSeed,
      );
    }
    tear.Remove();
  }
});

// 8 Ball Baby
postTearUpdateBabyFunctionMap.set(246, (tear: EntityTear) => {
  // Orbiting tears
  if (tear.SubType !== 1) {
    return;
  }

  const [, baby] = getCurrentBaby();
  if (baby.distance === undefined) {
    error(`The "distance" attribute was not defined for: ${baby.name}`);
  }
  let positionMod = Vector(0, baby.distance * -1); // The tear starts directly above the player
  const degrees = tear.FrameCount * 8; // Tears rotate 4 degrees per frame
  positionMod = positionMod.Rotated(degrees);
  tear.Position = g.p.Position.add(positionMod);

  // We want the tear to be moving perpendicular to the line between the player and the tear
  tear.Velocity = Vector(baby.distance / 4, 0);
  tear.Velocity = tear.Velocity.Rotated(degrees);

  // Keep it in the air for a while
  if (tear.FrameCount < 150) {
    tear.FallingSpeed = 0;
  }
});

// Lantern Baby
postTearUpdateBabyFunctionMap.set(292, (tear: EntityTear) => {
  // Emulate having a Godhead aura
  if (
    tear.Parent !== undefined &&
    tear.Parent.Type === EntityType.ENTITY_PLAYER
  ) {
    tear.Position = Vector(g.p.Position.X, g.p.Position.Y + 10);

    // Clear the sprite for the Ludo tear
    tear.GetSprite().Reset();
  }
});

// Speaker Baby
postTearUpdateBabyFunctionMap.set(316, (tear: EntityTear) => {
  // X splitting tears
  if (tear.SubType !== 1 || tear.FrameCount < 20) {
    return;
  }

  tear.Remove();

  let rotation = 45;
  repeat(4, () => {
    rotation += 90;
    const rotatedVelocity = tear.Velocity.Rotated(rotation);
    g.run.babyBool = true;
    const xTear = g.p.FireTear(
      g.p.Position,
      rotatedVelocity,
      false,
      true,
      false,
    );
    g.run.babyBool = false;
    xTear.Position = tear.Position;
    xTear.Height = tear.Height;
  });
});

// Slicer Baby
postTearUpdateBabyFunctionMap.set(331, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  const sprite = tear.GetSprite();
  const opacity = 1 - tear.FrameCount / baby.num;
  const faded = copyColor(sprite.Color);
  faded.A = opacity;
  sprite.Color = faded;

  // Slice tears
  if (tear.FrameCount > baby.num) {
    tear.Remove();
  }
});

// Octopus Baby
postTearUpdateBabyFunctionMap.set(380, (tear: EntityTear) => {
  const gameFrameCount = g.g.GetFrameCount();

  if (
    tear.SubType === 1 &&
    gameFrameCount % 5 === 0 // If we spawn creep on every frame, it becomes too thick
  ) {
    // Make the tear drip black creep
    const creep = spawnEffect(
      EffectVariant.PLAYER_CREEP_BLACK,
      0,
      tear.Position,
      VectorZero,
      tear,
    );
    creep.Timeout = 240;
  }
});

// Cylinder Baby
postTearUpdateBabyFunctionMap.set(434, (tear: EntityTear) => {
  tear.SpriteScale = Vector(tear.SpriteScale.X + 0.1, tear.SpriteScale.Y + 0.1);
});

// Green Koopa Baby
postTearUpdateBabyFunctionMap.set(455, (tear: EntityTear) => {
  if (tear.SubType !== 1) {
    return;
  }

  if (tear.FrameCount <= 4 * GAME_FRAMES_PER_SECOND) {
    // The PostTearUpdate callback will fire before the PostFireTear callback,
    // so do nothing if we are in on the first frame
    const data = tear.GetData();
    if (data.Height === undefined || data.Velocity === undefined) {
      return;
    }
    const tearData = data as unknown as TearData;

    // If the tear bounced, then we need to update the stored velocity to the new velocity
    // ("tear.Bounce" does not ever seem to go to true, so we can't use that)
    if (
      (tear.Velocity.X > 0 && tearData.Velocity.X < 0) ||
      (tear.Velocity.X < 0 && tearData.Velocity.X > 0) ||
      (tear.Velocity.Y > 0 && tearData.Velocity.Y < 0) ||
      (tear.Velocity.Y < 0 && tearData.Velocity.Y > 0)
    ) {
      tearData.Velocity = tear.Velocity;
    }

    // Continue to apply the initial tear conditions for the duration of the tear
    tear.Height = tearData.Height;
    tear.Velocity = tearData.Velocity;
  } else {
    // The tear has lived long enough, so manually kill it
    tear.Remove();
  }
});

// Red Koopa Baby
postTearUpdateBabyFunctionMap.set(458, (tear: EntityTear) => {
  if (tear.SubType !== 1) {
    return;
  }

  if (tear.FrameCount <= 4 * GAME_FRAMES_PER_SECOND) {
    // The PostTearUpdate callback will fire before the PostFireTear callback,
    // so do nothing if we are in on the first frame
    const data = tear.GetData();
    if (data.Height === undefined) {
      return;
    }
    const tearData = data as unknown as TearData;

    // Continue to apply the initial tear conditions for the duration of the tear
    tear.Height = tearData.Height;

    // However, we can't apply a static velocity or else the shells won't home
    tear.Velocity = tear.Velocity.Normalized();
    tear.Velocity = tear.Velocity.mul(10);
  } else {
    // The tear has lived long enough, so manually kill it
    tear.Remove();
  }
});

// Sad Bunny Baby
postTearUpdateBabyFunctionMap.set(459, (tear: EntityTear) => {
  if (
    tear.SubType === 1 &&
    // Tears will not die if they hit an enemy, but they will die if they hit a wall or object
    tear.IsDead()
  ) {
    // The streak ended
    g.run.babyCounters = 0;
    g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    g.p.EvaluateItems();
  }
});

// Headphone Baby
postTearUpdateBabyFunctionMap.set(470, (tear: EntityTear) => {
  if (tear.FrameCount !== 1) {
    return;
  }

  // Soundwave tears (2/2)
  tear.Visible = true;
});

// Cursed Pillow Baby
postTearUpdateBabyFunctionMap.set(487, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (
    tear.SubType === 1 &&
    // Tears will not die if they hit an enemy, but they will die if they hit a wall or object
    tear.IsDead()
  ) {
    // Missing tears causes damage
    // It only applies to the Nth missed tear
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      g.p.TakeDamage(1, 0, EntityRef(g.p), 0);
    }
  }
});

// Brother Bobby
postTearUpdateBabyFunctionMap.set(
  RandomBabyType.BROTHER_BOBBY,
  (tear: EntityTear) => {
    if (tear.SubType !== 1) {
      return;
    }

    // This tear is supposed to be attached to the knife
    const knives = getKnives();
    if (knives.length > 0) {
      const knife = knives[0];
      tear.Height = -10; // Keep it in the air forever
      tear.Position = knife.Position;
      tear.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
      tear.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE;
    }
  },
);

// Abel
postTearUpdateBabyFunctionMap.set(RandomBabyType.ABEL, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  if (
    tear.SubType === 1 &&
    // Tears will not die if they hit an enemy, but they will die if they hit a wall or object
    tear.IsDead()
  ) {
    // Missing tears causes Paralysis
    // It only applies to the Nth missed tear
    g.run.babyCounters += 1;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      g.p.UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL);
      // (we can't cancel the animation or it will cause a bug where the player cannot pick up
      // pedestal items)
    }
  }
});
