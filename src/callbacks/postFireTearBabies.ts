import g from "../globals";
import * as misc from "../misc";
import TearData from "../types/TearData";

const functionMap = new Map<int, (tear: EntityTear) => void>();
export default functionMap;

// Bloat Baby
functionMap.set(2, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    tear.ChangeVariant(TearVariant.NEEDLE);
    tear.TearFlags |= TearFlags.TEAR_NEEDLE;
  }
});

// Cockeyed Baby
functionMap.set(8, (tear: EntityTear) => {
  if (g.run.babyBool) {
    return;
  }

  // Spawn a new tear with a random velocity
  const seed = tear.GetDropRNG().GetSeed();
  math.randomseed(seed);
  const rotation = math.random(1, 359);
  const vel = tear.Velocity.Rotated(rotation);
  g.run.babyBool = true;
  g.p.FireTear(g.p.Position, vel, false, true, false);
  g.run.babyBool = false;
});

// Mag Baby
functionMap.set(18, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.METALLIC);
  tear.TearFlags |= TearFlags.TEAR_CONFUSION;
});

// Blue Baby
functionMap.set(30, (tear: EntityTear) => {
  // Sprinkler tears need to originate at the player
  tear.Position = g.p.Position;
});

// Long Baby
functionMap.set(34, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_FLAT;
});

// Green Baby
functionMap.set(35, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOOGER);
  tear.TearFlags |= TearFlags.TEAR_BOOGER;
});

// Super Greed Baby
functionMap.set(54, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_MIDAS;
});

// Mort Baby
functionMap.set(55, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Big Eyes Baby
functionMap.set(59, (tear: EntityTear) => {
  // Tears cause self-knockback
  const knockbackVelocity = tear.Velocity.__mul(-0.75);
  g.p.Velocity = g.p.Velocity.__add(knockbackVelocity);
});

// Mustache Baby
functionMap.set(66, (tear: EntityTear) => {
  // Boomerang tears
  // We can't just use The Boomerang item because there is no way to avoid a long cooldown
  // So we spawn an effect instead
  g.g.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariant.BOOMERANG,
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    0,
    tear.InitSeed,
  );
  tear.Remove();
});

// Parasite Baby
functionMap.set(77, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BALLOON);
});

// Scream Baby
functionMap.set(81, (tear: EntityTear) => {
  g.p.UseActiveItem(
    CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP,
    false,
    false,
    false,
    false,
  );
  tear.Remove();
});

// Square Eyes Baby
functionMap.set(94, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SQUARE;
});

// Ed Baby
functionMap.set(100, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Aether Baby
functionMap.set(106, (tear: EntityTear) => {
  // Shoot 8 tears at a time
  // (we store the rotation angle inside the "babyCounters" variable)
  g.run.babyCounters += 45;
  if (g.run.babyCounters < 360) {
    const vel = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, vel, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// Eyemouth Baby
functionMap.set(111, (tear: EntityTear) => {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Shoot an extra tear every 3rd shot
  g.run.babyTears.numFired += 1;
  if (g.run.babyTears.numFired >= 4) {
    // Mark to fire a tear 1 frame from now
    g.run.babyTears.numFired = 0;
    g.run.babyTears.frame = gameFrameCount + 1;
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y);
  }
});

// V Baby
functionMap.set(113, (tear: EntityTear) => {
  g.p.FireTechXLaser(tear.Position, tear.Velocity, 5);
  tear.Remove();
});

// Strange Mouth Baby
functionMap.set(114, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_WIGGLE;
});

// Strange Shape Baby
functionMap.set(130, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_PULSE;
});

// Crooked Baby
functionMap.set(133, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(-15);
});

// Cape Baby
functionMap.set(152, (tear: EntityTear) => {
  const angleModifier = math.random(0, 90) - 45;
  tear.Velocity = tear.Velocity.Rotated(angleModifier);
  const yellow = Color(2, 2, 0, 0.7, 1, 1, 1);
  tear.SetColor(yellow, 10000, 10000, false, false);
});

// Lights Baby
functionMap.set(165, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    tear.TearFlags |= TearFlags.TEAR_LIGHT_FROM_HEAVEN;
  }
});

