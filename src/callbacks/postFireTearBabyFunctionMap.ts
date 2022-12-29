import {
  BlueFlySubType,
  BombVariant,
  CollectibleType,
  FamiliarVariant,
  RoomShape,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import {
  addFlag,
  COLORS,
  game,
  GAME_FRAMES_PER_SECOND,
  getFamiliars,
  spawnBomb,
  spawnFamiliar,
  useActiveItemTemp,
} from "isaacscript-common";
import { FADED_BLUE, FADED_RED, FADED_YELLOW } from "../constants";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { TearData } from "../types/TearData";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postFireTearBabyFunctionMap = new Map<
  RandomBabyType,
  (tear: EntityTear) => void
>();

// 81
postFireTearBabyFunctionMap.set(RandomBabyType.SCREAM, (tear: EntityTear) => {
  useActiveItemTemp(g.p, CollectibleType.SHOOP_DA_WHOOP);
  tear.Remove();
});

// 94
postFireTearBabyFunctionMap.set(
  RandomBabyType.SQUARE_EYES,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SQUARE);
  },
);

// 100
postFireTearBabyFunctionMap.set(RandomBabyType.ED, (tear: EntityTear) => {
  // Mark that we shot this tear.
  tear.SubType = 1;
});

// 106
postFireTearBabyFunctionMap.set(RandomBabyType.AETHER, (tear: EntityTear) => {
  // Shoot 8 tears at a time. (We store the rotation angle inside the "babyCounters" variable.)
  g.run.babyCounters += 45;
  if (g.run.babyCounters < 360) {
    const velocity = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, velocity, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// 111
postFireTearBabyFunctionMap.set(RandomBabyType.EYEMOUTH, (tear: EntityTear) => {
  const gameFrameCount = game.GetFrameCount();

  // Shoot an extra tear every 3rd shot.
  g.run.babyTears.numFired++;
  if (g.run.babyTears.numFired >= 4) {
    // Mark to fire a tear 1 frame from now.
    g.run.babyTears.numFired = 0;
    g.run.babyTears.frame = gameFrameCount + 1;
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y);
  }
});

// 113
postFireTearBabyFunctionMap.set(RandomBabyType.V, (tear: EntityTear) => {
  g.p.FireTechXLaser(tear.Position, tear.Velocity, 5);
  tear.Remove();
});

// 114
postFireTearBabyFunctionMap.set(
  RandomBabyType.STRANGE_MOUTH,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.WIGGLE);
  },
);

// 130
postFireTearBabyFunctionMap.set(
  RandomBabyType.STRANGE_SHAPE,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.PULSE);
  },
);

// 133
postFireTearBabyFunctionMap.set(RandomBabyType.CROOKED, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(-15);
});

// 152
postFireTearBabyFunctionMap.set(RandomBabyType.CAPE, (tear: EntityTear) => {
  // Spray tears
  const angleModifier = math.random(0, 90) - 45;
  tear.Velocity = tear.Velocity.Rotated(angleModifier);
  tear.SetColor(FADED_YELLOW, 10000, 10000, false, false);
});

