import {
  EffectVariant,
  PortalTeleportSubType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandomArrayElement,
  getRoomsInsideGrid,
  newRNG,
  setSeed,
  sfxManager,
  spawnEffectWithSeed,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    numPickupsCollected: 0,
    rng: newRNG(),
  },
};

/** Spawns portal on N pickups touched. */
export class OBaby extends Baby {
  v = v;

  override onAdd(): void {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    setSeed(v.run.rng, seed);
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(pickup: EntityPickup, player: EntityPlayer): void {
    const num = this.getAttribute("num");

    v.run.numPickupsCollected++;
    if (v.run.numPickupsCollected >= num) {
      v.run.numPickupsCollected = 0;
      spawnPortal(pickup, player);
    }
  }
}

/** We want to emulate a Lil Portal portal, which is a persistent portal to a specific room. */
function spawnPortal(pickup: EntityPickup, player: EntityPlayer) {
  const portalSubType = getPortalSubType();
  spawnEffectWithSeed(
    EffectVariant.PORTAL_TELEPORT,
    portalSubType,
    player.Position,
    pickup.InitSeed,
  );

  sfxManager.Play(SoundEffect.THUMBS_UP);
}

function getPortalSubType(): int {
  const roomsInsideGrid = getRoomsInsideGrid();
  const unexploredRooms = roomsInsideGrid.filter(
    (roomDescriptor) => roomDescriptor.VisitedCount === 0,
  );

  if (unexploredRooms.length === 0) {
    return PortalTeleportSubType.RANDOM_ROOM;
  }

  const randomUnexploredRoom = getRandomArrayElement(
    unexploredRooms,
    v.run.rng,
  );
  return randomUnexploredRoom.SafeGridIndex + 1000;
}