// Web Baby
functionMap.set(185, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SLOW;
});

// Sick Baby
functionMap.set(187, (tear: EntityTear) => {
  g.g.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_FLY,
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    BlueFlySubType.BLUEFLY_RED,
    tear.InitSeed,
  );
  tear.Remove();
});

// Cold Baby
functionMap.set(194, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_FREEZE;
  const blue = Color(0, 0, 2, 0.7, 1, 1, 1);
  tear.SetColor(blue, 10000, 10000, false, false);
});

// Nice Baby
functionMap.set(197, (tear: EntityTear) => {
  g.p.FireBrimstone(tear.Velocity);
  tear.Remove();
});

// Blindfold Baby
functionMap.set(202, (tear: EntityTear) => {
  // Starts with Incubus + blindfolded
  // (we need to manually blindfold the player so that the Incubus works properly)
  tear.Remove();
});

// Monocle Baby
functionMap.set(206, (tear: EntityTear) => {
  tear.Scale *= 3;
});

// Skinny Baby
functionMap.set(213, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Tilt Baby
functionMap.set(230, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(15);
});

// Bawl Baby
functionMap.set(231, (tear: EntityTear) => {
  tear.CollisionDamage = g.p.Damage / 2;
});

// 8 Ball Baby
functionMap.set(246, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.distance === undefined) {
    error(`The "distance" attribute was not defined for ${baby.name}.`);
  }

  // Mark that we shot this tear
  tear.SubType = 1;

  // We need to have spectral for this ability to work properly
  tear.TearFlags |= TearFlags.TEAR_SPECTRAL;

  // Start with the tears directly above the player and moving towards the right
  tear.Position = Vector(0, baby.distance * -1);
  tear.Velocity = Vector(baby.distance / 4, 0);
  tear.FallingSpeed = 0;
});

// Orange Demon Baby
functionMap.set(279, (tear: EntityTear) => {
  // Explosivo tears
  // Only do every other tear to avoid softlocks
  g.run.babyCounters += 1;
  if (g.run.babyCounters === 2) {
    g.run.babyCounters = 0;
    tear.ChangeVariant(TearVariant.EXPLOSIVO);
    tear.TearFlags |= TearFlags.TEAR_STICKY;
  }
});

// Butt Baby
functionMap.set(288, (_tear: EntityTear) => {
  g.p.UseActiveItem(
    CollectibleType.COLLECTIBLE_BEAN,
    false,
    false,
    false,
    false,
  );
});

// Speaker Baby
functionMap.set(316, (tear: EntityTear) => {
  // We mark it so that we can split it later
  if (!g.run.babyBool) {
    tear.SubType = 1;
  }
});

// Slicer Baby
functionMap.set(331, (tear: EntityTear) => {
  // Make the Soy Milk tears do extra damage
  tear.CollisionDamage = g.p.Damage * 3;
});

// Boxers Baby
functionMap.set(337, (tear: EntityTear) => {
  // Turn all tears into boxing glove / punch tears similar to Antibirth's Knockout Drops
  // Find out the size of the tear,
  // which will determine the corresponding frame/animation for the new sprite
  const sprite = tear.GetSprite();
  let tearSize = "RegularTear6"; // Use the 6th one by default
  for (let i = 0; i < 13; i++) {
    const animationName = `RegularTear${i}`;
    if (sprite.IsPlaying(animationName)) {
      tearSize = animationName;
      break;
    }
  }

  // Change the sprite
  sprite.Load("gfx/fist_tears.anm2", true);
  sprite.Play(tearSize, false);

  // By default, the sprite is facing to the right
  const tearAngle = tear.Velocity.GetAngleDegrees();
  if (
    (tearAngle > 90 && tearAngle <= 180) ||
    (tearAngle >= -180 && tearAngle < -90)
  ) {
    // If the tear is shooting to the left, then we need to rotate it and flip the sprite
    sprite.FlipY = true;
    sprite.Rotation = tearAngle * -1;
  } else {
    // If the tear is shooting to the right, then just rotate it
    sprite.Rotation = tearAngle;
  }

  // Mark it as a special tear so that we can play a sound effect later
  tear.SubType = 1;

  // Apparently, the "tear.SetKnockbackMultiplier()" function does not work,
  // so we have to set the custom knockback in the "EntityTakeDmg.Entity()" function
});

