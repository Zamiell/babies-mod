import { HeartSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getRandomEnumValue,
  ModCallbackCustom,
  spawnHeart,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random heart on hit. */
export class RevengeBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const randomHeartSubType = getRandomEnumValue(HeartSubType, g.run.rng, [
      HeartSubType.NULL,
    ]);
    spawnHeart(
      randomHeartSubType,
      player.Position,
      VectorZero,
      player,
      g.run.rng,
    );

    return undefined;
  }
}
