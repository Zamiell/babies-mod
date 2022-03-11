import { getCurrentBaby } from "../utils";
import { postBombInitBabyFunctionMap } from "./postBombInitBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_BOMB_INIT, main);
}

function main(bomb: EntityBomb) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postBombInitBabyFunction = postBombInitBabyFunctionMap.get(babyType);
  if (postBombInitBabyFunction !== undefined) {
    postBombInitBabyFunction(bomb);
  }
}
