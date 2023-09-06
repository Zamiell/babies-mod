import {
  CallbackCustom,
  ModCallbackCustom,
  newRNG,
  spawnCard,
  VectorZero,
} from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a random rune on hit. */
export class ReaperBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const rune = mod.getRandomRune(v.run.rng);
    spawnCard(rune, player.Position, VectorZero, player, v.run.rng);

    return undefined;
  }
}
