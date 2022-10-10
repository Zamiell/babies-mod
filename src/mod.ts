import { ISCFeature, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants";

const modVanilla = RegisterMod(MOD_NAME, 1);
const features = [ISCFeature.SPAWN_COLLECTIBLE] as const;
export const mod = upgradeMod(modVanilla, features);
