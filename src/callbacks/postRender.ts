import {
  addCollectibleCostume,
  getCollectibleItemType,
  getDefaultKColor,
  getHeartsUIWidth,
  getHUDOffsetVector,
  getScreenCenterPos,
  isActionPressedOnAnyInput,
  log,
  removeCollectibleCostume,
} from "isaacscript-common";
import { updateCachedAPIFunctions } from "../cache";
import { VERSION } from "../constants";
import g from "../globals";
import { initSprite } from "../sprite";
import * as timer from "../timer";
import { BabyDescription } from "../types/BabyDescription";
import { getCurrentBaby } from "../util";
import { postRenderBabyFunctionMap } from "./postRenderBabyFunctionMap";

// Constants
const CUSTOM_PLAYER_ANM2 = "gfx/001.000_player_custom_baby.anm2";
const PLAYER_SPRITESHEET_LAYERS = 12;
const LAST_BABY_WITH_SPRITE_IN_PLAYER2_DIRECTORY = 521;
const UI_HEARTS_RIGHT_SPACING = 55;

// Variables
const clockSprite = initSprite("gfx/clock.anm2");

export function main(): void {
  updateCachedAPIFunctions();
  drawVersion();

  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  checkPlayerSprite();
  drawBabyIntro();
  drawBabyNumber();
  drawTempIcon();
  drawBabyEffects();
  timer.display();
}

// This function handles redrawing the player's sprite, if necessary
function checkPlayerSprite() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomFrameCount = g.r.GetFrameCount();

  // Remove extra costumes while the game is fading in and/or loading
  if (gameFrameCount === 0) {
    g.p.ClearCostumes();
  }

  // Fix the bug where fully charging Maw of the Void will occasionally make the player invisible
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID)) {
    removeCollectibleCostume(g.p, CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID);
  }

  // Certain costumes are applied one frame after entering a room
  if (roomFrameCount === 0) {
    // 122
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)) {
      // Even though we blanked out the costumes for Whore of Babylon, we also have to also remove
      // the costume or else the player sprite will be invisible permanently
      removeCollectibleCostume(
        g.p,
        CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON,
      );
    }

    // 409
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)) {
      // Even though we blanked out the costumes for Empty Vessel, we also have to also remove the
      // costume or else the player sprite will be invisible permanently
      g.p.TryRemoveNullCostume(NullItemID.ID_EMPTY_VESSEL);
    }
  }

  /*

  Certain costumes are loaded immediately after triggering a room transition and they are locked in
  to the slide animation. The only way to fix this is to blank out the entire costume.
  This applies to.
  - Whore of Babylon (122) - costume_073_whoreofbabylon.png
  - Fate (179) - costume_179_fate.png & 6 others for each color
      The costume is not completely blanked out;
      only the body is removed so that we can add only the wings.
      We also need to modify the "179_fate.anm2" file so that we can swap the layer that the wings
      are applied to.
  - Anemic (214) - costume_214_anemic.png
  - Taurus (235) - costume_235_taurus.png and 6 others for each color
      The costume is only applied when entering a room for the first time.
  - Purity (407) - costume_407_purity.png
  - Empty Vessel (409) - emptyvessel body.png and emptyvessel head.png
  - Dad's Ring (546) - costume_546_dadsring.png
      The costume is applied one frame after entering the room, similar to Whore of Babylon.
      If we remove the costume in code, it also removes the ring, which we don't want,
      so we just blank out the costume.

  */

  trackPlayerAnimations();
}

function trackPlayerAnimations() {
  const playerSprite = g.p.GetSprite();

  // Get the currently playing animation
  const animations = [
    "Pickup",
    "Hit",
    "Sad",
    "Happy",
    "PickupWalkDown",
    "PickupWalkLeft",
    "PickupWalkUp",
    "PickupWalkRight",
  ];
  let currentlyPlayingAnimation = "";
  for (const animation of animations) {
    if (playerSprite.IsPlaying(animation)) {
      currentlyPlayingAnimation = animation;
      break;
    }
  }

  // Set if the animation has changed
  // PickupWalkDown should be treated the same as PickupWalkLeft, so get the prefixes
  const pickupWalkLength = "PickupWalk".length;
  const prefix1 = string.sub(currentlyPlayingAnimation, 0, pickupWalkLength);
  const prefix2 = string.sub(g.run.animation, 0, pickupWalkLength);
  if (prefix1 !== prefix2) {
    g.run.animation = currentlyPlayingAnimation;

    // Certain animations will mess up the player's sprite when certain items are in the inventory
    // (Brimstone, Ipecac, etc.)
    if (currentlyPlayingAnimation !== "") {
      setPlayerSprite();
      playerSprite.Play(currentlyPlayingAnimation, false);
    }
  }
}

