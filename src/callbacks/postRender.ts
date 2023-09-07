import {
  ActiveSlot,
  ItemType,
  Keyboard,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  game,
  getCollectibleItemType,
  getScreenCenterPos,
  isKeyboardPressed,
} from "isaacscript-common";
import { MOD_NAME, VERSION } from "../constants";
import { g } from "../globals";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { newSprite } from "../sprite";
import { getCurrentBaby } from "../utilsBaby";

const CLOCK_POSITION = Vector(30, 30);
const CLOCK_SPRITE = newSprite("gfx/clock.anm2");

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  drawVersion();

  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { baby } = currentBaby;

  drawTempIconNextToActiveCollectible(baby);
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
  if (baby.collectible === undefined) {
    return;
  }

  const itemType = getCollectibleItemType(baby.collectible);
  if (itemType !== ItemType.ACTIVE) {
    return;
  }

  const player = Isaac.GetPlayer();
  const activeCollectibleType = player.GetActiveItem(ActiveSlot.PRIMARY);
  if (activeCollectibleType !== baby.collectible) {
    return;
  }

  // The player has the item in their main active slot. Draw the icon in the bottom-right hand
  // corner.
  CLOCK_SPRITE.Render(CLOCK_POSITION);
}
