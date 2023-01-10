import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Potato Peeler effect on hit. */
export class MeatBoyBaby extends Baby {
  override isValid(): boolean {
    const maxHearts = g.p.GetMaxHearts();

    return maxHearts > 0;
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    useActiveItemTemp(player, CollectibleType.POTATO_PEELER);

    return undefined;
  }
}
