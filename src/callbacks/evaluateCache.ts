import { getCurrentBaby } from "../util";
import { PlayerTypeCustom } from "../types/enums";
import evaluateCacheBabyFunctions from "./evaluateCacheBabies";

export function main(player: EntityPlayer, cacheFlag: CacheFlag): void {
  const character = player.GetPlayerType();
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Give the character a flat +1 damage as a bonus, similar to Samael
  if (
    cacheFlag === CacheFlag.CACHE_DAMAGE &&
    character === PlayerTypeCustom.PLAYER_RANDOM_BABY
  ) {
    player.Damage += 1;
  }

  // Handle blindfolded characters
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY && baby.blindfolded === true) {
    player.MaxFireDelay = 100000;
    // (setting "player.FireDelay" here will not work,
    // so do it one frame later in the PostUpdate callback)
  }

  // Handle flying characters
  if (cacheFlag === CacheFlag.CACHE_FLYING && baby.flight === true) {
    player.CanFly = true;
  }

  const babyFunc = evaluateCacheBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc(player, cacheFlag);
  }
}
