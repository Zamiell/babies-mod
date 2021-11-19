import { log, nextSeed } from "isaacscript-common";
import g from "../globals";
import { roomClearedBabyFunctionMap } from "../roomClearedBabyFunctionMap";
import { BabyDescription } from "../types/BabyDescription";
import {
  getCurrentBaby,
  getRoomIndex,
  openAllDoors,
  spawnRandomPickup,
} from "../util";
import * as postRender from "./postRender";
import { postUpdateBabyFunctionMap } from "./postUpdateBabyFunctionMap";

export function main(): void {
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  checkFixWingsBug(baby);
  checkApplyBlindfold(baby);
  checkReloadSprite();
  checkNewPedestalItem();
  checkTrinket();
  checkRoomCleared();

  // Do custom baby effects
  const postUpdateBabyFunction = postUpdateBabyFunctionMap.get(babyType);
  if (postUpdateBabyFunction !== undefined) {
    postUpdateBabyFunction();
  }

  checkSoftlockDestroyPoops();
  checkSoftlockIsland();
  checkGridEntities();
  checkTrapdoor();
}

function checkFixWingsBug(baby: BabyDescription) {
  // Wings don't get applied in the PostGameStarted callback for some reason
  // Re-apply them now if needed
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount === 1) {
    postRender.addWings(baby);
  }
}

function checkApplyBlindfold(baby: BabyDescription) {
  // Racing+ will disable the controls while the player is jumping out of the hole,
  // so for the FireDelay modification to work properly, we have to wait until this is over
  // (the "blindfoldedApplied" is reset in the PostNewLevel callback)
  if (!g.run.level.blindfoldedApplied && g.p.ControlsEnabled) {
    g.run.level.blindfoldedApplied = true;
    if (baby.blindfolded === true) {
      // Make sure the player does not have a tear in the queue
      // (otherwise, if the player had the tear fire button held down while transitioning between
      // floors, they will get one more shot)
      // (this will not work in the EvaluateCache callback because it gets reset to 0 at the end
      // of the frame)
      g.p.FireDelay = 1000000; // 1 million, equal to roughly 9 hours
    } else {
      // If we do not check for a large fire delay, we will get a double tear during the start
      // If we are going from a blindfolded baby to a non-blindfolded baby,
      // we must restore the fire delay to a normal value
      if (g.p.FireDelay > 900) {
        // 30 seconds
        g.p.FireDelay = 0;
      }

      // We also have to restore the fire delay on Incubus, if any
      const incubi = Isaac.FindByType(
        EntityType.ENTITY_FAMILIAR,
        FamiliarVariant.INCUBUS,
      );
      for (const entity of incubi) {
        const incubus = entity.ToFamiliar();
        if (incubus !== undefined && incubus.FireCooldown > 900) {
          // 30 seconds
          incubus.FireCooldown = 0;
        }
      }
    }
  }
}

function checkReloadSprite() {
  // Reapply the co-op baby sprite if we have set to reload it on this frame
  // (this has to be above the below code so that sprites get reloaded on the next frame)
  if (g.run.reloadSprite) {
    g.run.reloadSprite = false;
    postRender.setPlayerSprite();
  }
}

function checkNewPedestalItem() {
  // Reapply the co-op baby sprite after every pedestal item received
  // (and keep track of our passive items over the course of the run)
  if (
    !g.p.IsItemQueueEmpty() &&
    !g.run.queuedItems &&
    g.p.QueuedItem.Item !== undefined
  ) {
    g.run.queuedItems = true;
    if (
      g.p.QueuedItem.Item.Type === ItemType.ITEM_PASSIVE || // 1
      g.p.QueuedItem.Item.Type === ItemType.ITEM_FAMILIAR // 4
    ) {
      g.run.passiveItems.push(g.p.QueuedItem.Item.ID);
    }
  } else if (g.p.IsItemQueueEmpty() && g.run.queuedItems) {
    g.run.queuedItems = false;
    g.run.reloadSprite = true;
    // (if we reload the sprite right now, it won't work with Empty Vessel)
  }
}

