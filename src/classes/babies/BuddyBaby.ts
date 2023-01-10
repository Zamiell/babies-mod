import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Removes a heart container on hit. */
export class BuddyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const maxHearts = player.GetMaxHearts();

    if (!g.run.babyBool && maxHearts >= 2) {
      player.AddMaxHearts(-2, true);
      g.run.babyBool = true;
      useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
      g.run.babyBool = false;
      return false;
    }

    return undefined;
  }
}
