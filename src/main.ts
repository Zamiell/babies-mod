import {
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import { babiesCheckValid } from "./babiesCheckValid";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postRender from "./callbacks/postRender";
import * as postUseItem from "./callbacks/postUseItem";
import * as entityTakeDmgPlayer from "./callbacksCustom/entityTakeDmgPlayer";
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPEffectUpdateReordered from "./callbacksCustom/postPEffectUpdateReordered";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import { Baby } from "./classes/Baby";
import { IS_DEV, MOD_NAME, VERSION } from "./constants";
import { initCostumeProtector } from "./costumes";
import { RandomBabyType } from "./enums/RandomBabyType";
import { mod } from "./mod";
import { BABIES } from "./objects/babies";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";

main();

function main() {
  if (IS_DEV) {
    setLogFunctionsGlobal();
    setTracebackFunctionsGlobal();
    mod.saveDataManagerSetGlobal();
  }

  initCostumeProtector();
  welcomeBanner();
  babiesCheckValid();
  registerCallbacksMain();
  registerCallbacksCustom();
  initBabyClassMap(); // This must be after all normal callback registration.
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
  postRender.init(); // 2
  postUseItem.init(); // 3
  evaluateCache.init(); // 8
  postPlayerInit.init(); // 9
  executeCmd.init(); // 22
  postEntityKill.init(); // 68
}

function registerCallbacksCustom() {
  entityTakeDmgPlayer.init();
  postGameStartedReordered.init();
  postNewLevelReordered.init();
  postNewRoomReordered.init();
  postPEffectUpdateReordered.init();
  postPlayerChangeType.init();
}

/**
 * We want to only instantiate the baby classes after the normal callbacks have been registered.
 * This is because we need to cache some API calls in order to prevent crashes.
 */
function initBabyClassMap() {
  for (const [babyTypeString, babyDescription] of Object.entries(BABIES)) {
    const babyType = babyTypeString as unknown as RandomBabyType;

    if ("class" in babyDescription) {
      const babyClassMap = BABY_CLASS_MAP as Map<RandomBabyType, Baby>;
      // eslint-disable-next-line new-cap
      const babyClass = new babyDescription.class(babyType, babyDescription);
      babyClassMap.set(babyType, babyClass);
    }
  }
}
