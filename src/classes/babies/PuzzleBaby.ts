import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { onStageWithCollectibles } from "../../utils";
import { Baby } from "../Baby";

/** D6 effect on hit. */
export class PuzzleBaby extends Baby {
  override isValid(): boolean {
    return onStageWithCollectibles();
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.D6);
    return undefined;
  }
}