// Check to see if this is a trinket baby and they dropped the trinket
function checkTrinket() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Check to see if we are on baby that is supposed to have a permanent trinket
  if (baby.trinket === undefined) {
    return;
  }

  // Check to see if we still have the trinket
  if (g.p.HasTrinket(baby.trinket)) {
    return;
  }

  // Check to see if we smelted / destroyed the trinket
  if (g.run.level.trinketGone) {
    return;
  }

  // Search the room for the dropped trinket
  const trinkets = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TRINKET,
    baby.trinket,
  );
  if (trinkets.length > 0) {
    // Delete the dropped trinket
    const trinket = trinkets[0];
    trinket.Remove();

    // Give it back
    const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
    // This will do nothing if the player does not currently have a trinket
    g.p.DropTrinket(position, true);
    g.p.AddTrinket(baby.trinket);
    // (we cannot cancel the animation or it will cause a bug where the player cannot pick up
    // pedestal items)
    log("Dropped trinket detected; manually giving it back.");
    return;
  }

  // The trinket is gone but it was not found on the floor, so the trinket must have been destroyed
  // (e.g. Walnut)
  g.run.level.trinketGone = true;
  log("Trinket has been destroyed!");

  // Handle special trinket deletion circumstances
  if (baby.name === "Squirrel Baby") {
    // 268
    // The Walnut broke, so spawn additional items
    for (let i = 0; i < 5; i++) {
      const position = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        Vector.Zero,
        undefined,
        0,
        g.run.randomSeed,
      );
    }
  }
}

// Certain babies do things if the room is cleared
function checkRoomCleared() {
  const roomClear = g.r.IsClear();

  // Check the clear status of the room and compare it to what it was a frame ago
  if (roomClear === g.run.room.clearState) {
    return;
  }

  g.run.room.clearState = roomClear;

  if (!roomClear) {
    return;
  }

  roomCleared();
}

function roomCleared() {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const roomClearedBabyFunction = roomClearedBabyFunctionMap.get(babyType);
  if (roomClearedBabyFunction !== undefined) {
    roomClearedBabyFunction();
  }
}

// On certain babies, destroy all poops and TNT barrels after a certain amount of time
function checkSoftlockDestroyPoops() {
  const roomFrameCount = g.r.GetFrameCount();
  const gridSize = g.r.GetGridSize();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Check to see if this baby needs the softlock prevention
  if (baby.softlockPreventionDestroyPoops === undefined) {
    return;
  }

  // Check to see if we already destroyed the grid entities in the room
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough
  if (roomFrameCount < 450) {
    // 15 seconds
    return;
  }

  // Prevent softlocks with poops and TNT barrels on certain babies that are blindfolded
  g.run.room.softlock = true;

  // Kill some grid entities in the room to prevent softlocks in some specific rooms
  // (fireplaces will not cause softlocks since they are killable with The Candle)
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== undefined) {
      const saveState = gridEntity.GetSaveState();
      if (
        saveState.Type === GridEntityType.GRID_TNT || // 12
        saveState.Type === GridEntityType.GRID_POOP // 14
      ) {
        gridEntity.Destroy(true);
      }
    }
  }
  log("Destroyed all poops & TNT barrels to prevent a softlock.");
}

// On certain babies, open the doors after 30 seconds to prevent softlocks with Hosts and island
// enemies
function checkSoftlockIsland() {
  const roomFrameCount = g.r.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Check to see if this baby needs the softlock prevention
  if (baby.softlockPreventionIsland === undefined) {
    return;
  }

  // Check to see if we already opened the doors in the room
  if (g.run.room.softlock) {
    return;
  }

  // Check to see if they have been in the room long enough
  if (roomFrameCount < 900) {
    // 30 seconds
    return;
  }

  g.run.room.softlock = true;
  g.r.SetClear(true);
  openAllDoors();
}

