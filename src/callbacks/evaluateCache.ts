import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { isCharacter } from "isaacscript-common";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { getCurrentBaby } from "../utils";
import { evaluateCacheBabyFunctionMap } from "./evaluateCacheBabyFunctionMap";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, main);
}

function main(player: EntityPlayer, cacheFlag: CacheFlag) {
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // Give the Random Baby character a flat +1 damage as a bonus, similar to Samael.
  if (
    cacheFlag === CacheFlag.DAMAGE &&
    isCharacter(player, PlayerTypeCustom.RANDOM_BABY)
  ) {
    player.Damage++;
  }

  // Handle flying characters.
  if (cacheFlag === CacheFlag.FLYING && baby.flight === true) {
    player.CanFly = true;
  }

  const evaluateCacheBabyFunction = evaluateCacheBabyFunctionMap.get(babyType);
  if (evaluateCacheBabyFunction !== undefined) {
    evaluateCacheBabyFunction(player, cacheFlag);
  }
}
