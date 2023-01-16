import {
  CollectibleType,
  EffectVariant,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  getPlayerFromEntity,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Sprinkler tears. (We get tears equal to one Sprinkler in addition to the default tears.) */
export class BlueBaby extends Baby {
  /** Sprinkler does not work properly with Ludovico. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.LUDOVICO_TECHNIQUE);
  }

  /**
   * Make the Sprinkler invisible. (Setting `familiar.Visible = false` does not work, so we blank
   * out the sprite.)
   */
  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.SPRINKLER)
  postFamiliarInit(familiar: EntityFamiliar): void {
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.120_sprinkler_invisible.anm2", true);
  }

  /** Get rid of the poof effect that occurs when a Sprinkler is summoned. */
  // 54
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariant.POOF_1)
  postEffectInitPoof1(effect: EntityEffect): void {
    if (g.run.babyBool) {
      g.run.babyBool = false;
      effect.Remove();
    }
  }

  /** Sprinkler tears need to originate at the player. */
  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Position = player.Position;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const player = Isaac.GetPlayer();

    g.run.babyBool = true;
    useActiveItemTemp(player, CollectibleType.SPRINKLER);
  }
}
