import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants";

const FEATURES = [
  ISCFeature.COLLECTIBLE_ITEM_POOL_TYPE,
  ISCFeature.EXTRA_CONSOLE_COMMANDS,
  ISCFeature.MODDED_ELEMENT_SETS,
  ISCFeature.PLAYER_COLLECTIBLE_TRACKING,
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.SAVE_DATA_MANAGER,
] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(modVanilla, FEATURES);
