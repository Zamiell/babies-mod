// This is registered in "DetectTrapdoorTouched.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  level: {
    touchedTrapdoor: false,
  },
};

export function hasTouchedTrapdoor(): boolean {
  return v.level.touchedTrapdoor;
}
