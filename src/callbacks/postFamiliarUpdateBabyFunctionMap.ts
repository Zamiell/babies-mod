import { FamiliarVariant } from "isaac-typescript-definitions";
import { getFamiliars } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getRandomOffsetPosition } from "../utils";

export const postFamiliarUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (familiar: EntityFamiliar) => void
>();

// 36
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.LIL,
  (familiar: EntityFamiliar) => {
    // Everything is tiny. For some reason, familiars reset their SpriteScale on every frame, so we
    // have to constantly set it back.
    familiar.SpriteScale = Vector(0.5, 0.5);
  },
);

// 37
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.BIG,
  (familiar: EntityFamiliar) => {
    // Everything is giant. For some reason, familiars reset their SpriteScale on every frame, so we
    // have to constantly set it back.
    familiar.SpriteScale = Vector(2, 2);
  },
);

// 47
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.SUCKY,
  (familiar: EntityFamiliar) => {
    // Keep it locked on the player to emulate a Succubus aura.
    if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
      familiar.Position = g.p.Position;
    }
  },
);

// 82
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.GURDY,
  (familiar: EntityFamiliar) => {
    if (familiar.Variant !== FamiliarVariant.LIL_GURDY) {
      return;
    }

    // All of the Gurdies will stack on top of each other, so manually keep them spread apart.
    const lilGurdies = getFamiliars(FamiliarVariant.LIL_GURDY);
    for (const lilGurdy of lilGurdies) {
      if (
        familiar.Position.Distance(lilGurdy.Position) <= 1 &&
        // Use the index as a priority of which familiar is forced to move away.
        familiar.Index < lilGurdy.Index
      ) {
        lilGurdy.Position = getRandomOffsetPosition(
          lilGurdy.Position,
          7,
          lilGurdy.InitSeed,
        );
      }
    }
  },
);

// 326
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.GEEK,
  (familiar: EntityFamiliar) => {
    if (familiar.Variant === FamiliarVariant.ROBO_BABY_2) {
      return;
    }

    // All of the babies will stack on top of each other, so manually keep them spread apart.
    const roboBabies = getFamiliars(FamiliarVariant.ROBO_BABY_2);
    for (const roboBaby of roboBabies) {
      if (
        familiar.Position.Distance(roboBaby.Position) <= 1 &&
        // Use the index as a priority of which Gurdy is forced to move away.
        familiar.Index < roboBaby.Index
      ) {
        roboBaby.Position = getRandomOffsetPosition(
          roboBaby.Position,
          7,
          roboBaby.InitSeed,
        );
      }
    }
  },
);

// 376
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.DINO,
  (familiar: EntityFamiliar) => {
    if (
      familiar.Variant === FamiliarVariant.BOBS_BRAIN &&
      familiar.SubType === 1 // Bob's Brain familiars have a SubType of 1 after they explode
    ) {
      familiar.Remove();
    }
  },
);

// 403
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.PIXIE,
  (familiar: EntityFamiliar) => {
    // Speed it up
    if (
      familiar.Variant === FamiliarVariant.YO_LISTEN &&
      familiar.FrameCount % 5 === 0
    ) {
      familiar.Velocity = familiar.Velocity.mul(2);
    }
  },
);

// 453
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.GRAVEN,
  (familiar: EntityFamiliar) => {
    // Speed it up
    if (
      familiar.Variant === FamiliarVariant.BUMBO &&
      familiar.FrameCount % 5 === 0
    ) {
      familiar.Velocity = familiar.Velocity.mul(2);
    }
  },
);

// 592
postFamiliarUpdateBabyFunctionMap.set(
  RandomBabyType.SERAPHIM,
  (familiar: EntityFamiliar) => {
    if (familiar.Variant === FamiliarVariant.CENSER) {
      familiar.Position = g.p.Position;

      const sprite = familiar.GetSprite();
      sprite.Load("gfx/003.089_censer_invisible.anm2", true);
      sprite.Play("Idle", true);
    }
  },
);
