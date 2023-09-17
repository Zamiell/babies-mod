import {
  CollectibleType,
  DamageFlag,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  getHUDOffsetVector,
  hasFlag,
  useActiveItemTemp,
} from "isaacscript-common";
import { newSprite } from "../../sprite";
import {
  postNewRoomReorderedNoHealthUI,
  shouldShowRealHeartsUIForDevilDeal,
} from "../../utils";
import { Baby } from "../Baby";

const KEY_SPRITE = newSprite("gfx/custom-health/key.anm2");

/** Keys are hearts. */
export class HopelessBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const keys = player.GetNumKeys();
    return keys >= 2;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const player = Isaac.GetPlayer();
    const keys = player.GetNumKeys();

    if (!shouldShowRealHeartsUIForDevilDeal()) {
      // Draw the key count next to the hearts.
      const HUDOffsetVector = getHUDOffsetVector();
      const x = 65 + HUDOffsetVector.X;
      const y = 12;
      const position = Vector(x, y);
      KEY_SPRITE.Render(position);
      const text = `x${keys}`;
      Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (hasFlag(damageFlags, DamageFlag.FAKE)) {
      return undefined;
    }

    player.AddKeys(-1);
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);

    return false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const keys = player.GetNumKeys();
    if (keys === 0) {
      player.Kill();
    }
  }
}
