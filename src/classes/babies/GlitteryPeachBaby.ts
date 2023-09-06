import { CardType, LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  levelHasRoomType,
  onStage,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** Teleports to the boss room after N hits. */
export class GlitteryPeachBaby extends Baby {
  v = v;

  override isValid(): boolean {
    return (
      levelHasRoomType(RoomType.BOSS) &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.HOME, // 13
      )
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      useCardTemp(player, CardType.EMPEROR);
    }

    return undefined;
  }
}
