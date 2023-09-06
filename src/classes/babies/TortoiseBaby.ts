import {
  CallbackCustom,
  getRandom,
  ModCallbackCustom,
  newRNG,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** N% chance to ignore damage. */
export class TortoiseBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const avoidChance = getRandom(v.run.rng);
    const num = this.getAttribute("num");

    if (avoidChance < num) {
      return false;
    }

    return undefined;
  }
}
