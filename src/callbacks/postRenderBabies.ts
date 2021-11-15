import { getRoomVariant } from "isaacscript-common";
import g from "../globals";

const functionMap = new Map<int, () => void>();
export default functionMap;

// Dark Baby
functionMap.set(48, () => {
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
functionMap.set(125, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();
  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_BLACK_MARKET && // 22
    roomVariant !== 2300 && // Krampus
    roomVariant !== 2301 && // Krampus
    roomVariant !== 2302 && // Krampus
    roomVariant !== 2303 && // Krampus
    roomVariant !== 2304 && // Krampus
    roomVariant !== 2305 && // Krampus
    roomVariant !== 2306 // Krampus
  ) {
    const keys = g.p.GetNumKeys();

    // Draw the key count next to the hearts
    const x = 65;
    g.run.babySprite.RenderLayer(0, Vector(x, 12));
    const text = `x${keys}`;
    Isaac.RenderText(text, x + 5, 12, 2, 2, 2, 2);
    // (this looks better without a Droid font)
  }
});

// Mohawk Baby
functionMap.set(138, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();
  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_BLACK_MARKET && // 22
    roomVariant !== 2300 && // Krampus
    roomVariant !== 2301 && // Krampus
    roomVariant !== 2302 && // Krampus
    roomVariant !== 2303 && // Krampus
    roomVariant !== 2304 && // Krampus
    roomVariant !== 2305 && // Krampus
    roomVariant !== 2306 // Krampus
  ) {
    const bombs = g.p.GetNumBombs();

    // Draw the bomb count next to the hearts
    const x = 65;
    g.run.babySprite.RenderLayer(0, Vector(x, 12));
    const text = `x${bombs}`;
    Isaac.RenderText(text, x + 5, 12, 2, 2, 2, 2);
    // (this looks better without a Droid font)
  }
});

// Elf Baby
functionMap.set(377, () => {
  // The Speak of Destiny effect is not spawned in the PostNewRoom callback
  // Thus, we check for it on every frame instead
  // As an unfortunate side effect,
  // the Spear of Destiny will show as the vanilla graphic during room transitions
  const spears = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.SPEAR_OF_DESTINY,
  );
  for (const spear of spears) {
    if (
      spear.GetSprite().GetFilename() === "gfx/1000.083_Spear Of Destiny.anm2"
    ) {
      const sprite = spear.GetSprite();
      sprite.Load("gfx/1000.083_spear of destiny2.anm2", true);
      sprite.Play("Idle", true);
    }
  }
});
