import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { isCharacter } from "isaacscript-common";
import { mod } from "../mod";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, main);
}

function main(player: EntityPlayer, cacheFlag: CacheFlag) {
  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { baby } = currentBaby;

  // Give the Random Baby character a flat +1 damage as a bonus, similar to Samael.
  if (
    cacheFlag === CacheFlag.DAMAGE &&
    isCharacter(player, PlayerTypeCustom.RANDOM_BABY)
  ) {
    player.Damage += 1.0;
  }

  // Handle flying characters.
  if (cacheFlag === CacheFlag.FLYING && baby.flight === true) {
    player.CanFly = true;
  }
}
