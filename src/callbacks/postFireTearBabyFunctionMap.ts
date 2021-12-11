import {
  COLORS,
  GAME_FRAMES_PER_SECOND,
  getFamiliars,
  getRandomInt,
} from "isaacscript-common";
import { FADED_BLUE, FADED_YELLOW } from "../constants";
import g from "../globals";
import { TearData } from "../types/TearData";
import { getCurrentBaby, useActiveItem } from "../util";

export const postFireTearBabyFunctionMap = new Map<
  int,
  (tear: EntityTear) => void
>();

// Spider Baby
postFireTearBabyFunctionMap.set(0, (tear: EntityTear) => {
  g.run.babyCounters += 1;
  if (g.run.babyCounters === 2) {
    g.run.babyCounters = 0;

    // Every second tear spawns a spider
    g.p.ThrowBlueSpider(g.p.Position, g.p.Position);
    tear.Remove();
  }
});

// Bloat Baby
postFireTearBabyFunctionMap.set(2, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
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
postFireTearBabyFunctionMap.set(8, (tear: EntityTear) => {
  if (g.run.babyBool) {
    return;
  }

  // Spawn a new tear with a random velocity
  const seed = tear.GetDropRNG().GetSeed();
  const rotation = getRandomInt(0, 359, seed);
  const velocity = tear.Velocity.Rotated(rotation);
  g.run.babyBool = true;
  g.p.FireTear(g.p.Position, velocity, false, true, false);
  g.run.babyBool = false;
});

// Mag Baby
postFireTearBabyFunctionMap.set(18, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.METALLIC);
  tear.TearFlags |= TearFlags.TEAR_CONFUSION;
});

// Blue Baby
postFireTearBabyFunctionMap.set(30, (tear: EntityTear) => {
  // Sprinkler tears need to originate at the player
  tear.Position = g.p.Position;
});

// Long Baby
postFireTearBabyFunctionMap.set(34, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_FLAT;
});

// Green Baby
postFireTearBabyFunctionMap.set(35, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOOGER);
  tear.TearFlags |= TearFlags.TEAR_BOOGER;
});

// Super Greed Baby
postFireTearBabyFunctionMap.set(54, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_MIDAS;
});

// Mort Baby
postFireTearBabyFunctionMap.set(55, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Big Eyes Baby
postFireTearBabyFunctionMap.set(59, (tear: EntityTear) => {
  // Tears cause self-knockback
  const knockbackVelocity = tear.Velocity.mul(-0.75);
  g.p.Velocity = g.p.Velocity.add(knockbackVelocity);
});

// Mustache Baby
postFireTearBabyFunctionMap.set(66, (tear: EntityTear) => {
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

// Alien Hominid Baby
postFireTearBabyFunctionMap.set(74, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.TECH_SWORD_BEAM);
});

// Scream Baby
postFireTearBabyFunctionMap.set(81, (tear: EntityTear) => {
  useActiveItem(g.p, CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP);
  tear.Remove();
});

// Square Eyes Baby
postFireTearBabyFunctionMap.set(94, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SQUARE;
});