// 165
postFireTearBabyFunctionMap.set(RandomBabyType.LIGHTS, (tear: EntityTear) => {
  const baby = getCurrentBabyDescription();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for: ${baby.name}`);
  }

  g.run.babyCounters++;
  if (g.run.babyCounters === baby.num) {
    g.run.babyCounters = 0;
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.LIGHT_FROM_HEAVEN);
  }
});

// 185
postFireTearBabyFunctionMap.set(RandomBabyType.WEB, (tear: EntityTear) => {
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SLOW);
});

// 187
postFireTearBabyFunctionMap.set(RandomBabyType.SICK, (tear: EntityTear) => {
  spawnFamiliar(
    FamiliarVariant.BLUE_FLY,
    BlueFlySubType.WRATH,
    tear.Position,
    tear.Velocity,
    tear.SpawnerEntity,
    tear.InitSeed,
  );
  tear.Remove();
});

// 194
postFireTearBabyFunctionMap.set(RandomBabyType.COLD, (tear: EntityTear) => {
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.FREEZE);
  tear.SetColor(FADED_BLUE, 10000, 10000, false, false);
});

// 197
postFireTearBabyFunctionMap.set(RandomBabyType.NICE, (tear: EntityTear) => {
  g.p.FireBrimstone(tear.Velocity);
  tear.Remove();
});

// 206
postFireTearBabyFunctionMap.set(RandomBabyType.MONOCLE, (tear: EntityTear) => {
  tear.Scale *= 3;
});

// 213
postFireTearBabyFunctionMap.set(RandomBabyType.SKINNY, (tear: EntityTear) => {
  // Mark that we shot this tear.
  tear.SubType = 1;
});

// 230
postFireTearBabyFunctionMap.set(RandomBabyType.TILT, (tear: EntityTear) => {
  tear.Velocity = tear.Velocity.Rotated(15);
});

// 231
postFireTearBabyFunctionMap.set(RandomBabyType.BAWL, (tear: EntityTear) => {
  tear.CollisionDamage = g.p.Damage / 2;
});

// 246
postFireTearBabyFunctionMap.set(
  RandomBabyType.EIGHT_BALL,
  (tear: EntityTear) => {
    const baby = getCurrentBabyDescription();
    if (baby.distance === undefined) {
      error(`The "distance" attribute was not defined for: ${baby.name}`);
    }

    // Mark that we shot this tear.
    tear.SubType = 1;

    // We need to have spectral for this ability to work properly.
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPECTRAL);

    // Start with the tears directly above the player and moving towards the right.
    tear.Position = Vector(0, baby.distance * -1);
    tear.Velocity = Vector(baby.distance / 4, 0);
    tear.FallingSpeed = 0;
  },
);

// 279
postFireTearBabyFunctionMap.set(
  RandomBabyType.ORANGE_DEMON,
  (tear: EntityTear) => {
    // Explosivo tears Only do every other tear to avoid softlocks.
    g.run.babyCounters++;
    if (g.run.babyCounters === 2) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.EXPLOSIVO);
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.STICKY);
    }
  },
);

// 288
postFireTearBabyFunctionMap.set(RandomBabyType.BUTT, (_tear: EntityTear) => {
  useActiveItemTemp(g.p, CollectibleType.BEAN);
});

// 316
postFireTearBabyFunctionMap.set(RandomBabyType.SPEAKER, (tear: EntityTear) => {
  // We mark it so that we can split it later.
  if (!g.run.babyBool) {
    tear.SubType = 1;
  }
});

// 331
postFireTearBabyFunctionMap.set(RandomBabyType.SLICER, (tear: EntityTear) => {
  // Make the Soy Milk tears do extra damage.
  tear.CollisionDamage = g.p.Damage * 3;
});

// 337
postFireTearBabyFunctionMap.set(RandomBabyType.BOXERS, (tear: EntityTear) => {
  // Turn all tears into Knockout Drops tears.
  tear.ChangeVariant(TearVariant.FIST);
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.PUNCH);
});

// 339
postFireTearBabyFunctionMap.set(RandomBabyType.X, (tear: EntityTear) => {
  g.run.babyCounters++;
  tear.Velocity = tear.Velocity.Rotated(45);
  if (g.run.babyCounters < 4) {
    g.p.FireTear(g.p.Position, tear.Velocity.Rotated(45), false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// 340
postFireTearBabyFunctionMap.set(RandomBabyType.O_2, (tear: EntityTear) => {
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPIRAL);
});

// 345
postFireTearBabyFunctionMap.set(RandomBabyType.LOCUST, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOOGER);
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BOOGER);
});

// 361
postFireTearBabyFunctionMap.set(
  RandomBabyType.MUSHROOM_GIRL,
  (tear: EntityTear) => {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    // Extra bomb shots
    g.run.babyCounters++;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      spawnBomb(
        BombVariant.NORMAL,
        0,
        tear.Position,
        tear.Velocity,
        tear.SpawnerEntity,
        tear.InitSeed,
      );
      tear.Remove();
    }
  },
);

// 364
postFireTearBabyFunctionMap.set(
  RandomBabyType.TURTLE_DRAGON,
  (tear: EntityTear) => {
    // If we use "player.ShootRedCandle(tear.Velocity)", the fires have enormous speed and are hard
    // to control.
    const normalizedVelocity = tear.Velocity.Normalized();
    g.p.ShootRedCandle(normalizedVelocity);
    tear.Remove();
  },
);

// 368
postFireTearBabyFunctionMap.set(RandomBabyType.ARCADE, (tear: EntityTear) => {
  // Changing the variant does not actually increase the damage, only the appearance.
  tear.ChangeVariant(TearVariant.RAZOR);
  tear.CollisionDamage = g.p.Damage * 3;
});

// 372
postFireTearBabyFunctionMap.set(
  RandomBabyType.PINK_GHOST,
  (tear: EntityTear) => {
    const hotPink = Color(2, 0.05, 1, 0.7, 1, 1, 1);
    tear.SetColor(hotPink, 10000, 10000, false, false);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.CHARM);
  },
);

// 380
postFireTearBabyFunctionMap.set(RandomBabyType.OCTOPUS, (tear: EntityTear) => {
  // Mark that we shot this tear.
  tear.SubType = 1;
});

// 398
postFireTearBabyFunctionMap.set(
  RandomBabyType.DARK_SPACE_SOLDIER,
  (tear: EntityTear) => {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      tear.ChangeVariant(TearVariant.CHAOS_CARD);
    }
  },
);

// 404
postFireTearBabyFunctionMap.set(RandomBabyType.REFEREE, (tear: EntityTear) => {
  // Tomato tears
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.BAIT);
  tear.SetColor(FADED_RED, 10000, 10000, false, false);
});

// 406
postFireTearBabyFunctionMap.set(
  RandomBabyType.ASTRONAUT,
  (tear: EntityTear) => {
    // Mark that we shot this tear.
    tear.SubType = 1;
  },
);

// 410
postFireTearBabyFunctionMap.set(RandomBabyType.GILLS, (tear: EntityTear) => {
  const lightCyan = Color(0.7, 1.5, 2, 0.7, 1, 1, 1);
  tear.SetColor(lightCyan, 10000, 10000, false, false);

  // Mark that we shot this tear.
  tear.SubType = 1;
});

// 429
postFireTearBabyFunctionMap.set(
  RandomBabyType.LITTLE_HORN,
  (tear: EntityTear) => {
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    // Void tears
    g.run.babyCounters++;
    if (g.run.babyCounters === baby.num) {
      g.run.babyCounters = 0;
      tear.TearFlags = addFlag(tear.TearFlags, TearFlag.HORN);
    }
  },
);

// 442
postFireTearBabyFunctionMap.set(
  RandomBabyType.TOOTH_HEAD,
  (tear: EntityTear) => {
    // Changing the variant does not actually increase the damage, only the appearance.
    tear.ChangeVariant(TearVariant.TOOTH);
    tear.CollisionDamage = g.p.Damage * 3.2;
  },
);

// 455
postFireTearBabyFunctionMap.set(
  RandomBabyType.GREEN_KOOPA,
  (tear: EntityTear) => {
    // Turn all tears into green shell tears.
    const sprite = tear.GetSprite();
    sprite.Load("gfx/shell_green_tears.anm2", true);
    sprite.Play("RegularTear1", false);

    // Make it bouncy
    tear.TearFlags = addFlag(
      TearFlag.BOUNCE, // 1 << 19
      TearFlag.POP, // 1 << 56
    );

    // Make it lower to the ground.
    tear.Height = -5;

    // Mark it as a special tear so that we can keep it updated.
    tear.SubType = 1;

    // Store the initial height and velocity.
    const data = tear.GetData();
    data["Height"] = tear.Height;
    data["Velocity"] = tear.Velocity;
  },
);

// 458
postFireTearBabyFunctionMap.set(
  RandomBabyType.RED_KOOPA,
  (tear: EntityTear) => {
    // Turn all tears into red shell tears.
    const sprite = tear.GetSprite();
    sprite.Load("gfx/shell_red_tears.anm2", true);
    sprite.Play("RegularTear1", false);

    // Make it bouncy and homing.
    tear.TearFlags = addFlag(
      TearFlag.HOMING, // 1 << 2
      TearFlag.BOUNCE, // 1 << 19
      TearFlag.POP, // 1 << 56
    );

    // Make it lower to the ground.
    tear.Height = -5;

    // Mark it as a special tear so that we can keep it updated.
    tear.SubType = 1;

    // Store the initial height. (Unlike Green Koopa Baby, we do not need to store the velocity.)
    const data = tear.GetData() as unknown as TearData;
    data.Height = tear.Height;
  },
);

// 459
postFireTearBabyFunctionMap.set(
  RandomBabyType.SAD_BUNNY,
  (tear: EntityTear) => {
    // Mark that we shot this tear.
    tear.SubType = 1;
  },
);

// 462
postFireTearBabyFunctionMap.set(RandomBabyType.VOXDOG, (tear: EntityTear) => {
  const gameFrameCount = game.GetFrameCount();

  // Shockwave tears
  g.run.room.tears.push({
    frame: gameFrameCount,
    position: tear.Position,
    velocity: tear.Velocity.Normalized().mul(30),
    num: 0,
  });
  tear.Remove();
});

// 466
postFireTearBabyFunctionMap.set(
  RandomBabyType.BLINDCURSED,
  (tear: EntityTear) => {
    tear.Visible = false;
  },
);

// 469
postFireTearBabyFunctionMap.set(RandomBabyType.FLY, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.GODS_FLESH);

  tear.TearFlags = addFlag(
    tear.TearFlags,
    TearFlag.PIERCING, // 1 << 1
    TearFlag.SPLIT, // 1 << 6
    TearFlag.WIGGLE, // 1 << 10
    TearFlag.PULSE, // 1 << 25
    TearFlag.BONE, // 1 << 49
  );
});

// 470
postFireTearBabyFunctionMap.set(
  RandomBabyType.HEADPHONE,
  (tear: EntityTear) => {
    // Soundwave tears (1/2)
    tear.ChangeVariant(TearVariant.PUPULA);
    // We don't give it a tear flag of TEAR_FLAT because that makes it look worse.
    tear.Scale *= 10;

    // For some reason, changing the tear variant on this frame will cause the tear to point towards
    // the right. To work around this, make the tear invisible and make it visible on the next
    // frame.
    tear.Visible = false;
  },
);

// 480
postFireTearBabyFunctionMap.set(RandomBabyType.IMP_2, (tear: EntityTear) => {
  tear.SetColor(COLORS.Yellow, 3600, 100);
  tear.TearFlags = addFlag(tear.TearFlags, TearFlag.ACID);
});

// 487
postFireTearBabyFunctionMap.set(
  RandomBabyType.CURSED_PILLOW,
  (tear: EntityTear) => {
    // Mark that we shot this tear.
    tear.SubType = 1;
  },
);

// 494
postFireTearBabyFunctionMap.set(
  RandomBabyType.POMPADOUR,
  (tear: EntityTear) => {
    tear.ChangeVariant(TearVariant.GODS_FLESH);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.GODS_FLESH);
  },
);

// 498
postFireTearBabyFunctionMap.set(RandomBabyType.ILL, (tear: EntityTear) => {
  tear.ChangeVariant(TearVariant.BOBS_HEAD);
});

// 500
postFireTearBabyFunctionMap.set(RandomBabyType.MERN, (tear: EntityTear) => {
  const gameFrameCount = game.GetFrameCount();

  g.run.babyTears.numFired++;
  if (g.run.babyTears.numFired >= 2) {
    // Mark to fire a tear 1 frame from now.
    g.run.babyTears.numFired = 0;
    g.run.babyTears.frame = gameFrameCount + 1;
    g.run.babyTears.velocity = Vector(tear.Velocity.X, tear.Velocity.Y);
  }
});

// 504
postFireTearBabyFunctionMap.set(RandomBabyType.PSYCHIC, (tear: EntityTear) => {
  const roomFrameCount = g.r.GetFrameCount();
  const roomShape = g.r.GetRoomShape();

  // Disable the mechanic after N seconds to avoid softlocks.
  const softlockThresholdFrame = 30 * GAME_FRAMES_PER_SECOND;
  if (roomFrameCount >= softlockThresholdFrame) {
    return;
  }

  // Disable the mechanic in any room that would grant 2 charges.
  if (roomShape >= RoomShape.SHAPE_2x2) {
    return;
  }

  // Starts with Abel; tears come from Abel Get Abel's position.
  const abels = getFamiliars(FamiliarVariant.ABEL);
  const abel = abels[0];
  if (abel !== undefined) {
    tear.Position = abel.Position;
  }
});

// 517
postFireTearBabyFunctionMap.set(
  RandomBabyType.MASTER_COOK,
  (tear: EntityTear) => {
    tear.ChangeVariant(TearVariant.EGG);
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.EGG);
  },
);

// 585
postFireTearBabyFunctionMap.set(RandomBabyType.ABEL, (tear: EntityTear) => {
  // Mark that we shot this tear.
  tear.SubType = 1;
});

// 587
postFireTearBabyFunctionMap.set(RandomBabyType.ROTTEN, (tear: EntityTear) => {
  tear.Remove();
  g.p.AddBlueFlies(1, g.p.Position, undefined);
});

// 593
postFireTearBabyFunctionMap.set(RandomBabyType.LIL_LOKI, (tear: EntityTear) => {
  // Cross tears. (We store the rotation angle in the "babyCounters" variable.)
  g.run.babyCounters += 90;
  if (g.run.babyCounters < 360) {
    const velocity = tear.Velocity.Rotated(g.run.babyCounters);
    g.p.FireTear(g.p.Position, velocity, false, true, false);
  } else {
    g.run.babyCounters = 0;
  }
});

// 596
postFireTearBabyFunctionMap.set(
  // Ice tears
  RandomBabyType.FREEZER,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.ICE);
    tear.SetColor(FADED_BLUE, 10000, 10000, false, false);
  },
);

// 598
postFireTearBabyFunctionMap.set(
  // Spore tears
  RandomBabyType.TWISTED,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.SPORE);
    tear.ChangeVariant(TearVariant.SPORE);
  },
);
