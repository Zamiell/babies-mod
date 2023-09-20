import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    usingPotatoPeeler: false,
  },
};

/** Potato Peeler effect on hit. */
export class MeatBoyBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    const maxHearts = player.GetMaxHearts();

    return (
      maxHearts > 0 && !player.HasCollectible(CollectibleType.POTATO_PEELER)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (v.run.usingPotatoPeeler) {
      return undefined;
    }

    v.run.usingPotatoPeeler = true;
    useActiveItemTemp(player, CollectibleType.POTATO_PEELER);
    v.run.usingPotatoPeeler = false;

    return undefined;
  }
}
