import * as entityTakeDmg from "./callbacks/entityTakeDmg";
import * as evaluateCache from "./callbacks/evaluateCache";
import * as executeCmd from "./callbacks/executeCmd";
import * as familiarInit from "./callbacks/familiarInit";
import * as familiarUpdate from "./callbacks/familiarUpdate";
import * as inputAction from "./callbacks/inputAction";
import * as NPCUpdate from "./callbacks/NPCUpdate";
import * as postBombInit from "./callbacks/postBombInit";
import * as postBombUpdate from "./callbacks/postBombUpdate";
import * as postEffectInit from "./callbacks/postEffectInit";
import * as postEffectUpdate from "./callbacks/postEffectUpdate";
import * as postEntityKill from "./callbacks/postEntityKill";
import * as postFireTear from "./callbacks/postFireTear";
import * as postGameStarted from "./callbacks/postGameStarted";
import * as postKnifeInit from "./callbacks/postKnifeInit";
import * as postLaserInit from "./callbacks/postLaserInit";
import * as postLaserUpdate from "./callbacks/postLaserUpdate";
import * as postNewLevel from "./callbacks/postNewLevel";
import * as postNewRoom from "./callbacks/postNewRoom";
import * as postNPCInit from "./callbacks/postNPCInit";
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
import * as useCard from "./callbacks/useCard";
import * as useItem from "./callbacks/useItem";
import * as usePill from "./callbacks/usePill";
import { VERSION } from "./constants";
import g from "./globals";
import log from "./log";
import { getItemConfig } from "./misc";
import { CollectibleTypeCustom } from "./types/enums";

main();

function main() {
  const babiesMod = RegisterMod("The Babies Mod", 1);
  welcomeBanner();

  // Make a copy of this object so that we can use it elsewhere
  g.babiesMod = babiesMod; // (this is needed for saving and loading the "save.dat" file)

  checkBabiesDuplicateName();
  checkBabiesDuplicateItem();
  checkBabiesDuplicateTrinket();

  registerCallbacks(babiesMod);
}

function welcomeBanner() {
  const modName = "The Babies Mod";
  const welcomeText = `${modName} ${VERSION} initialized.`;
  const hyphens = "-".repeat(welcomeText.length);
  const welcomeTextBorder = `+-${hyphens}-+`;
  log(welcomeTextBorder);
  log(`| ${welcomeText} |`);
  log(welcomeTextBorder);
}

function checkBabiesDuplicateName() {
  const nameMap = new Map<string, boolean>();
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (nameMap.has(baby.name)) {
      log(`ERROR: Baby #${i} has a duplicate name: ${baby.name}`);
    } else {
      nameMap.set(baby.name, true);
    }
  }
}

function checkBabiesDuplicateItem() {
  const itemExceptions: Array<CollectibleType | CollectibleTypeCustom> = [
    CollectibleType.COLLECTIBLE_POOP, // 36
    CollectibleType.COLLECTIBLE_MOMS_KNIFE, // 114
    CollectibleType.COLLECTIBLE_BRIMSTONE, // 118
    CollectibleType.COLLECTIBLE_PONY, // 130
    CollectibleType.COLLECTIBLE_CANDLE, // 164
    CollectibleType.COLLECTIBLE_EPIC_FETUS, // 168
    CollectibleType.COLLECTIBLE_SACRIFICIAL_DAGGER, // 172
    CollectibleType.COLLECTIBLE_ABEL, // 188
    CollectibleType.COLLECTIBLE_SAD_BOMBS, // 220
    CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
    CollectibleType.COLLECTIBLE_HOW_TO_JUMP, // 282
    CollectibleType.COLLECTIBLE_THE_WIZ, // 358
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
    CollectibleType.COLLECTIBLE_MARKED, // 394
  ];
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (baby.item !== undefined && baby.item2 === undefined) {
      for (let j = 0; j < g.babies.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = g.babies[j];
        if (
          baby2.item !== undefined &&
          baby2.item2 === undefined &&
          baby2.item === baby.item &&
          !itemExceptions.includes(baby.item)
        ) {
          log(`ERROR: Baby #${i} has a duplicate item: ${baby.item}`);
        }
      }
    }

    if (baby.item !== undefined && baby.item2 !== undefined) {
      for (let j = 0; j < g.babies.length; j++) {
        if (i === j) {
          continue;
        }

        const baby2 = g.babies[j];
        if (
          baby2.item !== undefined &&
          baby2.item2 !== undefined &&
          (baby2.item === baby.item || baby2.item2 === baby.item) &&
          (baby2.item === baby.item2 || baby2.item2 === baby.item2)
        ) {
          log(
            `ERROR: Baby #${i} has a duplicate pair of items: ${baby.item} & ${baby.item2}`,
          );
        }
      }
    }

    if (
      baby.item2 !== undefined &&
      getItemConfig(baby.item2).Type === ItemType.ITEM_ACTIVE
    ) {
      log(`ERROR: Baby #${i} has an active item in the second slot.`);
    }
  }
}

function checkBabiesDuplicateTrinket() {
  const trinketMap = new Map<TrinketType, boolean>();
  for (let i = 0; i < g.babies.length; i++) {
    const baby = g.babies[i];

    if (baby.trinket !== undefined) {
      if (trinketMap.has(baby.trinket)) {
        log(`ERROR: Baby #${i} has a duplicate trinket: ${baby.trinket}`);
      } else {
        trinketMap.set(baby.trinket, true);
      }
    }
  }
}

function registerCallbacks(mod: Mod) {
  registerMiscCallbacks(mod);

  // Register callbacks that take a 3rd argument for a specific thing
  useItem.init(mod); // 3
  useCard.init(mod); // 5
  preUseItem.init(mod); // 23
}

function registerMiscCallbacks(mod: Mod) {
  mod.AddCallback(ModCallbacks.MC_NPC_UPDATE, NPCUpdate.main); // 0
  mod.AddCallback(ModCallbacks.MC_POST_UPDATE, postUpdate.main); // 1
  mod.AddCallback(ModCallbacks.MC_POST_RENDER, postRender.main); // 2
  mod.AddCallback(ModCallbacks.MC_USE_ITEM, useItem.main); // 3
  mod.AddCallback(ModCallbacks.MC_FAMILIAR_UPDATE, familiarUpdate.main); // 6
  mod.AddCallback(ModCallbacks.MC_FAMILIAR_INIT, familiarInit.main); // 7
  mod.AddCallback(ModCallbacks.MC_EVALUATE_CACHE, evaluateCache.main); // 8
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, postPlayerInit.main); // 9
  mod.AddCallback(ModCallbacks.MC_USE_PILL, usePill.main); // 10
  mod.AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, entityTakeDmg.main); // 11
  mod.AddCallback(ModCallbacks.MC_INPUT_ACTION, inputAction.main); // 13
  mod.AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted.main); // 15
  mod.AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, postNewLevel.main); // 18
  mod.AddCallback(ModCallbacks.MC_POST_NEW_ROOM, postNewRoom.main); // 19
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
