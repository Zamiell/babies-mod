import { FamiliarVariant } from "isaac-typescript-definitions";
import { repeat, spawnFamiliar } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postFamiliarInitBabyFunctionMap = new Map<
  RandomBabyType,
  (familiar: EntityFamiliar) => void
>();

// 12
postFamiliarInitBabyFunctionMap.set(
  RandomBabyType.CROW,
  (familiar: EntityFamiliar) => {
    if (familiar.Variant === FamiliarVariant.DEAD_BIRD && !g.run.babyBool) {
      // Spawn 5 bird familiars instead of 1. (1 is already spawned.)
      g.run.babyBool = true;
      repeat(4, () => {
        spawnFamiliar(FamiliarVariant.DEAD_BIRD, 0, g.p.Position);
      });
      g.run.babyBool = false;
    }
  },
);

// 30
postFamiliarInitBabyFunctionMap.set(
  RandomBabyType.BLUE,
  (familiar: EntityFamiliar) => {
    // Make the Sprinkler invisible. (Setting "familiar.Visible = false" does not work, so we blank
    // out the sprite.)
    if (familiar.Variant === FamiliarVariant.SPRINKLER) {
      const sprite = familiar.GetSprite();
      sprite.Load("gfx/003.120_sprinkler2.anm2", true);
    }
  },
);

// 47
postFamiliarInitBabyFunctionMap.set(
  RandomBabyType.SUCKY,
  (familiar: EntityFamiliar) => {
    // Make the Succubus invisible. (Setting "familiar.Visible = false" does not work because it
    // will also make the aura invisible.)
    if (familiar.Variant === FamiliarVariant.SUCCUBUS) {
      const sprite = familiar.GetSprite();
      sprite.Load("gfx/003.096_succubus2.anm2", true);
      sprite.Play("IdleDown", true);
    }
  },
);

// 164
postFamiliarInitBabyFunctionMap.set(
  RandomBabyType.BLACK_EYE,
  (familiar: EntityFamiliar) => {
    if (
      familiar.Variant === FamiliarVariant.LEPROSY &&
      g.run.babyCounters < 3
    ) {
      // We use the "babyCounters" variable to track how Leprocy familiars are in the room.
      g.run.babyCounters++;
    }
  },
);

// 453
postFamiliarInitBabyFunctionMap.set(
  RandomBabyType.GRAVEN,
  (familiar: EntityFamiliar) => {
    // Bumbo needs 25 coins to reach the max level.
    if (familiar.Variant === FamiliarVariant.BUMBO) {
      familiar.Coins = 25;
    }
  },
);
