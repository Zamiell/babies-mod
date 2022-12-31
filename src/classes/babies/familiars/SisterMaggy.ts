import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { Baby } from "../../Baby";

/** Loses last item on 2nd hit (per room). */
export class SisterMaggy extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    const num = this.getAttribute("num");

    g.run.babyCountersRoom++;
    if (g.run.babyCountersRoom === num) {
      // Take away an item.
      const collectibleType = mod.getPlayerLastPassiveCollectible(player);
      if (collectibleType !== undefined) {
        player.RemoveCollectible(collectibleType);
      }
    }

    return undefined;
  }
}
