import { KeySubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnKey,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Spawns a random key on hit. */
export class DentedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnKey(KeySubType.NULL, player.Position, VectorZero, player, g.run.rng);

    return undefined;
  }
}
