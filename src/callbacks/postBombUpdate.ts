import { ModCallback } from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";
import { postBombUpdateBabyFunctionMap } from "./postBombUpdateBabyFunctionMap";

export function init(): void {
  mod.AddCallback(ModCallback.POST_BOMB_UPDATE, main);
}

function main(bomb: EntityBomb) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  const postBombUpdateBabyFunction =
    postBombUpdateBabyFunctionMap.get(babyType);
  if (postBombUpdateBabyFunction !== undefined) {
    postBombUpdateBabyFunction(bomb);
  }
}
