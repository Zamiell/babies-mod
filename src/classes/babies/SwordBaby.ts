import {
  EntityType,
  PlayerType,
  PlayerVariant,
} from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Piggy Bank + Swallowed Penny + Strawman (Strawman can't die). */
export class SwordBaby extends Baby {
  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.PLAYER,
    PlayerVariant.PLAYER,
    PlayerType.KEEPER,
  )
  postEntityKillKeeper(): void {
    Isaac.DebugString("GETTING HERE");
  }
}
