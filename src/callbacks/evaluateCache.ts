import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { getCurrentBaby } from "../utils";
import { evaluateCacheBabyFunctionMap } from "./evaluateCacheBabyFunctionMap";

export function main(player: EntityPlayer, cacheFlag: CacheFlag): void {
  const character = player.GetPlayerType();
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Give the Random Baby character a flat +1 damage as a bonus, similar to Samael
  if (
    cacheFlag === CacheFlag.CACHE_DAMAGE &&
    character === PlayerTypeCustom.PLAYER_RANDOM_BABY
  ) {
    player.Damage += 1;
  }

  // Handle flying characters
  if (cacheFlag === CacheFlag.CACHE_FLYING && baby.flight === true) {
    player.CanFly = true;
  }

  const evaluateCacheBabyFunction = evaluateCacheBabyFunctionMap.get(babyType);
  if (evaluateCacheBabyFunction !== undefined) {
    evaluateCacheBabyFunction(player, cacheFlag);
  }
}
