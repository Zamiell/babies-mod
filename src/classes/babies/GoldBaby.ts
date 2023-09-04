import type { TrinketType } from "isaac-typescript-definitions";
import {
  BombSubType,
  BombVariant,
  CoinSubType,
  EntityType,
  GridEntityType,
  HeartSubType,
  KeySubType,
  ModCallback,
  PickupVariant,
  PillColor,
  PoopGridEntityVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getGoldenTrinketType,
  isChestVariant,
  isGoldenTrinketType,
  isHorsePill,
} from "isaacscript-common";
import { Baby } from "../Baby";

/**
 * Gold gear + gold pickups + gold poops + gold rooms.
 *
 * For pickup replacement, we do not use the `PRE_ENTITY_SPAWN` callback because that does not work
 * properly for random pickups that are part of the room layout (as demonstrated on seed 61RT H2V3
 * by walking down from the starting room).
 */
export class GoldBaby extends Baby {
  override onAdd(player: EntityPlayer): void {
    player.AddGoldenHearts(12);
    player.AddGoldenBomb();
    player.AddGoldenKey();
  }

  // 66
  @Callback(ModCallback.GET_TRINKET)
  getTrinket(trinketType: TrinketType, _rng: RNG): TrinketType | undefined {
    return isGoldenTrinketType(trinketType)
      ? undefined
      : getGoldenTrinketType(trinketType);
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.HEART,
  )
  preEntitySpawnHeart(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    return [entityType, variant, HeartSubType.GOLDEN, initSeed];
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

  @CallbackCustom(ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER, EntityType.PICKUP)
  preEntitySpawnChest(
    entityType: EntityType,
    variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    const pickupVariant = variant as PickupVariant;

    if (isChestVariant(pickupVariant)) {
      return [entityType, PickupVariant.LOCKED_CHEST, 0, initSeed];
    }

    return undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.PILL,
  )
  preEntitySpawnPill(
    entityType: EntityType,
    variant: int,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    initSeed: Seed,
  ): [EntityType, int, int, int] | undefined {
    const pillColor = subType as PillColor;
    const goldPillColor = isHorsePill(pillColor)
      ? PillColor.HORSE_GOLD
      : PillColor.GOLD;

    return [entityType, variant, goldPillColor, initSeed];
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
