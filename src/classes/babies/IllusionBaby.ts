import { LevelStage, SlotVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getEffectiveStage,
  newRNG,
} from "isaacscript-common";
import { setInitialBabyRNG, spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** Spawns a Crane Game on hit. */
export class IllusionBaby extends Baby {
  v = v;

  /**
   * The player won't have any resources to spend on machines on the first floor or second floor.
   */
  override isValid(): boolean {
    return getEffectiveStage() > LevelStage.BASEMENT_2;
  }

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnSlotHelper(SlotVariant.CRANE_GAME, player.Position, player, v.run.rng);
    return undefined;
  }
}
