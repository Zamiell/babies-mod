import { HeartSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getRandomEnumValue,
  ModCallbackCustom,
  newRNG,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a random heart on hit. */
export class RevengeBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const randomHeartSubType = getRandomEnumValue(HeartSubType, v.run.rng, [
      HeartSubType.NULL,
    ]);

    spawnHeart(
      randomHeartSubType,
      player.Position,
      VectorZero,
      player,
      v.run.rng,
    );

    return undefined;
  }
}
