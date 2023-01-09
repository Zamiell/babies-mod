import {
  CardType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Teleports to the boss room after N hits. */
export class GlitteryPeachBaby extends Baby {
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
