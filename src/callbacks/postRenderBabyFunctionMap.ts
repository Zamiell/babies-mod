import {
  getEffects,
  getHUDOffsetVector,
  getRoomVariant,
} from "isaacscript-common";
import { KRAMPUS_ROOM_VARIANTS } from "../constants";
import g from "../globals";

export const postRenderBabyFunctionMap = new Map<int, () => void>();

// Dark Baby
postRenderBabyFunctionMap.set(48, () => {
  // Temporary blindness
  // Set the current fade
  // (which is based on the game's frame count and set in the PostUpdate callback)
  if (g.run.babySprite !== null) {
    let opacity = g.run.babyCounters / 90;
    if (opacity > 1) {
      opacity = 1;
    }
    g.run.babySprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
    g.run.babySprite.RenderLayer(0, Vector.Zero);
  }
});

// Hopeless Baby
postRenderBabyFunctionMap.set(125, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();
  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_BLACK_MARKET && // 22
    !KRAMPUS_ROOM_VARIANTS.has(roomVariant)
  ) {
    const keys = g.p.GetNumKeys();

    // Draw the key count next to the hearts
    const HUDOffsetVector = getHUDOffsetVector();
    const x = 65 + HUDOffsetVector.X;
    const y = 12;
    const position = Vector(x, y);
    g.run.babySprite.RenderLayer(0, position);
    const text = `x${keys}`;
    Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    // (this looks better without a Droid font)
  }
});

// Mohawk Baby
postRenderBabyFunctionMap.set(138, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();
  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_BLACK_MARKET && // 22
    !KRAMPUS_ROOM_VARIANTS.has(roomVariant)
  ) {
    const bombs = g.p.GetNumBombs();

    // Draw the bomb count next to the hearts
    const HUDOffsetVector = getHUDOffsetVector();
    const x = 65 + HUDOffsetVector.X;
    const y = 12;
    const position = Vector(x, y);
    g.run.babySprite.RenderLayer(0, position);
    const text = `x${bombs}`;
    Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    // (this looks better without a Droid font)
  }
});

// Elf Baby
postRenderBabyFunctionMap.set(377, () => {
  // The Speak of Destiny effect is not spawned in the PostNewRoom callback
  // Thus, we check for it on every frame instead
  // As an unfortunate side effect,
  // the Spear of Destiny will show as the vanilla graphic during room transitions
  const spears = getEffects(EffectVariant.SPEAR_OF_DESTINY);
  for (const spear of spears) {
    const sprite = spear.GetSprite();
    const filename = sprite.GetFilename();

    if (filename === "gfx/1000.083_Spear Of Destiny.anm2") {
      sprite.Load("gfx/1000.083_spear of destiny2.anm2", true);
      sprite.Play("Idle", true);
    }
  }
});
