import { CallbackCustom, ModCallbackCustom, newRNG } from "isaacscript-common";
import { setInitialBabyRNG, spawnRandomPickup } from "../../utils";
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
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnRandomPickup(v.run.rng, player.Position);

    return undefined;
  }
}
