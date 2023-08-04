import type { CollectibleType } from "isaac-typescript-definitions";
import { ModCallback, SlotVariant } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

/** Starts with Clockwork Assembly. */
export class FactoryBaby extends Baby {
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY)
  preUseItemClockworkAssembly(
    _collectibleType: CollectibleType,
    rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    spawnSlotHelper(SlotVariant.SHOP_RESTOCK_MACHINE, player.Position, rng);

    return true;
  }
}