function checkGridEntities() {
  const roomIndex = getRoomIndex();
  const gameFrameCount = g.g.GetFrameCount();
  const gridSize = g.r.GetGridSize();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== undefined) {
      const saveState = gridEntity.GetSaveState();
      if (
        baby.name === "Gold Baby" && // 15
        saveState.Type === GridEntityType.GRID_POOP &&
        saveState.Variant !== PoopGridEntityVariant.GOLDEN
      ) {
        gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
      } else if (
        baby.name === "Ate Poop Baby" && // 173
        saveState.Type === GridEntityType.GRID_POOP &&
        gridEntity.State === 4 // Destroyed
      ) {
        // First, check to make sure that we have not already destroyed this poop
        let found = false;
        for (const killedPoop of g.run.level.killedPoops) {
          if (
            killedPoop.roomIndex === roomIndex &&
            killedPoop.gridIndex === i
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          // Second, check to make sure that there is not any existing pickups already on the poop
          // (the size of a grid square is 40x40)
          const entities = Isaac.FindInRadius(
            gridEntity.Position,
            25,
            EntityPartition.PICKUP,
          );
          if (entities.length === 0) {
            spawnRandomPickup(gridEntity.Position);

            // Keep track of it so that we don't spawn another pickup on the next frame
            g.run.level.killedPoops.push({
              roomIndex,
              gridIndex: i,
            });
          }
        }
      } else if (
        baby.name === "Exploding Baby" && // 320
        g.run.babyFrame === 0 &&
        ((saveState.Type === GridEntityType.GRID_ROCK &&
          saveState.State === 1) || // 2
          (saveState.Type === GridEntityType.GRID_ROCKT &&
            saveState.State === 1) || // 4
          (saveState.Type === GridEntityType.GRID_ROCK_BOMB &&
            saveState.State === 1) || // 5
          (saveState.Type === GridEntityType.GRID_ROCK_ALT &&
            saveState.State === 1) || // 6
          (saveState.Type === GridEntityType.GRID_SPIDERWEB &&
            saveState.State === 0) || // 10
          (saveState.Type === GridEntityType.GRID_TNT &&
            saveState.State !== 4) || // 12
          (saveState.Type === GridEntityType.GRID_POOP &&
            saveState.State !== 4) || // 14
          (saveState.Type === GridEntityType.GRID_ROCK_SS &&
            saveState.State !== 3)) && // 22
        g.p.Position.Distance(gridEntity.Position) <= 36
      ) {
        g.run.invulnerable = true;
        g.p.UseActiveItem(
          CollectibleType.COLLECTIBLE_KAMIKAZE,
          false,
          false,
          false,
          false,
        );
        g.run.invulnerable = false;
        g.run.babyFrame = gameFrameCount + 10;
      }
    }
  }
}

function checkTrapdoor() {
  const playerSprite = g.p.GetSprite();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // If this baby gives a mapping item, we cannot wait until the next floor to remove it because its
  // effect will have already been applied
  // So, we need to monitor for the trapdoor animation
  if (
    !playerSprite.IsPlaying("Trapdoor") &&
    !playerSprite.IsPlaying("Trapdoor2") &&
    !playerSprite.IsPlaying("LightTravel")
  ) {
    return;
  }

  // 21
  if (
    baby.item === CollectibleType.COLLECTIBLE_COMPASS ||
    baby.item2 === CollectibleType.COLLECTIBLE_COMPASS
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS);
  }

  // 54
  if (
    baby.item === CollectibleType.COLLECTIBLE_TREASURE_MAP ||
    baby.item2 === CollectibleType.COLLECTIBLE_TREASURE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP);
  }

  // 246
  if (
    baby.item === CollectibleType.COLLECTIBLE_BLUE_MAP ||
    baby.item2 === CollectibleType.COLLECTIBLE_BLUE_MAP
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_BLUE_MAP);
  }

  // 333
  if (
    baby.item === CollectibleType.COLLECTIBLE_MIND ||
    baby.item2 === CollectibleType.COLLECTIBLE_MIND
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_MIND);
  }
}
