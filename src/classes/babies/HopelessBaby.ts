import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getHUDOffsetVector,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { newSprite } from "../../sprite";
import {
  postNewRoomReorderedNoHealthUI,
  shouldShowRealHeartsUIForDevilDeal,
} from "../../utils";
import { Baby } from "../Baby";

/** +2 keys + keys are hearts. */
export class HopelessBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddKeys(2);

    g.run.babySprite = newSprite("gfx/custom-health/key.anm2");
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (g.run.babySprite === null) {
      return;
    }

    const player = Isaac.GetPlayer();
    const keys = player.GetNumKeys();

    if (!shouldShowRealHeartsUIForDevilDeal()) {
      // Draw the key count next to the hearts.
      const HUDOffsetVector = getHUDOffsetVector();
      const x = 65 + HUDOffsetVector.X;
      const y = 12;
      const position = Vector(x, y);
      g.run.babySprite.Render(position);
      const text = `x${keys}`;
      Isaac.RenderText(text, x + 5, y, 2, 2, 2, 2);
    }
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (g.run.dealingExtraDamage) {
      return undefined;
    }

    g.run.dealingExtraDamage = true;
    useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
    g.run.dealingExtraDamage = false;
    player.AddKeys(-1);
    return false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    postNewRoomReorderedNoHealthUI();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const keys = player.GetNumKeys();

    // Keys are hearts
    if (keys === 0) {
      player.Kill();
    }
  }
}