// This is called:
// - at the beginning of a level
// - after each item is applied
// - after a death
// - after an animation is played
// - on the 0th frame of a run
//   (to fix the bug where wings don't get applied in the PostGameStarted callback)
export function setPlayerSprite(): void {
  const playerSprite = g.p.GetSprite();
  const effects = g.p.GetEffects();
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // We don't want any costumes to apply to co-op babies, since they will appear misaligned
  g.p.ClearCostumes();

  // Make exceptions for certain costumes
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_DADS_RING)) {
    addCollectibleCostume(g.p, CollectibleType.COLLECTIBLE_DADS_RING);
  }
  // (for some reason, Empty Vessel makes the sprite flicker when playing certain animations;
  // there is no known workaround for this)

  addWings(baby);

  // If the player currently has a shield, clearing the costumes will remove the shield graphic
  // If there is a shield, add the costume back
  if (
    effects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS)
  ) {
    addCollectibleCostume(g.p, CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS);
  }

  // Replace the player sprite with a co-op baby version
  // Most of the babies use the vanilla baby sprites
  // We also make some extra babies that use familiar sprites,
  // and we insert these at the end of the array
  const gfxDirectory =
    babyType <= LAST_BABY_WITH_SPRITE_IN_PLAYER2_DIRECTORY
      ? "gfx/characters/player2"
      : "gfx/familiar";
  playerSprite.Load(CUSTOM_PLAYER_ANM2, false);
  for (let i = 0; i <= PLAYER_SPRITESHEET_LAYERS; i++) {
    playerSprite.ReplaceSpritesheet(i, `${gfxDirectory}/${baby.sprite}`);
  }
  playerSprite.LoadGraphics();
  log("Applied custom baby anm2.");
}

export function addWings(baby: BabyDescription): void {
  const hearts = g.p.GetHearts();

  // It is hard to tell that the player can fly with all costumes removed,
  // so represent that the player has flight with Fate's wings
  if (
    // Empty Vessel takes a frame to activate after entering a new room,
    // so detect the flight status manually
    (g.p.CanFly ||
      (g.p.HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL) &&
        hearts === 0)) &&
    // Make an exception for Butterfly Baby 2 because it already has wings
    baby.name !== "Butterfly Baby 2" // 332
  ) {
    addCollectibleCostume(g.p, CollectibleType.COLLECTIBLE_FATE);
  }
}

// Show what the current baby does in the intro room (or if the player presses the map button)
function drawBabyIntro() {
  const gameFrameCount = g.g.GetFrameCount();
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Make the baby description persist on the screen after the player presses the map button
  if (isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    g.run.showIntroFrame = gameFrameCount + 60; // 2 seconds
  }

  if (gameFrameCount > g.run.showIntroFrame) {
    return;
  }

  const centerPos = getScreenCenterPos();
  const scale = 1.75;

  let text: string;
  let x: number;
  let y: number;

  // Render the baby's name
  text = baby.name;
  x = centerPos.X - 3 * scale * text.length;
  y = centerPos.Y - 130;
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);

  // Render the baby's description
  text = baby.description;
  x = centerPos.X - 3 * text.length;
  y += 25;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  // The description might be really long and spill over onto a second line
  if (baby.description2 !== undefined) {
    text = baby.description2;
    x = centerPos.X - 3 * text.length;
    y = centerPos.Y - 40;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  }
}

// Draw the baby's number next to the heart count
function drawBabyNumber() {
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const HUDOffsetVector = getHUDOffsetVector();
  const heartsUIWidth = getHeartsUIWidth();

  const text = `#${babyType}`;

  let x = HUDOffsetVector.X + heartsUIWidth + UI_HEARTS_RIGHT_SPACING;
  if (
    baby.name === "Hopeless Baby" || // 125
    baby.name === "Mohawk Baby" // 138
  ) {
    // These babies draw text next to the hearts,
    // so account for this so that the number text does not overlap
    x += 20;
  }

  const y = 10;

  g.font.droid.DrawString(text, x, y, getDefaultKColor(), 0, true);
}

function drawVersion() {
  const gameFrameCount = g.g.GetFrameCount();
  const isPaused = g.g.IsPaused();

  if (isPaused) {
    return;
  }

  // Make the version persist for at least 2 seconds after the player presses "v"
  if (Input.IsButtonPressed(Keyboard.KEY_V, 0)) {
    g.run.showVersionFrame = gameFrameCount + 60;
  }

  if (g.run.showVersionFrame === 0 || gameFrameCount > g.run.showVersionFrame) {
    return;
  }

  const centerPos = getScreenCenterPos();
  let text: string;
  let scale: int;
  let x: number;
  let y: number;

  // Render the version of the mod
  text = "The Babies Mod";
  scale = 1;
  x = centerPos.X - 3 * scale * text.length;
  y = centerPos.Y;
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);

  text = VERSION;
  scale = 1;
  x = centerPos.X - 3 * scale * text.length;
  y = centerPos.Y + 15;
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);
}

// Draw a temporary icon next to the baby's active item to signify that it will go away at the of
// the floor
function drawTempIcon() {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  if (baby.item === undefined) {
    return;
  }
  const itemType = getCollectibleItemType(baby.item);
  if (itemType !== ItemType.ITEM_ACTIVE) {
    return;
  }

  const clockX = 30;
  const clockY = 30;
  if (g.p.HasCollectible(baby.item)) {
    // The player has the item in their main active slot
    // Draw the icon in the bottom-right hand corner
    clockSprite.RenderLayer(0, Vector(clockX, clockY));
  }
}

function drawBabyEffects() {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  const postRenderBabyFunction = postRenderBabyFunctionMap.get(babyType);
  if (postRenderBabyFunction !== undefined) {
    postRenderBabyFunction();
  }
}
