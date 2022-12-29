import {
  FamiliarVariant,
  RoomShape,
  TearFlag,
  TearVariant,
} from "isaac-typescript-definitions";
import {
  addFlag,
  game,
  GAME_FRAMES_PER_SECOND,
  getFamiliars,
} from "isaacscript-common";
import { FADED_BLUE } from "../constants";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { TearData } from "../types/TearData";
import { setTearColor } from "../utils";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postFireTearBabyFunctionMap = new Map<
  RandomBabyType,
  (tear: EntityTear) => void
>();

// 406
postFireTearBabyFunctionMap.set(
  RandomBabyType.ASTRONAUT,
  (tear: EntityTear) => {
    tear.SubType = 1; // Mark that we shot this tear.
  },
);

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
    tear.SubType = 1; // Mark that we shot this tear.
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

// 487
postFireTearBabyFunctionMap.set(
  RandomBabyType.CURSED_PILLOW,
  (tear: EntityTear) => {
    tear.SubType = 1; // Mark that we shot this tear.
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

// 596
postFireTearBabyFunctionMap.set(
  // Ice tears
  RandomBabyType.FREEZER,
  (tear: EntityTear) => {
    tear.TearFlags = addFlag(tear.TearFlags, TearFlag.ICE);
    setTearColor(tear, FADED_BLUE);
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
