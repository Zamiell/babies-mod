import {
  CallbackCustom,
  isFirstPlayer,
  ModCallbackCustom,
  spawnCard,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Spawns a random rune on hit. */
export class ReaperBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    const rune = mod.getRandomRune(g.run.rng);
    spawnCard(rune, player.Position, VectorZero, player, g.run.rng);

    return undefined;
  }
}
