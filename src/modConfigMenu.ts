import { mod } from "./mod";

type ConfigDescription = readonly [
  configName: keyof Config,
  optionType: ModConfigMenuOptionType,
  title: string,
  description: string,
];

type ConfigDescriptions = readonly ConfigDescription[];

class Config {
  showBabyNumber = true;
  showBabyDescriptionOnNewFloor = true;
  showBabyDescriptionOnButtonPress = true;
}

const CATEGORY_NAME = "The Babies Mod";

const CONFIG_DESCRIPTIONS = [
  [
    "showBabyNumber",
    ModConfigMenuOptionType.BOOLEAN,
    "Show baby number",
    "Draw the baby number on the screen in the top-left corner, next to the hearts.",
  ],
  [
    "showBabyDescriptionOnNewFloor",
    ModConfigMenuOptionType.BOOLEAN,
    "Show baby description on new floor",
    "Draw the baby description in the center of the screen upon reaching a new floor.",
  ],
  [
    "showBabyDescriptionOnButtonPress",
    ModConfigMenuOptionType.BOOLEAN,
    "Show baby description on map press",
    "Draw the baby description in the center of the screen upon pressing the map button.",
  ],
] as const satisfies ConfigDescriptions;

const v = {
  persistent: {
    config: new Config(),
  },
};

export const { config } = v.persistent;

export function initModConfigMenu(): void {
  mod.saveDataManager("modConfigMenu", v);

  if (ModConfigMenu === undefined) {
    return;
  }

  deleteOldConfig(CATEGORY_NAME);
  registerSubMenuConfig("Options", CONFIG_DESCRIPTIONS);
}

/** From Racing+. */
function deleteOldConfig(categoryName: string) {
  if (ModConfigMenu === undefined) {
    return;
  }

  // If we reload the mod, then it will create duplicates of every entry. Thus, we must first purge
  // all settings relating to the mod.
  const categoryID = ModConfigMenu.GetCategoryIDByName(categoryName);
  if (categoryID !== undefined) {
    ModConfigMenu.MenuData.set(categoryID, {
      Name: categoryName,
      Subcategories: [],
    });
  }
}

/** From Racing+. */
function registerSubMenuConfig(
  subMenuName: string,
  configDescriptions: ConfigDescriptions,
) {
  if (ModConfigMenu === undefined) {
    return;
  }

  for (const [
    configName,
    optionType,
    title,
    description,
  ] of configDescriptions) {
    ModConfigMenu.AddSetting(CATEGORY_NAME, subMenuName, {
      Type: optionType,
      CurrentSetting: () => config[configName],
      Display: () => getDisplayTextBoolean(configName, title),
      OnChange: (newValue: number | boolean | undefined) => {
        if (newValue === undefined) {
          return;
        }

        config[configName] = newValue as boolean;
        mod.saveDataManagerSave();
      },
      Info: [description],
    });
  }
}

/** From Racing+. */
function getDisplayTextBoolean(
  configName: keyof Config,
  shortDescription: string,
): string {
  const currentValue = config[configName];
  return `${shortDescription}: ${onOff(currentValue)}`;
}

function onOff(setting: boolean): string {
  return setting ? "ON" : "OFF";
}
