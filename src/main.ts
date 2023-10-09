import {
  initModFeatures,
  log,
  setLogFunctionsGlobal,
  setTracebackFunctionsGlobal,
} from "isaacscript-common";
import { version } from "../package.json";
import { babiesCheckValid } from "./babiesCheckValid";
import type { Baby } from "./classes/Baby";
import { AllCollectiblesFromPool } from "./classes/features/AllCollectiblesFromPool";
import { BabySelection } from "./classes/features/BabySelection";
import { BabyStartingItems } from "./classes/features/BabyStartingItems";
import { BabyStats } from "./classes/features/BabyStats";
import {
  CostumeProtector,
  initCostumeProtector,
} from "./classes/features/CostumeProtector";
import { DetectTrapdoorTouched } from "./classes/features/DetectTrapdoorTouched";
import { DrawBabyDescription } from "./classes/features/DrawBabyDescription";
import { DrawBabyNumber } from "./classes/features/DrawBabyNumber";
import { DrawTempIcon } from "./classes/features/DrawTempIcon";
import { DrawVersion } from "./classes/features/DrawVersion";
import { ExplosionImmunity } from "./classes/features/ExplosionImmunity";
import { GetRandomCollectibleTypeFromPool } from "./classes/features/GetRandomCollectibleTypeFromPool";
import { PseudoRoomClear } from "./classes/features/PseudoRoomClear";
import { RemoveSeeds } from "./classes/features/RemoveSeeds";
import { Shockwaves } from "./classes/features/Shockwaves";
import { SoftlockPrevention } from "./classes/features/SoftlockPrevention";
import { IS_DEV, MOD_NAME } from "./constants";
import type { RandomBabyType } from "./enums/RandomBabyType";
import { enableExtraConsoleCommandsBabiesMod } from "./extraConsoleCommands";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { mod } from "./mod";
import { initModConfigMenu } from "./modConfigMenu";
import { BABIES } from "./objects/babies";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";

const MOD_FEATURES = [
  AllCollectiblesFromPool,
  BabySelection,
  BabyStartingItems,
  BabyStats,
  CostumeProtector,
  DetectTrapdoorTouched,
  DrawBabyDescription,
  DrawBabyNumber,
  DrawTempIcon,
  DrawVersion,
  ExplosionImmunity,
  GetRandomCollectibleTypeFromPool,
  PseudoRoomClear,
  RemoveSeeds,
  Shockwaves,
  SoftlockPrevention,
] as const;

export function main(): void {
  if (IS_DEV) {
    setLogFunctionsGlobal();
    setTracebackFunctionsGlobal();
    mod.saveDataManagerSetGlobal();
  }

  welcomeBanner();
  babiesCheckValid();

  initCostumeProtector();
  initModFeatures(mod, MOD_FEATURES);
  initBabyClassMap(); // This must be after all normal callback registration.
  enableExtraConsoleCommandsBabiesMod();
  initModConfigMenu();
}

function welcomeBanner() {
  const welcomeText = `${MOD_NAME} ${version} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function initBabyClassMap() {
  for (const [babyTypeString, babyRaw] of Object.entries(BABIES)) {
    const babyType = babyTypeString as unknown as RandomBabyType;
    const baby: BabyDescription = babyRaw;

    if (baby.class !== undefined) {
      // eslint-disable-next-line new-cap
      const babyClass = new baby.class(babyType, baby) as Baby;
      babyClass.init();

      const babyClassMap = BABY_CLASS_MAP as Map<RandomBabyType, Baby>;
      babyClassMap.set(babyType, babyClass);
    }
  }
}
