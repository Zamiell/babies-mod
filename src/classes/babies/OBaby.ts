import { EffectVariant, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandomArrayElement,
  getRoomsInsideGrid,
  newRNG,
  sfxManager,
  spawnEffect,
} from "isaacscript-common";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    numPickupsCollected: 0,
    rng: newRNG(),
  },
};

/** Spawns a portal on N pickups touched. */
export class OBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(_pickup: EntityPickup, player: EntityPlayer): void {
    const num = this.getAttribute("num");

    v.run.numPickupsCollected++;
    if (v.run.numPickupsCollected >= num) {
      v.run.numPickupsCollected = 0;
      spawnPortal(player);
    }
  }
}

/** Emulate a Lil Portal portal, which is a persistent portal to a specific room. */
function spawnPortal(player: EntityPlayer) {
  const portalSubType = getPortalSubType();
  spawnEffect(EffectVariant.PORTAL_TELEPORT, portalSubType, player.Position);
  sfxManager.Play(SoundEffect.THUMBS_UP);
}

function getPortalSubType(): int {
  const roomsInsideGrid = getRoomsInsideGrid();
  const unexploredRooms = roomsInsideGrid.filter(
    (roomDescriptor) => roomDescriptor.VisitedCount === 0,
  );
  const roomsToUse =
    unexploredRooms.length === 0 ? roomsInsideGrid : unexploredRooms;
  const randomRoom = getRandomArrayElement(roomsToUse, v.run.rng);

  return randomRoom.SafeGridIndex + 1000;
}
