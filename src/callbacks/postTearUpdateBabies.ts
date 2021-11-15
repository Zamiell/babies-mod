import g from "../globals";
import { getCurrentBaby, setRandomColor } from "../misc";
import TearData from "../types/TearData";

const functionMap = new Map<int, (tear: EntityTear) => void>();
export default functionMap;

// Ed Baby
functionMap.set(100, (tear: EntityTear) => {
  // Fire trail tears
  if (tear.SubType === 1 && tear.FrameCount % 2 === 0) {
    const fire = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.HOT_BOMB_FIRE,
      0,
      tear.Position,
      Vector.Zero,
      undefined,
    );
    fire.SpriteScale = Vector(0.5, 0.5);

    // Fade the fire so that it is easier to see everything
    const color = fire.GetColor();
    const fadeAmount = 0.5;
    const newColor = Color(
      color.R,
      color.G,
      color.B,
      fadeAmount,
      color.RO,
      color.GO,
      color.BO,
    );
    fire.SetColor(newColor, 0, 0, true, true);
  }
});

// Skinny Baby
functionMap.set(213, (tear: EntityTear) => {
  if (tear.SubType === 1 && tear.FrameCount >= 10) {
    // Find the nearest enemy
    let distance = 40000;
    let closestNPC: EntityNPC | undefined;
    for (const entity of Isaac.GetRoomEntities()) {
      const npc = entity.ToNPC();
      if (
        npc !== undefined &&
        npc.IsVulnerableEnemy() && // Returns true for enemies that can be damaged
        !npc.IsDead() &&
        g.p.Position.Distance(npc.Position) < distance
      ) {
        distance = g.p.Position.Distance(npc.Position);
        closestNPC = npc;
      }
    }
    if (closestNPC === undefined) {
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
functionMap.set(228, (tear: EntityTear) => {
  // Abel's tears hurt you
  if (
    tear.FrameCount === 1 &&
    tear.SpawnerType === EntityType.ENTITY_FAMILIAR &&
    tear.SpawnerVariant === FamiliarVariant.ABEL
  ) {
    if (g.r.GetFrameCount() >= 30) {
      // Abel is spawned on top of the player when the player first enters a room;
      // don't shoot if this is the case
      g.g.Spawn(
        EntityType.ENTITY_PROJECTILE,
        ProjectileVariant.PROJECTILE_NORMAL,
        tear.Position,
        tear.Velocity,
        undefined,
        0,
        tear.InitSeed,
      );
    }
    tear.Remove();
  }
});

// 8 Ball Baby
functionMap.set(246, (tear: EntityTear) => {
  // Orbiting tears
  if (tear.SubType !== 1) {
    return;
  }

  const [, baby] = getCurrentBaby();
  if (baby.distance === undefined) {
    error(`The "distance" attribute was not defined for ${baby.name}.`);
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
functionMap.set(292, (tear: EntityTear) => {
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
functionMap.set(316, (tear: EntityTear) => {
  if (tear.SubType === 1 && tear.FrameCount >= 20) {
    let rotation = 45;
    for (let i = 0; i < 4; i++) {
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
    }
    tear.Remove();
  }
});

// Octopus Baby
functionMap.set(380, (tear: EntityTear) => {
  if (
    tear.SubType === 1 &&
    g.g.GetFrameCount() % 5 === 0 // If we spawn creep on every frame, it becomes too thick
  ) {
    // Make the tear drip black creep
    const creep = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.PLAYER_CREEP_BLACK,
      0,
      tear.Position,
      Vector.Zero,
      tear,
    ).ToEffect();
    if (creep !== undefined) {
      creep.Timeout = 240;
    }
  }
});

// Cylinder Baby
functionMap.set(434, (tear: EntityTear) => {
  tear.SpriteScale = Vector(tear.SpriteScale.X + 0.1, tear.SpriteScale.Y + 0.1);
});

// Green Koopa Baby
functionMap.set(455, (tear: EntityTear) => {
  if (tear.SubType !== 1) {
    return;
  }

  // Every 4 seconds
  if (tear.FrameCount <= 120) {
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
functionMap.set(458, (tear: EntityTear) => {
  if (tear.SubType !== 1) {
    return;
  }

  // Every 4 seconds
  if (tear.FrameCount <= 120) {
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
functionMap.set(459, (tear: EntityTear) => {
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

// 404 Baby
functionMap.set(463, (tear: EntityTear) => {
  if (tear.FrameCount === 0) {
    setRandomColor(tear);
  }
});

// Cursed Pillow Baby
functionMap.set(487, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
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
functionMap.set(522, (tear: EntityTear) => {
  if (tear.SubType !== 1) {
    return;
  }

  // This tear is supposed to be attached to the knife
  const knives = Isaac.FindByType(EntityType.ENTITY_KNIFE);
  if (knives.length > 0) {
    const knife = knives[0];
    tear.Height = -10; // Keep it in the air forever
    tear.Position = knife.Position;
    tear.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    tear.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE;
  }
});

// Abel
functionMap.set(531, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
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
