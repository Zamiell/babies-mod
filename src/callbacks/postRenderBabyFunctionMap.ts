import {
  EffectVariant,
  MinibossID,
  RoomType,
} from "isaac-typescript-definitions";
import {
  getEffects,
  getHUDOffsetVector,
  inMinibossRoomOf,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";

export const postRenderBabyFunctionMap = new Map<RandomBabyType, () => void>();

// 48
postRenderBabyFunctionMap.set(RandomBabyType.DARK, () => {
  // Temporary blindness. Set the current fade (which is based on the game's frame count and set in
  // the `POST_UPDATE` callback).
  if (g.run.babySprite !== null) {
    let opacity = g.run.babyCounters / 90;
    if (opacity > 1) {
      opacity = 1;
    }
    g.run.babySprite.Color = Color(1, 1, 1, opacity);
    g.run.babySprite.RenderLayer(0, VectorZero);
  }
});

// 125
postRenderBabyFunctionMap.set(RandomBabyType.HOPELESS, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const keys = g.p.GetNumKeys();
  const inKrampusRoom = inMinibossRoomOf(MinibossID.KRAMPUS);

  if (
    roomType !== RoomType.DEVIL && // 14
    roomType !== RoomType.BLACK_MARKET && // 22
    !inKrampusRoom
  ) {
    // Draw the key count next to the hearts.
    const HUDOffsetVector = getHUDOffsetVector();
    const x = 65 + HUDOffsetVector.X;
    const y = 12;
    const position = Vector(x, y);
    g.run.babySprite.RenderLayer(0, position);
    const text = `x${keys}`;
    Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
  }
});

// 138
postRenderBabyFunctionMap.set(RandomBabyType.MOHAWK, () => {
  if (g.run.babySprite === null) {
    return;
  }

  const roomType = g.r.GetType();
  const bombs = g.p.GetNumBombs();
  const inKrampusRoom = inMinibossRoomOf(MinibossID.KRAMPUS);

  if (
    roomType !== RoomType.DEVIL && // 14
    roomType !== RoomType.BLACK_MARKET && // 22
    !inKrampusRoom
  ) {
    // Draw the bomb count next to the hearts.
    const HUDOffsetVector = getHUDOffsetVector();
    const x = 65 + HUDOffsetVector.X;
    const y = 12;
    const position = Vector(x, y);
    g.run.babySprite.RenderLayer(0, position);
    const text = `x${bombs}`;
    Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
  }
});

// 377
postRenderBabyFunctionMap.set(RandomBabyType.ELF, () => {
  // The Speak of Destiny effect is not spawned in the `POST_NEW_ROOM` callback. Thus, we check for
  // it on every frame instead. As an unfortunate side effect, the Spear of Destiny will show as the
  // vanilla graphic during room transitions.
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
