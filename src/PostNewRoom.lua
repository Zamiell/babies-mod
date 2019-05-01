local PostNewRoom = {}

-- Includes
local g          = require("src/globals")
local PostRender = require("src/postrender")

-- ModCallbacks.MC_POST_NEW_ROOM (19)
function PostNewRoom:Main()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local stage = g.l:GetStage()
  local stageType = g.l:GetStageType()

  Isaac.DebugString("MC_POST_NEW_ROOM (BM)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if gameFrameCount == 0 or
     (g.run.currentFloor ~= stage or
      g.run.currentFloorType ~= stageType) then

    return
  end

  PostNewRoom:NewRoom()
end

function PostNewRoom:NewRoom()
  -- Local variabbles
  local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = g.l:GetCurrentRoomIndex()
  end
  local startingRoomIndex = g.l:GetStartingRoomIndex()
  local roomClear = g.r:IsClear()
  local roomSeed = g.r:GetSpawnSeed()

  Isaac.DebugString("MC_POST_NEW_ROOM2 (BM)")

  -- Increment level variables
  g.run.currentFloorRoomsEntered = g.run.currentFloorRoomsEntered + 1
  if roomIndex == startingRoomIndex and
     g.run.currentFloorRoomsEntered == 1 then

    -- We don't want the starting room of the floor to count towards the rooms entered
    g.run.currentFloorRoomsEntered = 0
  end

  -- Reset room variables
  g.run.roomClear = roomClear
  g.run.roomRNG = roomSeed
  g.run.babyCountersRoom = 0
  g.run.babyTears = {
    tear     = 1,
    frame    = 0,
    position = Vector(0, 0),
    velocity = Vector(0, 0),
  }
  g.run.roomPseudoClear = true
  g.run.roomDoorsModified = {}
  g.run.roomButtonsPushed = false
  g.run.roomClearDelayFrame = 0
  g.run.lastRoomIndex = g.run.currentRoomIndex
  g.run.currentRoomIndex = roomIndex

  -- Do nothing if we are not a baby
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- Reset the player's sprite, just in case it got messed up
  PostRender:SetPlayerSprite()

  -- Stop drawing the baby intro text once the player goes into a new room
  if g.run.drawIntro then
    g.run.drawIntro = false
  end

  PostNewRoom:ApplyTemporaryEffects()
end

function PostNewRoom:ApplyTemporaryEffects()
  -- Local variables
  local itemPool = g.g:GetItemPool()
  local seeds = g.g:GetSeeds()
  local rooms = g.l:GetRooms()
  local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = g.l:GetCurrentRoomIndex()
  end
  local startingRoomIndex = g.l:GetStartingRoomIndex()
  local roomDesc = g.l:GetCurrentRoomDesc()
  local roomVariant = roomDesc.Data.Variant
  local roomType = g.r:GetType()
  local roomFirstVisit = g.r:IsFirstVisit()
  local roomClear = g.r:IsClear()
  local maxHearts = g.p:GetMaxHearts()
  local effects = g.p:GetEffects()
  local type = g.run.babyType
  local baby = g.babies[type]

  -- Some babies have flight
  if baby.flight and
     g.p.CanFly == false then

    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BIBLE, true) -- 33
  end

  -- Apply baby-specific temporary effects
  if baby.name == "Shadow Baby" and -- 13
     (roomType == RoomType.ROOM_DEVIL or -- 14
      roomType == RoomType.ROOM_ANGEL) then -- 15

    g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, -- -6, -1
                            RoomTransition.TRANSITION_NONE) -- 0

  elseif baby.name == "Glass Baby" then -- 14
    -- Spawn a laser ring around the player
    local laser = g.p:FireTechXLaser(g.p.Position, Vector(0,0), 66):ToLaser() -- The third argument is the radius
    -- (we copy the radius from Samael's Tech X ability)
    if laser.Variant ~= 2 then
      laser.Variant = 2
      laser.SpriteScale = Vector(0.5, 1)
    end
    laser.TearFlags = laser.TearFlags | TearFlags.TEAR_CONTINUUM -- 1 << 36
    laser.CollisionDamage = laser.CollisionDamage * 0.66
    local data = laser:GetData()
    data.ring = true

  elseif baby.name == "Gold Baby" then -- 15
    g.r:TurnGold()

  elseif baby.name == "Blue Baby" then -- 30
    -- Sprinkler tears
    g.run.babyBool = true
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516

  elseif baby.name == "Zombie Baby" then -- 61
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      if entity:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29
        if entity.Type == EntityType.ENTITY_BOIL then -- 30
          -- Delete Boils, because they are supposed to be rooted to the spot and
          -- will look very buggy if they are moved
          entity:Remove()
        else
          -- Teleport all friendly enemies to where the player is
          entity.Position = g.p.Position
        end
      end
    end

  elseif baby.name == "Nerd Baby" and -- 90
         roomClear then

    -- Locked doors in uncleared rooms
    -- If the player leaves and re-enters an uncleared room, a normal door will stay locked
    -- So, unlock all normal doors if the room is already clear
    for i = 0, 7 do
      local door = g.r:GetDoor(i)
      if door ~= nil and
         door.TargetRoomType == RoomType.ROOM_DEFAULT and -- 1
         door:IsLocked() then

        door:TryUnlock(true) -- This has to be forced
      end
    end

  elseif baby.name == "Statue Baby 2" and -- 118
         roomType == RoomType.ROOM_SECRET and -- 7
         roomFirstVisit then

    -- Improved Secret Rooms
    for i = 1, 4 do
      local center = g.r:GetCenterPos()
      local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
      g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
      g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                position, Vector(0, 0), nil, 0, g.run.randomSeed)
    end

  elseif baby.name == "Lost Baby" or -- 10
         baby.name == "Hopeless Baby" or -- 125
         baby.name == "Mohawk Baby" then -- 138

    -- Get rid of the health UI by using Curse of the Unknown
    -- (but not in Devil Rooms or Black Markets)
    seeds:RemoveSeedEffect(SeedEffect.SEED_PREVENT_ALL_CURSES) -- 70
    if (roomType == RoomType.ROOM_DEVIL or -- 14
        roomType == RoomType.ROOM_BLACK_MARKET) and -- 22
       (roomVariant ~= 2300 and -- Krampus
        roomVariant ~= 2301 and -- Krampus
        roomVariant ~= 2302 and -- Krampus
        roomVariant ~= 2303 and -- Krampus
        roomVariant ~= 2304 and -- Krampus
        roomVariant ~= 2305 and -- Krampus
        roomVariant ~= 2306) then -- Krampus

      g.l:RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false) -- 1 << 3
    else
      g.l:AddCurse(LevelCurse.CURSE_OF_THE_UNKNOWN, false) -- 1 << 3
    end

  elseif baby.name == "Twin Baby" and -- 141
         g.run.currentFloorRoomsEntered > 0 then -- We don't want to teleport away from the first room
         -- (the starting room does not count for the purposes of this variable)

    if g.run.babyBool then
      -- We teleported to this room
      g.run.babyBool = false
    else
      -- We are entering a new room
      g.run.babyBool = true
      --player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44
      g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT_2, false, false, false, false) -- 419
    end

  elseif baby.name == "Butterfly Baby" and -- 149
         roomType == RoomType.ROOM_SUPERSECRET and -- 8
         roomFirstVisit then

    -- Improved Super Secret Rooms
    for i = 1, 5 do
      local center = g.r:GetCenterPos()
      local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
      g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
      g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                position, Vector(0, 0), nil, 0, g.run.randomSeed)
      end

  elseif baby.name == "Spelunker Baby" and -- 181
         roomType == RoomType.ROOM_DUNGEON and -- 16
         g.run.lastRoomIndex ~= GridRooms.ROOM_BLACK_MARKET_IDX then -- -6
         -- (we want to be able to backtrack from a Black Market to a Crawlspace)

    g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, -- -6, -1
                            RoomTransition.TRANSITION_NONE) -- 0

  elseif baby.name == "Fancy Baby" and -- 216
         roomIndex == startingRoomIndex and
         roomFirstVisit then

    -- Can purchase teleports to special rooms
    local positions = {
      {3, 1},
      {9, 1},
      {3, 5},
      {9, 5},
      {1, 1},
      {11, 1},
      {1, 5},
      {11, 5},
    }
    local positionIndex = 0

    -- Find the special rooms on the floor
    for i = 0, rooms.Size - 1 do -- This is 0 indexed
      local thisRoomDesc = rooms:Get(i)
      local thisRoomData = thisRoomDesc.Data
      local thisRoomType = thisRoomData.Type

      local itemID = 0
      local price = 0
      if thisRoomType == RoomType.ROOM_SHOP then -- 2
        itemID = Isaac.GetItemIdByName("Shop Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_TREASURE then -- 4
        itemID = Isaac.GetItemIdByName("Treasure Room Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_MINIBOSS then -- 6
        itemID = Isaac.GetItemIdByName("Mini-Boss Room Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_ARCADE then -- 9
        itemID = Isaac.GetItemIdByName("Arcade Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_CURSE then -- 10
        itemID = Isaac.GetItemIdByName("Curse Room Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_CHALLENGE then -- 11
        itemID = Isaac.GetItemIdByName("Challenge Room Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_LIBRARY then -- 12
        itemID = Isaac.GetItemIdByName("Library Teleport")
        price = 15
      elseif thisRoomType == RoomType.ROOM_SACRIFICE then -- 13
        itemID = Isaac.GetItemIdByName("Sacrifice Room Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_ISAACS then -- 18
        itemID = Isaac.GetItemIdByName("Bedroom (Clean) Teleport")
        price = 10
      elseif thisRoomType == RoomType.ROOM_BARREN then -- 19
        itemID = Isaac.GetItemIdByName("Bedroom (Dirty) Teleport")
        price = 20
      elseif thisRoomType == RoomType.ROOM_CHEST then -- 20
        itemID = Isaac.GetItemIdByName("Treasure Chest Room Teleport")
        price = 15
      elseif thisRoomType == RoomType.ROOM_DICE then -- 21
        itemID = Isaac.GetItemIdByName("Dice Room Teleport")
        price = 10
      end

      if itemID ~= 0 then
        positionIndex = positionIndex + 1
        if positionIndex > #positions then
          Isaac.DebugString("Error: This floor has too many special rooms for Fancy Baby.")
          return
        end
        local xy = positions[positionIndex]
        local position = g:GridToPos(xy[1], xy[2])
        local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                                   position, Vector(0, 0), nil, itemID, g.run.roomRNG):ToPickup()
        pedestal.AutoUpdatePrice = false
        pedestal.Price = price
      end
    end

  elseif baby.name == "Beast Baby" and -- 242
         roomIndex ~= startingRoomIndex then

    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D10, false, false, false, false) -- 285

  elseif baby.name == "Love Eye Baby" and -- 249
         g.run.babyBool and
         roomType ~= RoomType.ROOM_BOSS and -- 5
         -- Make an exception for Boss Rooms
         roomType ~= RoomType.ROOM_DEVIL then -- 14
         -- Make an exception for Devil Rooms

    -- Replace all of the existing enemies with the stored one
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc.Type ~= EntityType.ENTITY_SHOPKEEPER and-- 17
         -- Make an exception for shopkeepers
         npc.Type ~= EntityType.ENTITY_FIREPLACE then -- 33
         -- Make an exception for fires

        g.g:Spawn(g.run.babyNPC.type, g.run.babyNPC.variant,
                  npc.Position, npc.Velocity, nil, g.run.babyNPC.subType, npc.InitSeed)
        npc:Remove()
      end
    end

  elseif baby.name == "Viking Baby" and -- 261
         roomType == RoomType.ROOM_SECRET then -- 7

    -- Find the grid index of the Super Secret Room
    for i = 0, rooms.Size - 1 do -- This is 0 indexed
      local thisRoomDesc = rooms:Get(i)
      local index = thisRoomDesc.SafeGridIndex -- This is always the top-left index
      local thisRoomData = thisRoomDesc.Data
      local thisRoomType = thisRoomData.Type
      if thisRoomType == RoomType.ROOM_SUPERSECRET then -- 8
        -- Teleport to the Super Secret Room
        g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
        g.g:StartRoomTransition(index, Direction.NO_DIRECTION, RoomTransition.TRANSITION_TELEPORT) -- -1, 3
        break
      end
    end

  elseif baby.name == "Ghost Baby 2" then -- 282
    -- Constant Maw of the Void effect + flight
    g.p:SpawnMawOfVoid(30 * 60 * 60) -- 1 hour

  elseif baby.name == "Suit Baby" and -- 287
         roomFirstVisit and
         roomType ~= RoomType.ROOM_DEFAULT and -- 1
         roomType ~= RoomType.ROOM_ERROR and -- 3
         roomType ~= RoomType.ROOM_BOSS and -- 5
         roomType ~= RoomType.ROOM_DEVIL and -- 14
         roomType ~= RoomType.ROOM_ANGEL and -- 15
         roomType ~= RoomType.ROOM_DUNGEON and -- 16
         roomType ~= RoomType.ROOM_BOSSRUSH and -- 17
         roomType ~= RoomType.ROOM_BLACK_MARKET then -- 22

    -- All special rooms are Devil Rooms
    g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
    local item = itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.roomRNG) -- 3
    local position = g:GridToPos(6, 4)
    local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                               position, Vector(0, 0), nil, item, g.run.roomRNG):ToPickup()
    pedestal.AutoUpdatePrice = false

    -- Find out how this item should be priced
    if maxHearts == 0 then
      pedestal.Price = -3
    else
      pedestal.Price = g:GetItemConfig(item).DevilPrice * -1
    end
    -- (the price will also be set on every frame in the MC_POST_PICKUP_INIT callback)

    -- Spawn the Devil Statue
    g.r:SpawnGridEntity(52, GridEntityType.GRID_STATUE, 0, 0, 0) -- 21

    -- Spawn the two fires
    for i = 1, 2 do
      local pos
      if i == 1 then
        pos = g:GridToPos(3, 1)
      elseif i == 2 then
        pos = g:GridToPos(9, 1)
      end
      g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
      g.g:Spawn(EntityType.ENTITY_FIREPLACE, 0, pos, Vector(0, 0), nil, 0, g.run.roomRNG) -- 33
    end

  elseif baby.name == "Woodsman Baby" and -- 297
         roomIndex ~= startingRoomIndex then

    -- Open all of the doors
    for i = 0, 7 do
      local door = g.r:GetDoor(i)
      if door ~= nil then
        door:Open(true)
      end
    end

  elseif baby.name == "Driver Baby" then -- 431
    -- Slippery movement
    -- Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws by deleting them
    local entities1 = Isaac.FindByType(EntityType.ENTITY_GAPING_MAW, -1, -1, false, false) -- 235
    for i = 1, #entities1 do
      entities1[i]:Remove()
    end
    local entities2 = Isaac.FindByType(EntityType.ENTITY_BROKEN_GAPING_MAW, -1, -1, false, false) -- 236
    for i = 1, #entities2 do
      entities2[i]:Remove()
    end

  elseif baby.name == "Mouse Baby" and -- 351
         roomClear then

    -- Coin doors in uncleared rooms
    -- If the player leaves and re-enters an uncleared room, a normal door will stay locked
    -- So, unlock all normal doors if the room is already clear
    for i = 0, 7 do
      local door = g.r:GetDoor(i)
      if door ~= nil and
         door.TargetRoomType == RoomType.ROOM_DEFAULT and -- 1
         door:IsLocked() then

        door:TryUnlock(true) -- This has to be forced
      end
    end

  elseif baby.name == "Gamer Baby" and -- 492
         roomIndex ~= startingRoomIndex then -- This can prevent crashes when reseeding happens

    g.p:UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL) -- 37, 0
    -- If we try to cancel the animation now, it will bug out the player such that
    -- they will not be able to take pocket items or pedestal items
    -- This still happens even if we cancel the animation in the MC_POST_UPDATE callback,
    -- so don't bother canceling it

  elseif baby.name == "Psychic Baby" then -- 504
    -- Get Abel
    local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8

    -- Disable the vanilla shooting behavior
    entities[1]:ToFamiliar().FireCooldown = 1000000

  elseif baby.name == "Silly Baby" and -- 516
         roomIndex ~= startingRoomIndex then -- This can prevent crashes when reseeding happens

    g.p:UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL) -- 42, 0
    -- If we try to cancel the animation now, it will bug out the player such that
    -- they will not be able to take pocket items or pedestal items
    -- This still happens even if we cancel the animation in the MC_POST_UPDATE callback,
    -- so don't bother canceling it

  elseif baby.name == "Brother Bobby" then -- 522
    local godheadTear = g.p:FireTear(g.p.Position, Vector(0, 0), false, true, false)
    godheadTear.TearFlags = TearFlags.TEAR_GLOW -- 1 << 32
    godheadTear.SubType = 1
    local sprite = godheadTear:GetSprite()
    sprite:Load("gfx/tear_blank.anm2", true)
    sprite:Play("RegularTear6")
  end
end

return PostNewRoom
