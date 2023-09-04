import { CardType, LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  levelHasRoomType,
  onStage,
  useCardTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Teleports to the boss room after N hits. */
export class GlitteryPeachBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.BOSS) && !onStage(LevelStage.BLUE_WOMB);
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const numHits = this.getAttribute("requireNumHits");

    if (g.run.babyBool) {
      return;
    }

    g.run.babyCounters++;
    if (g.run.babyCounters === numHits) {
      // We only do the ability once per floor.
      g.run.babyBool = true;
      useCardTemp(player, CardType.EMPEROR);
    }

    return undefined;
  }
}
