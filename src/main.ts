import { log } from "isaacscript-common";
import { babiesCheckValid } from "./babiesCheckValid";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as postBombUpdate from "./callbacks/postBombUpdate";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postFamiliarInit from "./callbacks/postFamiliarInit";
import * as postFamiliarUpdate from "./callbacks/postFamiliarUpdate";
import * as postNPCUpdate from "./callbacks/postNPCUpdate";
import * as postPickupSelection from "./callbacks/postPickupSelection";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postProjectileUpdate from "./callbacks/postProjectileUpdate";
import * as postRender from "./callbacks/postRender";
import * as postTearUpdate from "./callbacks/postTearUpdate";
import * as postUpdate from "./callbacks/postUpdate";
import * as postUseItem from "./callbacks/postUseItem";
import * as postUsePill from "./callbacks/postUsePill";
import * as preEntitySpawn from "./callbacks/preEntitySpawn";
import * as preRoomEntitySpawn from "./callbacks/preRoomEntitySpawn";
import * as preSpawnClearAward from "./callbacks/preSpawnClearAward";
import * as preUseItem from "./callbacks/preUseItem";
import * as entityTakeDmgPlayer from "./callbacksCustom/entityTakeDmgPlayer";
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postGridEntityBroken from "./callbacksCustom/postGridEntityBroken";
import * as postGridEntityInit from "./callbacksCustom/postGridEntityInit";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPickupCollect from "./callbacksCustom/postPickupCollect";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import * as postPurchase from "./callbacksCustom/postPurchase";
import * as postSlotDestroyed from "./callbacksCustom/postSlotDestroyed";
import * as postTrinketBreak from "./callbacksCustom/postTrinketBreak";
import { MOD_NAME, VERSION } from "./constants";
import { initCostumeProtector } from "./costumes";
import { g } from "./globals";
import { mod } from "./mod";

main();

function main() {
  initCostumeProtector();
  welcomeBanner();

  // Store the mod reference so that we can use it elsewhere. (This is needed for saving and loading
  // the "save.dat" file.)
  g.babiesMod = mod;

  babiesCheckValid();
  registerCallbacksMain();
  registerCallbacksCustom();
}

function welcomeBanner() {
  const welcomeText = `${MOD_NAME} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function registerCallbacksMain() {
  postNPCUpdate.init(); // 0
  postUpdate.init(); // 1
  postRender.init(); // 2
  postUseItem.init(); // 3
  postFamiliarUpdate.init(); // 6
  postFamiliarInit.init(); // 7
  evaluateCache.init(); // 8
  postPlayerInit.init(); // 9
  postUsePill.init(); // 10
  executeCmd.init(); // 22
  preUseItem.init(); // 23
  preEntitySpawn.init(); // 24
  postPickupSelection.init(); // 37
  postTearUpdate.init(); // 40
  postProjectileUpdate.init(); // 44
  postEffectUpdate.init(); // 55
  postBombUpdate.init(); // 58
  postEntityKill.init(); // 68
  preSpawnClearAward.init(); // 70
  preRoomEntitySpawn.init(); // 71
}

function registerCallbacksCustom() {
  entityTakeDmgPlayer.init();
  postGameStartedReordered.init();
  postNewLevelReordered.init();
  postNewRoomReordered.init();
  postPickupCollect.init();
  postPurchase.init();
  postPlayerChangeType.init();
  postSlotDestroyed.init();
  postTrinketBreak.init();
  postGridEntityInit.init();
  postGridEntityBroken.init();
}
