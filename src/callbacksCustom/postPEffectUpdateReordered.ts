import { CollectibleType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { softlockPreventionPostPEffectUpdateReordered } from "../features/softlockPrevention";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";
import { isValidRandomBabyPlayer } from "../utils";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (!isValidRandomBabyPlayer(player)) {
    return;
  }

  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  softlockPreventionPostPEffectUpdateReordered(baby);
  checkTrapdoor(player, baby);
}

/**
 * If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
 * effect will have already been applied. So, we need to monitor for the trapdoor animation.
 */
function checkTrapdoor(player: EntityPlayer, baby: BabyDescription) {
  const playerSprite = player.GetSprite();

  if (
    !playerSprite.IsPlaying("Trapdoor") &&
    !playerSprite.IsPlaying("Trapdoor2") &&
    !playerSprite.IsPlaying("LightTravel")
  ) {
    return;
  }

  // 21
  if (
    baby.item === CollectibleType.COMPASS ||
    baby.item2 === CollectibleType.COMPASS
  ) {
    player.RemoveCollectible(CollectibleType.COMPASS);
  }

  // 54
  if (
    baby.item === CollectibleType.TREASURE_MAP ||
    baby.item2 === CollectibleType.TREASURE_MAP
  ) {
    player.RemoveCollectible(CollectibleType.TREASURE_MAP);
  }

  // 246
  if (
    baby.item === CollectibleType.BLUE_MAP ||
    baby.item2 === CollectibleType.BLUE_MAP
  ) {
    player.RemoveCollectible(CollectibleType.BLUE_MAP);
  }

  // 333
  if (
    baby.item === CollectibleType.MIND ||
    baby.item2 === CollectibleType.MIND
  ) {
    player.RemoveCollectible(CollectibleType.MIND);
  }
}
