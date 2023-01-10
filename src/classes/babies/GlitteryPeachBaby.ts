import { CardType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Teleports to the boss room after N hits. */
export class GlitteryPeachBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const requireNumHits = this.getAttribute("requireNumHits");

    if (g.run.babyBool) {
      return;
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === requireNumHits) {
      // We only do the ability once per floor.
      g.run.babyBool = true;
      player.UseCard(CardType.EMPEROR);
    }

    return undefined;
  }
}
