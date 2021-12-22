import {
  log,
  ModCallbacksCustom,
  ModUpgraded,
  upgradeMod,
} from "isaacscript-common";
import { babiesCheckValid } from "./babiesCheckValid";
import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as inputAction from "./callbacks/inputAction";
import * as postBombInit from "./callbacks/postBombInit";
import * as postBombUpdate from "./callbacks/postBombUpdate";
import * as postEffectInit from "./callbacks/postEffectInit";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postFamiliarInit from "./callbacks/postFamiliarInit";
import * as postFamiliarUpdate from "./callbacks/postFamiliarUpdate";
import * as postFireTear from "./callbacks/postFireTear";
import * as postGameStarted from "./callbacks/postGameStarted";
import * as postKnifeInit from "./callbacks/postKnifeInit";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postLaserUpdate from "./callbacks/postLaserUpdate";
import * as postNewLevel from "./callbacks/postNewLevel";
import * as postNewRoom from "./callbacks/postNewRoom";
import * as postNPCInit from "./callbacks/postNPCInit";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPickupInit from "./callbacks/postPickupInit";
import * as postPickupSelection from "./callbacks/postPickupSelection";
import * as postPickupUpdate from "./callbacks/postPickupUpdate";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postProjectileUpdate from "./callbacks/postProjectileUpdate";
import * as postRender from "./callbacks/postRender";
import * as postTearInit from "./callbacks/postTearInit";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preGetCollectible from "./callbacks/preGetCollectible";
import * as preRoomEntitySpawn from "./callbacks/preRoomEntitySpawn";
import * as preTearCollision from "./callbacks/preTearCollision";
import * as preUseItem from "./callbacks/preUseItem";
import * as useItem from "./callbacks/useItem";
import * as usePill from "./callbacks/usePill";
import * as postItemPickup from "./callbacksCustom/postItemPickup";
import * as postPickupCollect from "./callbacksCustom/postPickupCollect";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import * as postPurchase from "./callbacksCustom/postPurchase";
import * as postSlotDestroyed from "./callbacksCustom/postSlotDestroyed";
import * as postTrinketBreak from "./callbacksCustom/postTrinketBreak";
import { MOD_NAME, VERSION } from "./constants";
import { initCostumeProtector } from "./costumes";
import g from "./globals";

export default function main(): void {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  initCostumeProtector(mod);
  welcomeBanner();

  // Store the mod reference so that we can use it elsewhere
  // (this is needed for saving and loading the "save.dat" file)
  g.babiesMod = mod;

  babiesCheckValid();
  registerCallbacks(mod);
}

function welcomeBanner() {
  const welcomeText = `${MOD_NAME} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacks(mod: ModUpgraded) {
  registerCallbacksMain(mod);
  registerCallbacksWithExtraArgument(mod);
  registerCallbacksCustom(mod);
  registerCallbacksCustomWithExtraArgument(mod);
}

function registerCallbacksMain(mod: ModUpgraded) {
  mod.AddCallback(ModCallbacks.MC_NPC_UPDATE, postNPCUpdate.main); // 0
  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
  mod.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
  mod.AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE, postFamiliarUpdate.main); // 6
  mod.AddCallback(ModCallbacks.MC_FAMILIAR_INIT, postFamiliarInit.main); // 7
  mod.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
  mod.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
  mod.AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, entityTakeDmg.main); // 11
  mod.AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main); // 13
  mod.AddCallback(ModCallbacks.MC_EXECUTE_CMD, executeCmd.main); // 22
  mod.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, preEntitySpawn.main); // 24
  mod.AddCallback(ModCallbacks.MC_POST_NPC_INIT, postNPCInit.main); // 27
  mod.AddCallback(ModCallbacks.MC_POST_PICKUP_INIT, postPickupInit.main); // 34
  mod.AddCallback(
    ModCallbacks.MC_POST_PICKUP_SELECTION,
    postPickupSelection.main,
  ); // 37
  mod.AddCallback(ModCallbacks.MC_POST_PICKUP_UPDATE, postPickupUpdate.main); // 38
  mod.AddCallback(ModCallbacks.MC_POST_TEAR_INIT, postTearInit.main); // 39
  mod.AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE, postTearUpdate.main); // 40
  mod.AddCallback(ModCallbacks.MC_PRE_TEAR_COLLISION, preTearCollision.main); // 42
  mod.AddCallback(
    ModCallbacks.MC_POST_PROJECTILE_UPDATE,
    postProjectileUpdate.main,
  ); // 44
  mod.AddCallback(ModCallbacks.MC_POST_LASER_INIT, postLaserInit.main); // 47
  mod.AddCallback(ModCallbacks.MC_POST_LASER_UPDATE, postLaserUpdate.main); // 48
  mod.AddCallback(ModCallbacks.MC_POST_KNIFE_INIT, postKnifeInit.main); // 50
  mod.AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, postEffectInit.main); // 54
  mod.AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, postEffectUpdate.main); // 55
  mod.AddCallback(ModCallbacks.MC_POST_BOMB_INIT, postBombInit.main); // 57
  mod.AddCallback(ModCallbacks.MC_POST_BOMB_UPDATE, postBombUpdate.main); // 58
  mod.AddCallback(ModCallbacks.MC_POST_FIRE_TEAR, postFireTear.main); // 61
  mod.AddCallback(ModCallbacks.MC_PRE_GET_COLLECTIBLE, preGetCollectible.main); // 62
  mod.AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, postEntityKill.main); // 68
  mod.AddCallback(
    ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN,
    preRoomEntitySpawn.main,
  ); // 71
}

function registerCallbacksWithExtraArgument(mod: ModUpgraded) {
  useItem.init(mod); // 3
  preUseItem.init(mod); // 23
}

function registerCallbacksCustom(mod: ModUpgraded) {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_GAME_STARTED_REORDERED,
    postGameStarted.main,
  );
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_NEW_LEVEL_REORDERED,
    postNewLevel.main,
  );
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_NEW_ROOM_REORDERED,
    postNewRoom.main,
  );
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PICKUP_COLLECT,
    postPickupCollect.main,
  );
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_ITEM_PICKUP,
    postItemPickup.main,
  );
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_PURCHASE, postPurchase.main);
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_SLOT_DESTROYED,
    postSlotDestroyed.main,
  );
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE,
    postPlayerChangeType.main,
  );
}

function registerCallbacksCustomWithExtraArgument(mod: ModUpgraded) {
  postTrinketBreak.init(mod);
}
