import { getCurrentBaby } from "../utils";
import { postFamiliarUpdateBabyFunctionMap } from "./postFamiliarUpdateBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE, main);
}

function main(familiar: EntityFamiliar) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postFamiliarUpdateBabyFunction =
    postFamiliarUpdateBabyFunctionMap.get(babyType);
  if (postFamiliarUpdateBabyFunction !== undefined) {
    postFamiliarUpdateBabyFunction(familiar);
  }
}
