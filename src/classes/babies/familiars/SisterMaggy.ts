import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

/** Loses last item on Nth hit (per room). */
export class SisterMaggy extends Baby {
  v = {
    room: {
      numHits: 0,
    },
  };

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    this.v.room.numHits++;
    if (this.v.room.numHits === num) {
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
