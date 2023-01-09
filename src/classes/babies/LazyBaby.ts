import {
  CardType,
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Random card effect on hit. */
export class LazyBaby extends Baby {
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

    const exceptions = [CardType.SUICIDE_KING]; // It would be unfair to randomly die.
    const card = mod.getRandomCard(g.run.rng, exceptions);
    player.UseCard(card);

    return undefined;
  }
}
