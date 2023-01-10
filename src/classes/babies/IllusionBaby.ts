import { SlotVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a Crane Game on hit. */
export class IllusionBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnSlotHelper(
      SlotVariant.CRANE_GAME,
      player.Position,
      g.run.craneGameRNG,
    );

    return undefined;
  }
}
