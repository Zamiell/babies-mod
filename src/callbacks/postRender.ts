import {
  getCollectibleItemType,
  getDefaultKColor,
  getHeartsUIWidth,
  getHUDOffsetVector,
  getScreenCenterPos,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import { updateCachedAPIFunctions } from "../cache";
import { VERSION } from "../constants";
import g from "../globals";
import { initSprite } from "../sprite";
import * as timer from "../timer";
import { getCurrentBaby } from "../util";
import { postRenderBabyFunctionMap } from "./postRenderBabyFunctionMap";

const UI_HEARTS_RIGHT_SPACING = 55;

const clockSprite = initSprite("gfx/clock.anm2");

export function main(): void {
  updateCachedAPIFunctions();
  drawVersion();

  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  drawBabyIntro();
  drawBabyNumber();
  drawTempIcon();
  drawBabyEffects();
  timer.display();
}

/** Show what the current baby does in the intro room (or if the player presses the map button). */
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

/** Draw the baby's number next to the heart count. */
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

/**
 * Draw a temporary icon next to the baby's active item to signify that it will go away at the of
 * the floor.
 */
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
