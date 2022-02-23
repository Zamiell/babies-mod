import { getFamiliars } from "isaacscript-common";
import { RandomBabyType } from "../babies";
import g from "../globals";
import { getRandomOffsetPosition } from "../utils";

export const postFamiliarUpdateBabyFunctionMap = new Map<
  int,
  (familiar: EntityFamiliar) => void
>();

// Lil' Baby
postFamiliarUpdateBabyFunctionMap.set(36, (familiar: EntityFamiliar) => {
  // Everything is tiny
  // For some reason, familiars reset their SpriteScale on every frame,
  // so we have to constantly set it back
  familiar.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
postFamiliarUpdateBabyFunctionMap.set(37, (familiar: EntityFamiliar) => {
  // Everything is giant
  // For some reason, familiars reset their SpriteScale on every frame,
  // so we have to constantly set it back
  familiar.SpriteScale = Vector(2, 2);
});

// Sucky Baby
postFamiliarUpdateBabyFunctionMap.set(47, (familiar: EntityFamiliar) => {
  // Keep it locked on the player to emulate a Succubus aura
  if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
    familiar.Position = g.p.Position;
  }
});

// Gurdy Baby
postFamiliarUpdateBabyFunctionMap.set(82, (familiar: EntityFamiliar) => {
  if (familiar.Variant !== FamiliarVariant.LIL_GURDY) {
    return;
  }

  // All of the Gurdies will stack on top of each other, so manually keep them spread apart
  const lilGurdies = getFamiliars(FamiliarVariant.LIL_GURDY);
  for (const lilGurdy of lilGurdies) {
    if (
      familiar.Position.Distance(lilGurdy.Position) <= 1 &&
      // Use the index as a priority of which familiar is forced to move away
      familiar.Index < lilGurdy.Index
    ) {
      lilGurdy.Position = getRandomOffsetPosition(
        lilGurdy.Position,
        7,
        lilGurdy.InitSeed,
      );
    }
  }
});

// Geek Baby
postFamiliarUpdateBabyFunctionMap.set(326, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.ROBO_BABY_2) {
    return;
  }

  // All of the babies will stack on top of each other, so manually keep them spread apart
  const roboBabies = getFamiliars(FamiliarVariant.ROBO_BABY_2);
  for (const roboBaby of roboBabies) {
    if (
      familiar.Position.Distance(roboBaby.Position) <= 1 &&
      // Use the index as a priority of which Gurdy is forced to move away
      familiar.Index < roboBaby.Index
    ) {
      roboBaby.Position = getRandomOffsetPosition(
        roboBaby.Position,
        7,
        roboBaby.InitSeed,
      );
    }
  }
});

// Dino Baby
postFamiliarUpdateBabyFunctionMap.set(376, (familiar: EntityFamiliar) => {
  if (
    familiar.Variant === FamiliarVariant.BOBS_BRAIN &&
    familiar.SubType === 1 // Bob's Brain familiars have a SubType of 1 after they explode
  ) {
    familiar.Remove();
  }
});

// Pixie Baby
postFamiliarUpdateBabyFunctionMap.set(403, (familiar: EntityFamiliar) => {
  // Speed it up
  if (
    familiar.Variant === FamiliarVariant.YO_LISTEN &&
    familiar.FrameCount % 5 === 0
  ) {
    familiar.Velocity = familiar.Velocity.mul(2);
  }
});

// Graven Baby
postFamiliarUpdateBabyFunctionMap.set(453, (familiar: EntityFamiliar) => {
  // Speed it up
  if (
    familiar.Variant === FamiliarVariant.BUMBO &&
    familiar.FrameCount % 5 === 0
  ) {
    familiar.Velocity = familiar.Velocity.mul(2);
  }
});

// Seraphim
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
