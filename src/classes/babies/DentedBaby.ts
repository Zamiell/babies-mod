import { KeySubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getRandomEnumValue,
  ModCallbackCustom,
  newRNG,
  spawnKey,
  VectorZero,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a random key on hit. */
export class DentedBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const randomKeySubType = getRandomEnumValue(KeySubType, v.run.rng, [
      KeySubType.NULL,
    ]);

    spawnKey(randomKeySubType, player.Position, VectorZero, player, v.run.rng);
    return undefined;
  }
}
