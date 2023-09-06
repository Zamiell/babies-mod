import {
  ActiveSlot,
  ButtonAction,
  ItemType,
  Keyboard,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  KColorDefault,
  fonts,
  game,
  getCollectibleItemType,
  getHUDOffsetVector,
  getHeartsUIWidth,
  getScreenCenterPos,
  inRoomType,
  isActionPressedOnAnyInput,
  isKeyboardPressed,
} from "isaacscript-common";
import { MOD_NAME, VERSION } from "../constants";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { newSprite } from "../sprite";
import * as timer from "../timer";
import { isRacingPlusEnabled } from "../utils";
import { getCurrentBaby } from "../utilsBaby";

const UI_HEARTS_RIGHT_SPACING = 55;
const CLOCK_POSITION = Vector(30, 30);

const clockSprite = newSprite("gfx/clock.anm2");

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  drawVersion();

  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { babyType, baby } = currentBaby;

  drawBabyIntro(baby);
  drawBabyNumber(babyType);
  drawTempIconNextToActiveCollectible(baby);
  timer.display();
}

/** Show what the current baby does in the intro room (or if the player presses the map button). */
function drawBabyIntro(baby: BabyDescription) {
  const gameFrameCount = game.GetFrameCount();

  // Make the baby description persist on the screen after the player presses the map button.
  if (isActionPressedOnAnyInput(ButtonAction.MAP)) {
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

  // Render the baby's name.
  text = baby.name;
  x = centerPos.X - 3 * scale * text.length;
  y = centerPos.Y - 130;
  Isaac.RenderScaledText(text, x, y, scale, scale, 2, 2, 2, 2);

  // Render the baby's description.
  text = baby.description;
  x = centerPos.X - 3 * text.length;
  y += 25;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  // The description might be really long and spill over onto a second line.
  if (baby.description2 !== undefined) {
    text = baby.description2;
    x = centerPos.X - 3 * text.length;
    y += 15;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  }
}

/** Draw the baby's number next to the heart count. */
function drawBabyNumber(babyType: RandomBabyType) {
  const HUDOffsetVector = getHUDOffsetVector();
  const heartsUIWidth = getHeartsUIWidth();

  // Racing+ draws the number of sacrifices in the top left corner, which interferes with the baby
  // number text.
  if (isRacingPlusEnabled() && inRoomType(RoomType.SACRIFICE)) {
    return;
  }

  const text = `#${babyType}`;

  let x = HUDOffsetVector.X + heartsUIWidth + UI_HEARTS_RIGHT_SPACING;
  if (
    babyType === RandomBabyType.HOPELESS || // 125
    babyType === RandomBabyType.MOHAWK // 138
  ) {
    // These babies draw text next to the hearts, so account for this so that the number text does
    // not overlap.
    x += 20;
  }

  const y = 10;

  fonts.droid.DrawString(text, x, y, KColorDefault, 0, true);
}

function drawVersion() {
  const gameFrameCount = game.GetFrameCount();
  const isPaused = game.IsPaused();

  if (isPaused) {
    return;
  }

  // Make the version persist for at least 2 seconds after the player presses "v".
  if (isKeyboardPressed(Keyboard.V)) {
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

  // Render the version of the mod.
  text = MOD_NAME;
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
function drawTempIconNextToActiveCollectible(baby: BabyDescription) {
  if (baby.item === undefined) {
    return;
  }

  const itemType = getCollectibleItemType(baby.item);
  if (itemType !== ItemType.ACTIVE) {
    return;
  }

  const player = Isaac.GetPlayer();
  const activeCollectibleType = player.GetActiveItem(ActiveSlot.PRIMARY);
  if (activeCollectibleType !== baby.item) {
    return;
  }

  // The player has the item in their main active slot. Draw the icon in the bottom-right hand
  // corner.
  clockSprite.Render(CLOCK_POSITION);
}
