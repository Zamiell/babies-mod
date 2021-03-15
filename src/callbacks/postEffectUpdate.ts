// Note: Distance, SpawnerType, and SpawnerVariant are not initialized yet in this callback

import * as misc from "../misc";
import postEffectUpdateBabyFunctions from "./postEffectUpdateBabies";

export function main(effect: EntityEffect): void {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  const babyFunc = postEffectUpdateBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(effect);
  }
}