// Ed Baby
postFireTearBabyFunctionMap.set(100, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Aether Baby
postFireTearBabyFunctionMap.set(106, (tear: EntityTear) => {
  // Shoot 8 tears at a time
  // (we store the rotation angle inside the "babyCounters" variable)
  g.run.babyCounters += 45;
  if (g.run.babyCounters < 360) {
    const velocity = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, velocity, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// Eyemouth Baby
postFireTearBabyFunctionMap.set(111, (tear: EntityTear) => {
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
postFireTearBabyFunctionMap.set(113, (tear: EntityTear) => {
  g.p.FireTechXLaser(tear.Position, tear.Velocity, 5);
  tear.Remove();
});

// Strange Mouth Baby
postFireTearBabyFunctionMap.set(114, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_WIGGLE;
});

// Strange Shape Baby
postFireTearBabyFunctionMap.set(130, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_PULSE;
});

// Crooked Baby
postFireTearBabyFunctionMap.set(133, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(-15);
});

// Cape Baby
postFireTearBabyFunctionMap.set(152, (tear: EntityTear) => {
  // Spray tears
  const angleModifier = math.random(0, 90) - 45;
  tear.Velocity = tear.Velocity.Rotated(angleModifier);
  tear.SetColor(FADED_YELLOW, 10000, 10000, false, false);
});

// Lights Baby
postFireTearBabyFunctionMap.set(165, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
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
postFireTearBabyFunctionMap.set(185, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SLOW;
});

// Sick Baby
postFireTearBabyFunctionMap.set(187, (tear: EntityTear) => {
  g.g.Spawn(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.BLUE_FLY,
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    LocustSubtypes.LOCUST_OF_WRATH,
    tear.InitSeed,
  );
  tear.Remove();
});

// Cold Baby
postFireTearBabyFunctionMap.set(194, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_FREEZE;
  tear.SetColor(FADED_BLUE, 10000, 10000, false, false);
});

// Nice Baby
postFireTearBabyFunctionMap.set(197, (tear: EntityTear) => {
  g.p.FireBrimstone(tear.Velocity);
  tear.Remove();
});

// Monocle Baby
postFireTearBabyFunctionMap.set(206, (tear: EntityTear) => {
  tear.Scale *= 3;
});

// Skinny Baby
postFireTearBabyFunctionMap.set(213, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Tilt Baby
postFireTearBabyFunctionMap.set(230, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(15);
});

// Bawl Baby
postFireTearBabyFunctionMap.set(231, (tear: EntityTear) => {
  tear.CollisionDamage = g.p.Damage / 2;
});

// 8 Ball Baby
postFireTearBabyFunctionMap.set(246, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
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
postFireTearBabyFunctionMap.set(279, (tear: EntityTear) => {
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
postFireTearBabyFunctionMap.set(288, (_tear: EntityTear) => {
  useActiveItem(g.p, CollectibleType.COLLECTIBLE_BEAN);
});

// Speaker Baby
postFireTearBabyFunctionMap.set(316, (tear: EntityTear) => {
  // We mark it so that we can split it later
  if (!g.run.babyBool) {
    tear.SubType = 1;
  }
});

// Slicer Baby
postFireTearBabyFunctionMap.set(331, (tear: EntityTear) => {
  // Make the Soy Milk tears do extra damage
  tear.CollisionDamage = g.p.Damage * 3;
});

// Boxers Baby
postFireTearBabyFunctionMap.set(337, (tear: EntityTear) => {
  // Turn all tears into Knockout Drops tears
  tear.ChangeVariant(TearVariant.FIST);
  tear.TearFlags |= TearFlags.TEAR_PUNCH;
});

// X Baby
postFireTearBabyFunctionMap.set(339, (tear: EntityTear) => {
  g.run.babyCounters += 1;
  tear.Velocity = tear.Velocity.Rotated(45);
  if (g.run.babyCounters < 4) {
    g.p.FireTear(g.p.Position, tear.Velocity.Rotated(45), false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// O Baby 2
postFireTearBabyFunctionMap.set(340, (tear: EntityTear) => {
  tear.TearFlags |= TearFlags.TEAR_SPIRAL;
});

// Locust Baby
postFireTearBabyFunctionMap.set(345, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOOGER);
  tear.TearFlags |= TearFlags.TEAR_BOOGER;
});

// Mushroom Girl Baby
postFireTearBabyFunctionMap.set(361, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // Extra bomb shots
  g.run.babyCounters += 1;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    g.g.Spawn(
      EntityType.ENTITY_BOMB,
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
postFireTearBabyFunctionMap.set(364, (tear: EntityTear) => {
  // If we use "player.ShootRedCandle(tear.Velocity)",
  // the fires have enormous speed and are hard to control
  const angle = tear.Velocity.GetAngleDegrees();
  const normalizedVelocity = Vector.FromAngle(angle);
  g.p.ShootRedCandle(normalizedVelocity);
  tear.Remove();
});

// Arcade Baby
postFireTearBabyFunctionMap.set(368, (tear: EntityTear) => {
  // Changing the variant does not actually increase the damage, only the appearance
  tear.ChangeVariant(TearVariant.RAZOR);
  tear.CollisionDamage = g.p.Damage * 3;
});

// Pink Ghost Baby
postFireTearBabyFunctionMap.set(372, (tear: EntityTear) => {
  const hotPink = Color(2, 0.05, 1, 0.7, 1, 1, 1);
  tear.SetColor(hotPink, 10000, 10000, false, false);
  tear.TearFlags |= TearFlags.TEAR_CHARM;
});

// Octopus Baby
postFireTearBabyFunctionMap.set(380, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Dark Space Soldier Baby
postFireTearBabyFunctionMap.set(398, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
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
postFireTearBabyFunctionMap.set(406, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Gills Baby
postFireTearBabyFunctionMap.set(410, (tear: EntityTear) => {
  const lightCyan = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);
  tear.SetColor(lightCyan, 10000, 10000, false, false);

  // Mark that we shot this tear
  tear.SubType = 1;
});

// Little Horn Baby
postFireTearBabyFunctionMap.set(429, (tear: EntityTear) => {
  const [, baby] = getCurrentBaby();
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
postFireTearBabyFunctionMap.set(442, (tear: EntityTear) => {
  // Changing the variant does not actually increase the damage, only the appearance
  tear.ChangeVariant(TearVariant.TOOTH);
  tear.CollisionDamage = g.p.Damage * 3.2;
});

// Green Koopa Baby
postFireTearBabyFunctionMap.set(455, (tear: EntityTear) => {
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
postFireTearBabyFunctionMap.set(458, (tear: EntityTear) => {
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
  const data = tear.GetData() as unknown as TearData;
  data.Height = tear.Height;
});

// Sad Bunny Baby
postFireTearBabyFunctionMap.set(459, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Voxdog Baby
postFireTearBabyFunctionMap.set(462, (tear: EntityTear) => {
  const gameFrameCount = g.g.GetFrameCount();

  // Shockwave tears
  g.run.room.tears.push({
    frame: gameFrameCount,
    position: tear.Position,
    velocity: tear.Velocity.Normalized().mul(30),
    num: 0,
  });
  tear.Remove();
});

// Blindcursed Baby
postFireTearBabyFunctionMap.set(466, (tear: EntityTear) => {
  tear.Visible = false;
});

// Fly Baby
postFireTearBabyFunctionMap.set(469, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.GODS_FLESH);

  tear.TearFlags |= TearFlags.TEAR_PIERCING; // 1 << 1
  tear.TearFlags |= TearFlags.TEAR_SPLIT; // 1 << 6
  tear.TearFlags |= TearFlags.TEAR_WIGGLE; // 1 << 10
  tear.TearFlags |= TearFlags.TEAR_PULSE; // 1 << 25
  tear.TearFlags |= TearFlags.TEAR_BONE; // 1 << 49
});

// Headphone Baby
postFireTearBabyFunctionMap.set(470, (tear: EntityTear) => {
  // Soundwave tears
  tear.ChangeVariant(TearVariant.PUPULA);
  // We don't give it a tear flag of TEAR_FLAT because that makes it look worse
  tear.Scale *= 10;
});

// Imp Baby 2
postFireTearBabyFunctionMap.set(480, (tear: EntityTear) => {
  tear.SetColor(COLORS.Yellow, 3600, 100);
  tear.TearFlags |= TearFlags.TEAR_ACID;
});

// Cursed Pillow Baby
postFireTearBabyFunctionMap.set(487, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Pompadour Baby
postFireTearBabyFunctionMap.set(494, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.GODS_FLESH);
  tear.TearFlags |= TearFlags.TEAR_GODS_FLESH;
});

// Ill Baby
postFireTearBabyFunctionMap.set(498, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOBS_HEAD);
});

// Mern Baby
postFireTearBabyFunctionMap.set(500, (tear: EntityTear) => {
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
postFireTearBabyFunctionMap.set(504, (tear: EntityTear) => {
  const roomFrameCount = g.r.GetFrameCount();
  const roomShape = g.r.GetRoomShape();

  // Disable the mechanic after N seconds to avoid softlocks
  const softlockThresholdFrame = 30 * GAME_FRAMES_PER_SECOND;
  if (roomFrameCount >= softlockThresholdFrame) {
    return;
  }

  // Disable the mechanic in any room that would grant 2 charges
  if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
    return;
  }

  // Starts with Abel; tears come from Abel
  // Get Abel's position
  const abels = getFamiliars(FamiliarVariant.ABEL);
  if (abels.length > 0) {
    const abel = abels[0];
    tear.Position = abel.Position;
  }
});

// Master Cook Baby
postFireTearBabyFunctionMap.set(517, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.EGG);
  tear.TearFlags |= TearFlags.TEAR_EGG;
});

// Abel
postFireTearBabyFunctionMap.set(531, (tear: EntityTear) => {
  // Mark that we shot this tear
  tear.SubType = 1;
});

// Rotten Baby
postFireTearBabyFunctionMap.set(533, (tear: EntityTear) => {
  tear.Remove();
  g.p.AddBlueFlies(1, g.p.Position, undefined);
});

// Lil' Loki
postFireTearBabyFunctionMap.set(539, (tear: EntityTear) => {
  // Cross tears
  // (we store the rotation angle in the "babyCounters" variable)
  g.run.babyCounters += 90;
  if (g.run.babyCounters < 360) {
    const velocity = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, velocity, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});
