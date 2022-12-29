import {
  CollectibleType,
  EffectVariant,
  FamiliarVariant,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Sprinkler tears. (We get tears equal to one Sprinkler in addition to the default tears.) */
export class BlueBaby extends Baby {
  /**
   * Make the Sprinkler invisible. (Setting "familiar.Visible = false" does not work, so we blank
   * out the sprite.)
   */
  // 7
  @Callback(ModCallback.POST_FAMILIAR_INIT, FamiliarVariant.SPRINKLER)
  postFamiliarInit(familiar: EntityFamiliar): void {
    const sprite = familiar.GetSprite();
    sprite.Load("gfx/003.120_sprinkler2.anm2", true);
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
    tear.Position = g.p.Position;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    g.run.babyBool = true;
    useActiveItemTemp(g.p, CollectibleType.SPRINKLER);
  }
}
