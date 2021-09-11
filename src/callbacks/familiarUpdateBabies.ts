import g from "../globals";
import { getOffsetPosition } from "../misc";

const functionMap = new Map<int, (familiar: EntityFamiliar) => void>();
export default functionMap;

// Lil' Baby
functionMap.set(36, (familiar: EntityFamiliar) => {
  // Everything is tiny
  // For some reason, familiars reset their SpriteScale on every frame,
  // so we have to constantly set it back
  familiar.SpriteScale = Vector(0.5, 0.5);
});

// Big Baby
functionMap.set(37, (familiar: EntityFamiliar) => {
  // Everything is giant
  // For some reason, familiars reset their SpriteScale on every frame,
  // so we have to constantly set it back
  familiar.SpriteScale = Vector(2, 2);
});

// Sucky Baby
functionMap.set(47, (familiar: EntityFamiliar) => {
  // Keep it locked on the player to emulate a Succubus aura
  if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
    familiar.Position = g.p.Position;
  }
});

// Gurdy Baby
functionMap.set(82, (familiar: EntityFamiliar) => {
  // All of the Gurdies will stack on top of each other, so manually keep them spread apart
  if (familiar.Variant === FamiliarVariant.LIL_GURDY) {
    const lilGurdies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      FamiliarVariant.LIL_GURDY,
    );
    for (const lilGurdy of lilGurdies) {
      if (
        familiar.Position.Distance(lilGurdy.Position) <= 1 &&
        // Use the index as a priority of which familiar is forced to move away
        familiar.Index < lilGurdy.Index
      ) {
        lilGurdy.Position = getOffsetPosition(
          lilGurdy.Position,
          7,
          lilGurdy.InitSeed,
        );
      }
    }
  }
});

// Geek Baby
functionMap.set(326, (familiar: EntityFamiliar) => {
  // All of the babies will stack on top of each other, so manually keep them spread apart
  if (familiar.Variant === FamiliarVariant.ROBO_BABY_2) {
    const roboBabies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      FamiliarVariant.ROBO_BABY_2,
    );
    for (const roboBaby of roboBabies) {
      if (
        familiar.Position.Distance(roboBaby.Position) <= 1 &&
        // Use the index as a priority of which Gurdy is forced to move away
        familiar.Index < roboBaby.Index
      ) {
        roboBaby.Position = getOffsetPosition(
          roboBaby.Position,
          7,
          roboBaby.InitSeed,
        );
      }
    }
  }
});

// Dino Baby
functionMap.set(376, (familiar: EntityFamiliar) => {
  if (
    familiar.Variant === FamiliarVariant.BOBS_BRAIN &&
    familiar.SubType === 1 // Bob's Brain familiars have a SubType of 1 after they explode
  ) {
    familiar.Remove();
  }
});

// Pixie Baby
functionMap.set(403, (familiar: EntityFamiliar) => {
  // Speed it up
  if (
    familiar.Variant === FamiliarVariant.YO_LISTEN &&
    familiar.FrameCount % 5 === 0
  ) {
    familiar.Velocity = familiar.Velocity.mul(2);
  }
});

// Graven Baby
functionMap.set(453, (familiar: EntityFamiliar) => {
  // Speed it up
  if (
    familiar.Variant === FamiliarVariant.BUMBO &&
    familiar.FrameCount % 5 === 0
  ) {
    familiar.Velocity = familiar.Velocity.mul(2);
  }
});

// Seraphim
functionMap.set(538, (familiar: EntityFamiliar) => {
  if (familiar.Variant === FamiliarVariant.CENSER) {
    familiar.Position = g.p.Position;
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.089_censer_invisible.anm2", true);
    sprite.Play("Idle", true);
  }
});
