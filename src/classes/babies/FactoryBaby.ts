import type { CollectibleType } from "isaac-typescript-definitions";
import { CardType, ModCallback } from "isaac-typescript-definitions";
import { Callback, useCardTemp } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { Baby } from "../Baby";

/** Starts with Clockwork Assembly. */
export class FactoryBaby extends Baby {
  @Callback(ModCallback.POST_USE_ITEM, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY)
  preUseItemClockworkAssembly(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    useCardTemp(player, CardType.REVERSE_JUDGEMENT);

    return true;
  }
}