// X Baby
functionMap.set(339, (tear: EntityTear) => {
  g.run.babyCounters += 1;
  tear.Velocity = tear.Velocity.Rotated(45);
  if (g.run.babyCounters < 4) {
    g.p.FireTear(g.p.Position, tear.Velocity.Rotated(45), false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// O Baby 2
functionMap.set(340, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SPIRAL;
});

// Locust Baby
functionMap.set(345, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOOGER);
  tear.TearFlags |= TearFlags.TEAR_BOOGER;
});

// 2600 Baby
functionMap.set(347, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(180);
});

// Mushroom Girl Baby
functionMap.set(361, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Extra bomb shots
  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    g.g.Spawn(
      EntityType.ENTITY_BOMBDROP,
      BombVariant.BOMB_NORMAL,
      tear.Position,
      tear.Velocity,
      tear.SpawnerEntity,
      0,
      tear.InitSeed,
    );
    tear.Remove();
  }
});

// Turtle Dragon Baby
functionMap.set(364, (tear: EntityTear) => {
  // If we use "player.ShootRedCandle(tear.Velocity)",
  // the fires have enormous speed and are hard to control
  const angle = tear.Velocity.GetAngleDegrees();
  const normalizedVelocity = Vector.FromAngle(angle);
  g.p.ShootRedCandle(normalizedVelocity);
  tear.Remove();
});

// Arcade Baby
functionMap.set(368, (tear: EntityTear) => {
  // Changing the variant does not actually increase the damage, only the appearance
  tear.ChangeVariant(TearVariant.RAZOR);
  tear.CollisionDamage = g.p.Damage * 3;
});

// Pink Ghost Baby
functionMap.set(372, (tear: EntityTear) => {
  const hotPink = Color(2, 0.05, 1, 0.7, 1, 1, 1);
  tear.SetColor(hotPink, 10000, 10000, false, false);
  tear.TearFlags |= TearFlags.TEAR_CHARM;
});

// Octopus Baby
functionMap.set(380, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Dark Space Soldier Baby
functionMap.set(398, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    tear.ChangeVariant(TearVariant.CHAOS_CARD);
  }
});

// Astronaut Baby
functionMap.set(406, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Gills Baby
functionMap.set(410, (tear: EntityTear) => {
  const lightCyan = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);
  tear.SetColor(lightCyan, 10000, 10000, false, false);

  // Mark that we shot this tear
  tear.SubType = 1;
});

// Little Horn Baby
functionMap.set(429, (tear: EntityTear) => {
  // Local variables
  const [, baby] = misc.getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Void tears
  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    tear.TearFlags |= TearFlags.TEAR_HORN;
  }
});

// Tooth Head Baby
functionMap.set(442, (tear: EntityTear) => {
  // Changing the variant does not actually increase the damage, only the appearance
  tear.ChangeVariant(TearVariant.TOOTH);
  tear.CollisionDamage = g.p.Damage * 3.2;
});

// Green Koopa Baby
functionMap.set(455, (tear: EntityTear) => {
  // Turn all tears into green shell tears
  const sprite = tear.GetSprite();
  sprite.Load("gfx/shell_green_tears.anm2", true);
  sprite.Play("RegularTear1", false);

  // Make it bouncy
  tear.TearFlags =
    TearFlags.TEAR_BOUNCE | // 1 << 19
    TearFlags.TEAR_POP; // 1 << 56

  // Make it lower to the ground
  tear.Height = -5;

  // Mark it as a special tear so that we can keep it updated
  tear.SubType = 1;

  // Store the initial height and velocity
  const data = tear.GetData();
  data.Height = tear.Height;
  data.Velocity = tear.Velocity;
});

