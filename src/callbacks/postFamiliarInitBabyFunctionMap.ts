import { FamiliarVariant } from "isaac-typescript-definitions";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postFamiliarInitBabyFunctionMap = new Map<
  RandomBabyType,
  (familiar: EntityFamiliar) => void
>();

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
