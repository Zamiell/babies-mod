import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  hasCollectible,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const SACRIFICIAL_ALTAR_COLLECTIBLE_TYPES = new ReadonlySet([
  CollectibleType.BROTHER_BOBBY, // 8
  CollectibleType.SISTER_MAGGY, // 67
  // TODO
]);

const v = {
  run: {
    numHits: 0,
  },
};

/** Sacrificial Altar effect after 6 hits. */
export class SillyBaby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return hasCollectible(player, ...SACRIFICIAL_ALTAR_COLLECTIBLE_TYPES);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.numHits = 0;
      useActiveItemTemp(player, CollectibleType.SACRIFICIAL_ALTAR);
    }

    return undefined;
  }
}
