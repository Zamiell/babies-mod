import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Random teleport on hit. */
export class FadedBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.TELEPORT);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.TELEPORT);
    return undefined;
  }
}
