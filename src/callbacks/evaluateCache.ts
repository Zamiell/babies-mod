import { CacheFlag, ModCallback } from "isaac-typescript-definitions";
import { isCharacter } from "isaacscript-common";
import { getBabyType } from "../classes/features/babySelection/v";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { BABIES } from "../objects/babies";

export function init(): void {
  mod.AddCallback(ModCallback.EVALUATE_CACHE, main);
}

function main(player: EntityPlayer, cacheFlag: CacheFlag) {
  const babyType = getBabyType();
  if (babyType === undefined) {
    return;
  }

  const baby = BABIES[babyType] as BabyDescription;

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
}
