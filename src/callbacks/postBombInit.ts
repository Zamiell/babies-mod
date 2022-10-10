import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postBombInitBabyFunctionMap } from "./postBombInitBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_BOMB_INIT, main);
}

function main(bomb: EntityBomb) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postBombInitBabyFunction = postBombInitBabyFunctionMap.get(babyType);
  if (postBombInitBabyFunction !== undefined) {
    postBombInitBabyFunction(bomb);
  }
}
