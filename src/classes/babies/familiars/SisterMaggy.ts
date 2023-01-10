import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

/** Loses last item on 2nd hit (per room). */
export class SisterMaggy extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const num = this.getAttribute("num");

    g.run.babyCountersRoom++;
    if (g.run.babyCountersRoom === num) {
      // Take away an item.
      const collectibleType = mod.getPlayerLastPassiveCollectible(player);
      if (collectibleType !== undefined) {
        player.RemoveCollectible(collectibleType);
        player.AnimateSad();
      }
    }

    return undefined;
  }
}
