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
  inRoomType,
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
    const num = this.getAttribute("requireNumHits");

    v.run.numHits++;
    if (v.run.numHits === num) {
      v.run.shouldAutoKillBoss = true;
      sfxManager.Play(SoundEffect.THUMBS_UP);
      this.checkKillBoss();
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.BOSS)
  postNewRoomReorderedBoss(): void {
    this.checkKillBoss();
  }

  checkKillBoss(): void {
    if (
      !v.run.shouldAutoKillBoss ||
      !inRoomType(RoomType.BOSS) ||
      inMegaSatanRoom()
    ) {
      return;
    }

    const bosses = getBosses();
    for (const boss of bosses) {
      boss.Kill();
    }
  }
}
