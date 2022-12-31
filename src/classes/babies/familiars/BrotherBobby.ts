import {
  DamageFlag,
  EntityCollisionClass,
  EntityGridCollisionClass,
  ModCallback,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  bitFlags,
  Callback,
  CallbackCustom,
  getKnives,
  ModCallbackCustom,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../../globals";
import { Baby } from "../../Baby";

const DATA_KEY = "BabiesModGodHeadTear";

/** Slings Godhead aura (improved). */
export class BrotherBobby extends Baby {
  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    entity: Entity,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (g.run.dealingExtraDamage) {
      return undefined;
    }

    if (source.Entity === undefined) {
      return undefined;
    }

    const data = source.Entity.GetData();
    if (data[DATA_KEY] === true) {
      const damage = g.p.Damage;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(damage, damageFlags, EntityRef(g.p), countdownFrames);
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  }

  /** Attach the Godhead tear to the knife. */
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType !== 1) {
      return;
    }

    const knives = getKnives();
    const knife = knives[0];
    if (knife !== undefined) {
      tear.Height = -10; // Keep it in the air forever.
      tear.Position = knife.Position;
      tear.EntityCollisionClass = EntityCollisionClass.NONE;
      tear.GridCollisionClass = EntityGridCollisionClass.NONE;
    }
  }

  /** Make the knife invisible. */
  // 50
  @Callback(ModCallback.POST_KNIFE_INIT)
  postKnifeInit(knife: EntityKnife): void {
    knife.EntityCollisionClass = EntityCollisionClass.NONE;
    knife.Visible = false;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const godheadTear = g.p.FireTear(
      g.p.Position,
      VectorZero,
      false,
      true,
      false,
    );
    godheadTear.TearFlags = bitFlags(TearFlag.GLOW);
    godheadTear.SubType = 1;
    const sprite = godheadTear.GetSprite();
    sprite.Load("gfx/tear_blank.anm2", true);
    sprite.Play("RegularTear6", false);

    const data = godheadTear.GetData();
    data[DATA_KEY] = true;
  }
}
