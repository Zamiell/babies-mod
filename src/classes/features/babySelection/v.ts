// The baby selection variables have to be in a separate file because:

// - "BabySelection.ts" needs to do baby lookups
// - --> "babies.ts"
// - --> "babyClasses.ts"
// - --> every class extends from `Baby`
// - --> "Baby.ts" needs `getBabyType`

// Thus, `getBabyType` cannot be in `BabySelection.ts`.

import type { RandomBabyType } from "../../../enums/RandomBabyType";

// This is registered in "BabySelection.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  persistent: {
    /**
     * A list of the babies that we have chosen so far on this run or multi-character custom
     * challenge.
     *
     * Used so that we can avoid giving duplicate babies.
     */
    pastBabies: new Set<RandomBabyType>(),

    /** Used for testing specific babies. */
    debugBabyType: null as RandomBabyType | null,

    __rewindWithGlowingHourGlass: true,
  },

  run: {
    babyType: null as RandomBabyType | null,
    pastBabyType: null as RandomBabyType | null,
    usedGlowingHourGlassInStartingRoom: false,

    /** Needed so that we can implement mod-specific Glowing Hour Glass compatibility. */
    __ignoreGlowingHourGlass: true,
  },
};

export function getBabyType(): RandomBabyType | undefined {
  return v.run.babyType ?? undefined;
}

export function setDebugBabyType(babyType: RandomBabyType | undefined): void {
  v.persistent.debugBabyType = babyType ?? null;
}
