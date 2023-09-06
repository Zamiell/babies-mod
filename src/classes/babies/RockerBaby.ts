import { BombSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  getRandomEnumValue,
  newRNG,
  spawnBombPickup,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a random bomb on hit. */
export class RockerBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const randomBombSubType = getRandomEnumValue(BombSubType, v.run.rng, [
      BombSubType.NULL,
    ]);

    spawnBombPickup(
      randomBombSubType,
      player.Position,
      VectorZero,
      player,
      v.run.rng,
    );

    return undefined;
  }
}
