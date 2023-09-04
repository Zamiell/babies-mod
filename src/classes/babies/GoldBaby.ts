import {
  BombSubType,
  BombVariant,
  CoinSubType,
  EntityType,
  GridEntityType,
  KeySubType,
  PickupVariant,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, game } from "isaacscript-common";
import { Baby } from "../Baby";

/** Gold gear + gold pickups + gold poops + gold rooms. */
export class GoldBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddGoldenHearts(12);
    player.AddGoldenBomb();
    player.AddGoldenKey();
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.COIN,
  )
  preEntitySpawnCoin(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    return [entityType, variant, CoinSubType.GOLDEN, initSeed];
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.BOMB,
  )
  preEntitySpawnBomb(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    return [entityType, variant, BombSubType.GOLDEN, initSeed];
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.KEY,
  )
  preEntitySpawnKey(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    return [entityType, variant, KeySubType.GOLDEN, initSeed];
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.BOMB,
    BombVariant.TROLL,
  )
  preEntitySpawnTrollBomb(
    entityType: EntityType,
    _variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    return [entityType, BombVariant.GOLDEN_TROLL, 0, initSeed];
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.POOP,
  )
  postGridEntityUpdatePoop(gridEntity: GridEntity): void {
    const gridEntityPoop = gridEntity as GridEntityPoop;
    const gridEntityVariant = gridEntityPoop.GetVariant();

    if (gridEntityVariant !== PoopGridEntityVariant.GOLDEN) {
      gridEntity.SetVariant(PoopGridEntityVariant.GOLDEN);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    room.TurnGold();
  }
}
