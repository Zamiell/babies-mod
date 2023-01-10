import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Mega Mush effect after 6 hits. */
export class BigMouthBaby2 extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const numHits = this.getAttribute("requireNumHits");

    g.run.babyCounters++;
    if (g.run.babyCounters === numHits) {
      g.run.babyCounters = 0;
      useActiveItemTemp(player, CollectibleType.MEGA_MUSH);
    }

    return undefined;
  }
}
