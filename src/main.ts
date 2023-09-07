import {
  initModFeatures,
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import { babiesCheckValid } from "./babiesCheckValid";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as postPlayerInit from "./callbacks/postPlayerInit";
import * as postRender from "./callbacks/postRender";
import * as entityTakeDmgPlayer from "./callbacksCustom/entityTakeDmgPlayer";
import * as postGameStartedReordered from "./callbacksCustom/postGameStartedReordered";
import * as postNewLevelReordered from "./callbacksCustom/postNewLevelReordered";
import * as postNewRoomReordered from "./callbacksCustom/postNewRoomReordered";
import * as postPlayerChangeType from "./callbacksCustom/postPlayerChangeType";
import type { Baby } from "./classes/Baby";
import { PseudoRoomClear } from "./classes/features/PseudoRoomClear";
import { Shockwaves } from "./classes/features/Shockwaves";
import { SoftlockPrevention } from "./classes/features/SoftlockPrevention";
import { IS_DEV, MOD_NAME, VERSION } from "./constants";
import { initCostumeProtector } from "./costumes";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { mod } from "./mod";
import { BABIES } from "./objects/babies";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";

const MOD_FEATURES = [PseudoRoomClear, Shockwaves, SoftlockPrevention] as const;

export function main(): void {
  if (IS_DEV) {
    setLogFunctionsGlobal();
    setTracebackFunctionsGlobal();
    mod.saveDataManagerSetGlobal();
  }

  welcomeBanner();
  babiesCheckValid();

  initCostumeProtector();
  registerCallbacksMain();
  registerCallbacksCustom();
  initModFeatures(mod, MOD_FEATURES);
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
  evaluateCache.init(); // 8
  postPlayerInit.init(); // 9
  executeCmd.init(); // 22
}

function registerCallbacksCustom() {
  entityTakeDmgPlayer.init();
  postGameStartedReordered.init();
  postNewLevelReordered.init();
  postNewRoomReordered.init();
  postPlayerChangeType.init();
}

/**
 * We want to only instantiate the baby classes after the normal callbacks have been registered.
 * This is because we need to cache some API calls in order to prevent crashes.
 */
function initBabyClassMap() {
  for (const [babyTypeString, babyRaw] of Object.entries(BABIES)) {
    const babyType = babyTypeString as unknown as RandomBabyType;
    const baby = babyRaw as BabyDescription;

    if (baby.class !== undefined) {
      // eslint-disable-next-line new-cap
      const babyClass = new baby.class(babyType, baby) as Baby;
      babyClass.init();

      const babyClassMap = BABY_CLASS_MAP as Map<RandomBabyType, Baby>;
      babyClassMap.set(babyType, babyClass);
    }
  }
}
