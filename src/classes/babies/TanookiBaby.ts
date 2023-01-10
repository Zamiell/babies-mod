import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Mr. ME effect on hit. */
export class TanookiBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    useActiveItemTemp(player, CollectibleType.MR_ME);

    return undefined;
  }
}
