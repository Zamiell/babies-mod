import g from "../globals";
import * as misc from "../misc";
import GlobalsRunBabyTears from "../types/GlobalsRunBabyTears";
import GlobalsRunRoom from "../types/GlobalsRunRoom";
import postNewRoomBabyFunctions from "./postNewRoomBabies";
import * as postRender from "./postRender";

export function main(): void {
  // Update some cached API functions to avoid crashing
  g.l = g.g.GetLevel();
  g.r = g.g.GetRoom();
  const player = Isaac.GetPlayer(0);
  if (player !== null) {
    g.p = player;
  }
  g.seeds = g.g.GetSeeds();
  g.itemPool = g.g.GetItemPool();

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  // Make sure the callbacks run in the right order
  // (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if (
    gameFrameCount === 0 ||
    g.run.level.stage !== stage ||
    g.run.level.stageType !== stageType
  ) {
    return;
  }

  newRoom();
}

export function newRoom(): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();

  // Increment level variables
  g.run.level.roomsEntered += 1;
  if (roomIndex === startingRoomIndex && g.run.level.roomsEntered === 1) {
    // We don't want the starting room of the floor to count towards the rooms entered
    g.run.level.roomsEntered = 0;
  }

  // Reset room-related variables
  g.run.room = new GlobalsRunRoom(roomIndex, roomClear, roomSeed);

  // Reset baby-specific variables
  g.run.babyCountersRoom = 0;
  g.run.babyTears = new GlobalsRunBabyTears();

  // Do nothing if we are not a baby
  const [, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  // Reset the player's sprite, just in case it got messed up
  postRender.setPlayerSprite();

  // Stop drawing the baby intro text once the player goes into a new room
  if (g.run.drawIntro) {
    g.run.drawIntro = false;
  }

  applyTemporaryEffects();
}

function applyTemporaryEffects() {
  // Local variables
  const effects = g.p.GetEffects();
  const canFly = g.p.CanFly;
  const [babyType, baby] = misc.getCurrentBaby();

  // Some babies have flight
  if (baby.flight && !canFly) {
    effects.AddCollectibleEffect(CollectibleType.COLLECTIBLE_BIBLE, true);
  }

  // Apply baby-specific temporary effects
  const babyFunc = postNewRoomBabyFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
  }
}
