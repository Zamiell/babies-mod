import { CardType, LevelStage, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  levelHasRoomType,
  onStageOrHigher,
  useCardTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
  },
};

/** Reverse Emperor card effect after 6 hits. */
export class VVVVVVBaby extends Baby {
  v = v;

  override isValid(): boolean {
    return (
      levelHasRoomType(RoomType.BOSS) && !onStageOrHigher(LevelStage.BLUE_WOMB)
    );
  }

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const num = this.getAttribute("num");

    v.run.numHits++;
    if (v.run.numHits === num) {
      useCardTemp(player, CardType.REVERSE_EMPEROR);
    }

    return undefined;
  }
}
