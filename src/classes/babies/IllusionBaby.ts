import { SlotVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, newRNG } from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { g } from "../../globals";
import { BabyDescription } from "../../types/BabyDescription";
import { spawnSlotHelper } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a Crane Game on hit. */
export class IllusionBaby extends Baby {
  v = {
    run: {
      rng: newRNG(),
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this.v);
  }

  override onAdd(): void {
    const startSeed = g.seeds.GetStartSeed();
    this.v.run.rng = newRNG(startSeed);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    spawnSlotHelper(SlotVariant.CRANE_GAME, player.Position, this.v.run.rng);

    return undefined;
  }
}
