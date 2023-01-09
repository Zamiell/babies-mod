import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnCard, VectorZero } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Spawns a random rune on hit. */
export class ReaperBaby extends Baby {
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

    const rune = mod.getRandomRune(g.run.rng);
    spawnCard(rune, player.Position, VectorZero, player, g.run.rng);

    return undefined;
  }
}
