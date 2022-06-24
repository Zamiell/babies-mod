import { log, ModUpgraded, upgradeMod } from "isaacscript-common";
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
import * as postKnifeInit from "./callbacks/postKnifeInit";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postLaserUpdate from "./callbacks/postLaserUpdate";
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
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postGridEntityBroken from "./callbacksCustom/postGridEntityBroken";
import * as postGridEntityInit from "./callbacksCustom/postGridEntityInit";
import * as postGridEntityUpdate from "./callbacksCustom/postGridEntityUpdate";
import * as postItemPickup from "./callbacksCustom/postItemPickup";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPickupCollect from "./callbacksCustom/postPickupCollect";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import * as postPurchase from "./callbacksCustom/postPurchase";
import * as postSlotDestroyed from "./callbacksCustom/postSlotDestroyed";
import * as postTrinketBreak from "./callbacksCustom/postTrinketBreak";
import * as preItemPickup from "./callbacksCustom/preItemPickup";
import { MOD_NAME, VERSION } from "./constants";
import { initCostumeProtector } from "./costumes";
import g from "./globals";

main();

function main() {
  const modVanilla = RegisterMod(MOD_NAME, 1);
  const mod = upgradeMod(modVanilla);

  initCostumeProtector(mod);
  welcomeBanner();

  // Store the mod reference so that we can use it elsewhere. (This is needed for saving and loading
  // the "save.dat" file.)
  g.babiesMod = mod;

  babiesCheckValid();
  registerCallbacksMain(mod);
  registerCallbacksCustom(mod);
}

function welcomeBanner() {
  const welcomeText = `${MOD_NAME} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacksMain(mod: ModUpgraded) {
  postNPCUpdate.init(mod); // 0
  postUpdate.init(mod); // 1
  postRender.init(mod); // 2
  useItem.init(mod); // 3
  postFamiliarUpdate.init(mod); // 6
  postFamiliarInit.init(mod); // 7
  evaluateCache.init(mod); // 8
  postPlayerInit.init(mod); // 9
  usePill.init(mod); // 10
  entityTakeDmg.init(mod); // 11
  inputAction.init(mod); // 13
  executeCmd.init(mod); // 22
  preUseItem.init(mod); // 23
  preEntitySpawn.init(mod); // 24
  postNPCInit.init(mod); // 27
  postPickupInit.init(mod); // 34
  postPickupSelection.init(mod); // 37
  postPickupUpdate.init(mod); // 38
  postTearInit.init(mod); // 39
  postTearUpdate.init(mod); // 40
  preTearCollision.init(mod); // 42
  postProjectileUpdate.init(mod); // 44
  postLaserInit.init(mod); // 47
  postLaserUpdate.init(mod); // 48
  postKnifeInit.init(mod); // 50
  postEffectInit.init(mod); // 54
  postEffectUpdate.init(mod); // 55
  postBombInit.init(mod); // 57
  postBombUpdate.init(mod); // 58
  postFireTear.init(mod); // 61
  preGetCollectible.init(mod); // 62
  postEntityKill.init(mod); // 68
  preRoomEntitySpawn.init(mod); // 71
}

function registerCallbacksCustom(mod: ModUpgraded) {
  postGameStartedReordered.init(mod);
  postNewLevelReordered.init(mod);
  postNewRoomReordered.init(mod);
  postPickupCollect.init(mod);
  preItemPickup.init(mod);
  postItemPickup.init(mod);
  postPurchase.init(mod);
  postPlayerChangeType.init(mod);
  postSlotDestroyed.init(mod);
  postTrinketBreak.init(mod);
  postGridEntityInit.init(mod);
  postGridEntityUpdate.init(mod);
  postGridEntityBroken.init(mod);
}
