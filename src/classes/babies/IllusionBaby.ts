import { SlotVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, newRNG } from "isaacscript-common";
import { g } from "../../globals";
import { spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a Crane Game on hit. */
export class IllusionBaby extends Baby {
  v = v;

  override onAdd(): void {
    const startSeed = g.seeds.GetStartSeed();
    v.run.rng = newRNG(startSeed);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnSlotHelper(SlotVariant.CRANE_GAME, player.Position, v.run.rng);

    return undefined;
  }
}
