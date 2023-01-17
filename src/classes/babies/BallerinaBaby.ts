import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Summons a Restock Machine after N hits. */
export class BallerinaBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const numHits = this.getAttribute("requireNumHits");

    g.run.babyCounters++;
    if (g.run.babyCounters === numHits) {
      g.run.babyCounters = 0;
      useActiveItemTemp(player, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY);
    }

    return undefined;
  }
}
