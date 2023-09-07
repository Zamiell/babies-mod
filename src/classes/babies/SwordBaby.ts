import {
  EntityType,
  LevelStage,
  PlayerType,
  PlayerVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isChildPlayer,
  onStageOrHigher,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** By default, the Strawman will be so big that he will cover up the baby. */
const STRAWMAN_SIZE_MULTIPLIER = 0.75;

/** Starts with Piggy Bank + Swallowed Penny + Strawman (Strawman must not die). */
export class SwordBaby extends Baby {
  override isValid(): boolean {
    // It would be too difficult on the later floors.
    return !onStageOrHigher(LevelStage.WOMB_2);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_LATE)
  postPlayerInitLate(player: EntityPlayer): void {
    if (isChildPlayer(player)) {
      player.SpriteScale = player.SpriteScale.mul(STRAWMAN_SIZE_MULTIPLIER);
    }
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.KEEPER,
  )
  postEntityKillKeeper(): void {
    const player = Isaac.GetPlayer();
    player.Kill();
  }
}
