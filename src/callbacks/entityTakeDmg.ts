import { DamageFlag, ModCallback } from "isaac-typescript-definitions";
import { getCurrentBaby } from "../utils";
import * as entityTakeDmgEntity from "./entityTakeDmgEntity";
import * as entityTakeDmgPlayer from "./entityTakeDmgPlayer";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.ENTITY_TAKE_DMG, main);
}

function main(
  entity: Entity,
  damageAmount: float,
  damageFlags: BitFlags<DamageFlag>,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | void {
  const [, , valid] = getCurrentBaby();
  if (!valid) {
    return undefined;
  }

  const player = entity.ToPlayer();
  if (player !== undefined) {
    return entityTakeDmgPlayer.main(
      player,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return entityTakeDmgEntity.main(
    entity,
    damageAmount,
    damageFlags,
    damageSource,
    damageCountdownFrames,
  );
}
