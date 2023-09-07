import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants";

const ISC_FEATURES_FOR_THIS_MOD = [
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.MODDED_ELEMENT_SETS,
  ISCFeature.PLAYER_INVENTORY,
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.SAVE_DATA_MANAGER,
  ISCFeature.SPAWN_COLLECTIBLE,
] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(modVanilla, ISC_FEATURES_FOR_THIS_MOD);
