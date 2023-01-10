import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Mama Mega effect on hit. */
export class NuclearBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    g.r.MamaMegaExplossion();

    return undefined;
  }
}
