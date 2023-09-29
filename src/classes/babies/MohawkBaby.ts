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
  newSprite,
  useActiveItemTemp,
} from "isaacscript-common";
import {
  postNewRoomReorderedNoHealthUI,
  shouldShowRealHeartsUIForDevilDeal,
} from "../../utils";
import { Baby } from "../Baby";

const BOMB_SPRITE = newSprite("gfx/custom-health/bomb.anm2");

/** Bombs are hearts. */
export class MohawkBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const bombs = player.GetNumBombs();
    return bombs >= 2;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const player = Isaac.GetPlayer();
    const bombs = player.GetNumBombs();

    if (!shouldShowRealHeartsUIForDevilDeal()) {
      // Draw the bomb count next to the hearts.
      const HUDOffsetVector = getHUDOffsetVector();
      const x = 65 + HUDOffsetVector.X;
      const y = 12;
      const position = Vector(x, y);
      BOMB_SPRITE.Render(position);
      const text = `x${bombs}`;
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

    player.AddBombs(-1);
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);

    return false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const bombs = player.GetNumBombs();

    if (bombs === 0) {
      player.Kill();
    }
  }
}
