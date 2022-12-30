import { DamageFlag, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const DATA_KEY = "BabiesModGodHeadTear";

/** Slings Godhead aura (improved). */
export class BrotherBobby extends Baby {
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
}
