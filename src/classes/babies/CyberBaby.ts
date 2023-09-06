import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  newRNG,
  setSeed,
} from "isaacscript-common";
import { spawnRandomPickup } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a random pickup on hit. */
export class CyberBaby extends Baby {
  v = v;

  override onAdd(): void {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    setSeed(v.run.rng, seed);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnRandomPickup(v.run.rng, player.Position);

    return undefined;
  }
}
