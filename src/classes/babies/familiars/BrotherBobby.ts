import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CollectibleType,
  EntityCollisionClass,
  EntityGridCollisionClass,
  ModCallback,
  TearFlag,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  bitFlags,
  getKnives,
  hasCollectible,
} from "isaacscript-common";
import { MULTI_SHOT_COLLECTIBLE_TYPES } from "../../../constantsCollectibleTypes";
import { Baby } from "../../Baby";

const v = {
  room: {
    godheadTearPtrHash: null as PtrHash | null,
    dealingExtraDamage: false,
  },
};

/** Slings Godhead aura (improved). */
export class BrotherBobby extends Baby {
  v = v;

  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      // Certain collectibles override the effect.
      CollectibleType.C_SECTION, // 678
      // Certain collectibles do not properly synergize with the effect.
      CollectibleType.TWISTED_PAIR, // 698
      // This baby does not make more damage with multi shot items, resulting in a build nerf.
      ...MULTI_SHOT_COLLECTIBLE_TYPES,
    );
  }

  // 11
  @Callback(ModCallback.ENTITY_TAKE_DMG)
  entityTakeDmg(
    entity: Entity,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ): boolean | undefined {
    if (v.room.dealingExtraDamage) {
      return undefined;
    }

    if (source.Entity === undefined) {
      return undefined;
    }

    const ptrHash = GetPtrHash(source.Entity);
    if (ptrHash !== v.room.godheadTearPtrHash) {
      return undefined;
    }

    const player = Isaac.GetPlayer();
    const damage = player.Damage;

    v.room.dealingExtraDamage = true;
    entity.TakeDamage(damage, damageFlags, EntityRef(player), countdownFrames);
    v.room.dealingExtraDamage = false;

    return false;
  }

  /** Attach the Godhead tear to the knife. */
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (v.room.godheadTearPtrHash !== ptrHash) {
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
    const player = Isaac.GetPlayer();

    const godheadTear = player.FireTear(
      player.Position,
      VectorZero,
      false,
      true,
      false,
    );
    godheadTear.TearFlags = bitFlags(TearFlag.GLOW);
    const sprite = godheadTear.GetSprite();
    sprite.Load("gfx/tear_blank.anm2", true);
    sprite.Play("RegularTear6", false);

    const ptrHash = GetPtrHash(godheadTear);
    v.room.godheadTearPtrHash = ptrHash;
  }
}
