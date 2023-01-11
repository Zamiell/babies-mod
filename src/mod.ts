import { ISCFeature, ModCallbackCustom, upgradeMod } from "isaacscript-common";
import { MOD_NAME } from "./constants";

const ISC_FEATURES_FOR_THIS_MOD = [
  ISCFeature.MODDED_ELEMENT_SETS,
  ISCFeature.PLAYER_INVENTORY,
  ISCFeature.RUN_IN_N_FRAMES,
  ISCFeature.SPAWN_COLLECTIBLE,
] as const;

const CUSTOM_CALLBACKS_USED = [
  ModCallbackCustom.POST_GAME_STARTED_REORDERED,
  ModCallbackCustom.POST_NEW_LEVEL_REORDERED,
  ModCallbackCustom.POST_NEW_ROOM_REORDERED,
  ModCallbackCustom.POST_PICKUP_COLLECT,
  ModCallbackCustom.PRE_ITEM_PICKUP,
  ModCallbackCustom.POST_ITEM_PICKUP,
  ModCallbackCustom.POST_PURCHASE,
  ModCallbackCustom.POST_PLAYER_CHANGE_TYPE,
  ModCallbackCustom.POST_SLOT_DESTROYED,
  ModCallbackCustom.POST_TRINKET_BREAK,
  ModCallbackCustom.POST_GRID_ENTITY_INIT,
  ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
  ModCallbackCustom.POST_GRID_ENTITY_BROKEN,
] as const;

const modVanilla = RegisterMod(MOD_NAME, 1);
export const mod = upgradeMod(
  modVanilla,
  ISC_FEATURES_FOR_THIS_MOD,
  CUSTOM_CALLBACKS_USED,
);
