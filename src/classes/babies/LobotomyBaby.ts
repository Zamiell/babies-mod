import {
  LevelStage,
  RoomType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getBosses,
  inMegaSatanRoom,
  levelHasRoomType,
  onStage,
  sfxManager,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numHits: 0,
    shouldAutoKillBoss: false,
  },
};

/** Boss dies after 6 hits on floor. */
export class LobotomyBaby extends Baby {
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
  entityTakeDmgPlayer(): boolean | undefined {
    const num = this.getAttribute("num");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.shouldAutoKillBoss = true;
      sfxManager.Play(SoundEffect.THUMBS_UP);
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.BOSS)
  postNewRoomReorderedBoss(): void {
    if (!v.run.shouldAutoKillBoss) {
      return;
    }

    if (inMegaSatanRoom()) {
      return;
    }

    const bosses = getBosses();
    for (const boss of bosses) {
      boss.Kill();
    }
  }
}