// Red Koopa Baby
functionMap.set(458, (tear: EntityTear) => {
  // Turn all tears into red shell tears
  const sprite = tear.GetSprite();
  sprite.Load("gfx/shell_red_tears.anm2", true);
  sprite.Play("RegularTear1", false);

  // Make it bouncy and homing
  tear.TearFlags =
    TearFlags.TEAR_HOMING | // 1 << 2
    TearFlags.TEAR_BOUNCE | // 1 << 19
    TearFlags.TEAR_POP; // 1 << 56

  // Make it lower to the ground
  tear.Height = -5;

  // Mark it as a special tear so that we can keep it updated
  tear.SubType = 1;

  // Store the initial height
  // (unlike Green Koopa Baby, we do not need to store the velocity)
  const data = (tear.GetData() as unknown) as TearData;
  data.Height = tear.Height;
});

// Sad Bunny Baby
functionMap.set(459, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Voxdog Baby
functionMap.set(462, (tear: EntityTear) => {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave tears
  g.run.room.tears.push({
    frame: gameFrameCount,
    position: tear.Position,
    velocity: tear.Velocity.Normalized().__mul(30),
    num: 0,
  });
  tear.Remove();
});

// Blindcursed Baby
functionMap.set(466, (tear: EntityTear) => {
  tear.Visible = false;
});

// Fly Baby
functionMap.set(469, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.GODS_FLESH);

  tear.TearFlags |= TearFlags.TEAR_PIERCING; // 1 << 1
  tear.TearFlags |= TearFlags.TEAR_SPLIT; // 1 << 6
  tear.TearFlags |= TearFlags.TEAR_WIGGLE; // 1 << 10
  tear.TearFlags |= TearFlags.TEAR_PULSE; // 1 << 25
  tear.TearFlags |= TearFlags.TEAR_BONE; // 1 << 49
});

// Headphone Baby
functionMap.set(470, (tear: EntityTear) => {
  // Soundwave tears
  tear.ChangeVariant(TearVariant.PUPULA);
  // We don't give it a tear flag of TEAR_FLAT because that makes it look worse
  tear.Scale *= 10;
});

// Imp Baby 2
functionMap.set(480, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_ACID;
});

// Cursed Pillow Baby
functionMap.set(487, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Pompadour Baby
functionMap.set(494, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.GODS_FLESH);
  tear.TearFlags |= TearFlags.TEAR_GODS_FLESH;
});

// Ill Baby
functionMap.set(498, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOBS_HEAD);
});

// Mern Baby
functionMap.set(500, (tear: EntityTear) => {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  g.run.babyTears.numFired += 1;
  if (g.run.babyTears.numFired >= 2) {
    // Mark to fire a tear 1 frame from now
    g.run.babyTears.numFired = 0;
    g.run.babyTears.frame = gameFrameCount + 1;
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y);
  }
});

// Psychic Baby
functionMap.set(504, (tear: EntityTear) => {
  // Starts with Abel; tears come from Abel
  if (
    g.r.GetFrameCount() < 900 && // Don't do it after 30 seconds to avoid softlocks
    g.r.GetRoomShape() < RoomShape.ROOMSHAPE_2x2 // Don't do it for any rooms bigger than a 2x1
  ) {
    // Get Abel's position
    const abels = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      FamiliarVariant.ABEL,
      -1,
      false,
      false,
    );
    if (abels.length > 0) {
      const abel = abels[0];
      tear.Position = abel.Position;
    } else {
      Isaac.DebugString("Error. Abel was not found.");
    }
  }
});

// Master Cook Baby
functionMap.set(517, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.EGG);
  tear.TearFlags |= TearFlags.TEAR_EGG;
});

// Spider Baby
functionMap.set(521, (tear: EntityTear) => {
  g.run.babyCounters += 1;
  if (g.run.babyCounters === 2) {
    g.run.babyCounters = 0;

    // Every second tear spawns a spider
    g.p.ThrowBlueSpider(g.p.Position, g.p.Position);
    tear.Remove();
  }
});

// Abel
functionMap.set(531, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Rotten Baby
functionMap.set(533, (tear: EntityTear) => {
  tear.Remove();
  g.p.AddBlueFlies(1, g.p.Position, null);
});

// Lil' Loki
functionMap.set(539, (tear: EntityTear) => {
  // Cross tears
  // (we store the rotation angle in the "babyCounters" variable)
  g.run.babyCounters += 90;
  if (g.run.babyCounters < 360) {
    const vel = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, vel, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});
