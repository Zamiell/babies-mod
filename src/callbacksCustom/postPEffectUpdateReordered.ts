import { CollectibleType } from "isaac-typescript-definitions";
import { ModCallbackCustom, ReadonlySet } from "isaacscript-common";
import { getBabyItemsSet } from "../babyCheckValid";
import { softlockPreventionPostPEffectUpdateReordered } from "../features/softlockPrevention";
import { mod } from "../mod";
import { BabyDescription } from "../types/BabyDescription";
import { isValidRandomBabyPlayer } from "../utils";
import { getCurrentBaby } from "../utilsBaby";

const NEXT_FLOOR_PLAYER_ANIMATIONS = new ReadonlySet<string>([
  "Trapdoor",
  "Trapdoor2",
  "LightTravel",
]);

const MAPPING_COLLECTIBLE_TYPES = [
  CollectibleType.COMPASS, // 21
  CollectibleType.TREASURE_MAP, // 54
  CollectibleType.BLUE_MAP, // 246
  CollectibleType.MIND, // 333
] as const;

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED, main);
}

function main(player: EntityPlayer) {
  if (!isValidRandomBabyPlayer(player)) {
    return;
  }

  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { baby } = currentBaby;

  softlockPreventionPostPEffectUpdateReordered(baby);
  checkPlayerGoingToNextFloor(player, baby);
}

/**
 * If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
 * effect will have already been applied. So, we need to monitor for the trapdoor animation.
 */
function checkPlayerGoingToNextFloor(
  player: EntityPlayer,
  baby: BabyDescription,
) {
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();

  if (NEXT_FLOOR_PLAYER_ANIMATIONS.has(animation)) {
    return;
  }

  const babyItemsSet = getBabyItemsSet(baby);

  for (const collectibleType of MAPPING_COLLECTIBLE_TYPES) {
    if (babyItemsSet.has(collectibleType)) {
      player.RemoveCollectible(collectibleType);
    }
  }
}
