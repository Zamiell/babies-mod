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
import { setTearColor } from "../utils";

export const postFireTearBabyFunctionMap = new Map<
  RandomBabyType,
  (tear: EntityTear) => void
>();

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
