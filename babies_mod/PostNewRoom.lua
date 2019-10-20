local PostNewRoom = {}

-- Includes
local g          = require("babies_mod/globals")
local PostRender = require("babies_mod/postrender")

-- ModCallbacks.MC_POST_NEW_ROOM (19)
function PostNewRoom:Main()
  -- Update some cached API functions to avoid crashing
  g.l = g.g:GetLevel()
  g.r = g.g:GetRoom()
  g.p = g.g:GetPlayer(0)
  g.seeds = g.g:GetSeeds()
  g.itemPool = g.g:GetItemPool()

  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local stage = g.l:GetStage()
  local stageType = g.l:GetStageType()

  Isaac.DebugString("MC_POST_NEW_ROOM (BM)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if gameFrameCount == 0 or
     g.run.currentFloor ~= stage or
     g.run.currentFloorType ~= stageType then

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
  local roomSeed = g.r:GetSpawnSeed() -- Gets a reproducible seed based on the room, e.g. "2496979501"

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
    position = g.zeroVector,
    velocity = g.zeroVector,
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
  local effects = g.p:GetEffects()
  local type = g.run.babyType
  local baby = g.babies[type]

  -- Some babies have flight
  if baby.flight and
     not g.p.CanFly then

    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BIBLE, true) -- 33
  end

  -- Apply baby-specific temporary effects
  local babyFunc = PostNewRoom.functions[type]
  if babyFunc ~= nil then
    babyFunc()
  end
end

-- The collection of functions for each baby
PostNewRoom.functions = {}

-- Lost Baby
PostNewRoom.functions[10] = PostNewRoom.NoHealth

-- Shadow Baby
PostNewRoom.functions[13] = function()
  local roomType = g.r:GetType()
  if roomType == RoomType.ROOM_DEVIL or -- 14
     roomType == RoomType.ROOM_ANGEL then -- 15

    g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, -- -6, -1
                            RoomTransition.TRANSITION_NONE) -- 0
  end
end

-- Glass Baby
PostNewRoom.functions[14] = function()
  -- Spawn a laser ring around the player
  local laser = g.p:FireTechXLaser(g.p.Position, g.zeroVector, 66):ToLaser() -- The third argument is the radius
  -- (we copy the radius from Samael's Tech X ability)
  if laser.Variant ~= 2 then
    laser.Variant = 2
    laser.SpriteScale = Vector(0.5, 1)
  end
  laser.TearFlags = laser.TearFlags | TearFlags.TEAR_CONTINUUM -- 1 << 36
  laser.CollisionDamage = laser.CollisionDamage * 0.66
  local data = laser:GetData()
  data.ring = true
end

-- Gold Baby
PostNewRoom.functions[15] = function()
  g.r:TurnGold()
end

-- Blue Baby
PostNewRoom.functions[30] = function()
  -- Sprinkler tears
  g.run.babyBool = true
  g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516
end

-- Zombie Baby
PostNewRoom.functions[61] = function()
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
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
end

-- Nerd Baby
PostNewRoom.functions[90] = function()
  if not g.r:IsClear() then
    return
  end

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
end

-- Statue Baby 2
PostNewRoom.functions[118] = function()
  if g.r:GetType() ~= RoomType.ROOM_SECRET or -- 7
     not g.r:IsFirstVisit() then

    return
  end

  -- Improved Secret Rooms
  for i = 1, 4 do
    local center = g.r:GetCenterPos()
    local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
              position, g.zeroVector, nil, 0, g.run.randomSeed)
  end
end

-- Hopeless Baby
PostNewRoom.functions[125] = PostNewRoom.NoHealth

-- Mohawk Baby
PostNewRoom.functions[138] = PostNewRoom.NoHealth

-- Twin Baby
PostNewRoom.functions[141] = function()
  -- We don't want to teleport away from the first room
  -- (the starting room does not count for the purposes of this variable)
  if g.run.currentFloorRoomsEntered == 0 then
    return
  end

  if g.run.babyBool then
    -- We teleported to this room
    g.run.babyBool = false
  else
    -- We are entering a new room
    g.run.babyBool = true
    --player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT_2, false, false, false, false) -- 419
  end
end

-- Butterfly Baby
PostNewRoom.functions[149] = function()
  if g.r:GetType() ~= RoomType.ROOM_SUPERSECRET or -- 8
     not g.r:IsFirstVisit() then

    return
  end

  -- Improved Super Secret Rooms
  for i = 1, 5 do
    local center = g.r:GetCenterPos()
    local position = g.r:FindFreePickupSpawnPosition(center, 1, true)
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
              position, g.zeroVector, nil, 0, g.run.randomSeed)
  end
end

-- Spelunker Baby
PostNewRoom.functions[181] = function()
  if g.r:GetType() == RoomType.ROOM_DUNGEON and -- 16
     g.run.lastRoomIndex ~= GridRooms.ROOM_BLACK_MARKET_IDX then -- -6
     -- (we want to be able to backtrack from a Black Market to a Crawlspace)

    g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    g.g:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, -- -6, -1
                            RoomTransition.TRANSITION_NONE) -- 0
  end
end

-- Fancy Baby
PostNewRoom.functions[216] = function()
  if g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex() or
     not g.r:IsFirstVisit() then

    return
  end

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
  local rooms = g.l:GetRooms()
  for i = 0, rooms.Size - 1 do -- This is 0 indexed
    local thisRoomDesc = rooms:Get(i)
    local thisRoomData = thisRoomDesc.Data
    local thisRoomType = thisRoomData.Type

    local itemID = 0
    local price = 0
    if thisRoomType == RoomType.ROOM_SHOP then -- 2
      itemID = CollectibleType.COLLECTIBLE_SHOP_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_TREASURE then -- 4
      itemID = CollectibleType.COLLECTIBLE_TREASURE_ROOM_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_MINIBOSS then -- 6
      itemID = CollectibleType.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_ARCADE then -- 9
      itemID = CollectibleType.COLLECTIBLE_ARCADE_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_CURSE then -- 10
      itemID = CollectibleType.COLLECTIBLE_CURSE_ROOM_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_CHALLENGE then -- 11
      itemID = CollectibleType.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_LIBRARY then -- 12
      itemID = CollectibleType.COLLECTIBLE_LIBRARY_TELEPORT
      price = 15
    elseif thisRoomType == RoomType.ROOM_SACRIFICE then -- 13
      itemID = CollectibleType.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_ISAACS then -- 18
      itemID = CollectibleType.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT
      price = 10
    elseif thisRoomType == RoomType.ROOM_BARREN then -- 19
      itemID = CollectibleType.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT
      price = 20
    elseif thisRoomType == RoomType.ROOM_CHEST then -- 20
      itemID = CollectibleType.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT
      price = 15
    elseif thisRoomType == RoomType.ROOM_DICE then -- 21
      itemID = CollectibleType.COLLECTIBLE_DICE_ROOM_TELEPORT
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
                                  position, g.zeroVector, nil, itemID, g.run.roomRNG):ToPickup()
      pedestal.AutoUpdatePrice = false
      pedestal.Price = price
    end
  end
end

-- Beast Baby
PostNewRoom.functions[242] = function()
  if g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex() then
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D10, false, false, false, false) -- 285
  end
end

-- Love Eye Baby
PostNewRoom.functions[249] = function()
  local roomType = g.r:GetType()
  if not g.run.babyBool or
     roomType == RoomType.ROOM_BOSS or -- 5
     roomType ~= RoomType.ROOM_DEVIL then -- 14

     -- Make an exception for Boss Rooms and Devil Rooms
     return
  end

  -- Replace all of the existing enemies with the stored one
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
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
end

-- Viking Baby
PostNewRoom.functions[261] = function()
  if g.r:GetType() ~= RoomType.ROOM_SECRET then -- 7
    return
  end

  -- Find the grid index of the Super Secret Room
  local rooms = g.l:GetRooms()
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
end

-- Ghost Baby 2
PostNewRoom.functions[282] = function()
  -- Constant Maw of the Void effect + flight
  g.p:SpawnMawOfVoid(30 * 60 * 60) -- 1 hour
end

-- Suit Baby
PostNewRoom.functions[287] = function()
  -- Ignore some select special rooms
  local roomType = g.r:GetType()
  if not g.r:IsFirstVisit() or
     roomType == RoomType.ROOM_DEFAULT or -- 1
     roomType == RoomType.ROOM_ERROR or -- 3
     roomType == RoomType.ROOM_BOSS or -- 5
     roomType == RoomType.ROOM_DEVIL or -- 14
     roomType == RoomType.ROOM_ANGEL or -- 15
     roomType == RoomType.ROOM_DUNGEON or -- 16
     roomType == RoomType.ROOM_BOSSRUSH or -- 17
     roomType == RoomType.ROOM_BLACK_MARKET then -- 22

    return
  end

  -- All special rooms are Devil Rooms
  g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
  local item = g.itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, g.run.roomRNG) -- 3
  local position = g:GridToPos(6, 4)
  local pedestal = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                              position, g.zeroVector, nil, item, g.run.roomRNG):ToPickup()
  pedestal.AutoUpdatePrice = false

  -- Find out how this item should be priced
  if g.p:GetMaxHearts() == 0 then
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
    g.g:Spawn(EntityType.ENTITY_FIREPLACE, 0, pos, g.zeroVector, nil, 0, g.run.roomRNG) -- 33
  end
end

-- Woodsman Baby
PostNewRoom.functions[297] = function()
  if g.l:GetCurrentRoomIndex() == g.l:GetStartingRoomIndex() then
    return
  end

  -- Open all of the doors
  for i = 0, 7 do
    local door = g.r:GetDoor(i)
    if door ~= nil then
      door:Open(true)
    end
  end
end

-- Mouse Baby
PostNewRoom.functions[351] = function()
  if not g.r:IsClear() then
    return
  end

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
end

-- Driver Baby
PostNewRoom.functions[431] = function()
  -- Slippery movement
  -- Prevent softlocks from Gaping Maws and cheap damage by Broken Gaping Maws by deleting them
  local maws = Isaac.FindByType(EntityType.ENTITY_GAPING_MAW, -1, -1, false, false) -- 235
  for _, maw in ipairs(maws) do
    maw:Remove()
  end
  local brokenMaws = Isaac.FindByType(EntityType.ENTITY_BROKEN_GAPING_MAW, -1, -1, false, false) -- 236
  for _, brokenMaw in ipairs(brokenMaws) do
    brokenMaw:Remove()
  end
end

-- Gamer Baby
PostNewRoom.functions[492] = function()
  if g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex() then -- This can prevent crashes when reseeding happens
    g.p:UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL) -- 37, 0
    -- If we try to cancel the animation now, it will bug out the player such that
    -- they will not be able to take pocket items or pedestal items
    -- This still happens even if we cancel the animation in the MC_POST_UPDATE callback,
    -- so don't bother canceling it
  end
end

-- Psychic Baby
PostNewRoom.functions[504] = function()
  -- Disable the vanilla shooting behavior
  local abels = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8
  for _, abel in ipairs(abels) do
    abel:ToFamiliar().FireCooldown = 1000000
  end
end

-- Silly Baby
PostNewRoom.functions[516] = function()
  if g.l:GetCurrentRoomIndex() ~= g.l:GetStartingRoomIndex() then -- This can prevent crashes when reseeding happens
    g.p:UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL) -- 42, 0
    -- If we try to cancel the animation now, it will bug out the player such that
    -- they will not be able to take pocket items or pedestal items
    -- This still happens even if we cancel the animation in the MC_POST_UPDATE callback,
    -- so don't bother canceling it
  end
end

-- Brother Bobby
PostNewRoom.functions[522] = function()
  local godheadTear = g.p:FireTear(g.p.Position, g.zeroVector, false, true, false)
  godheadTear.TearFlags = TearFlags.TEAR_GLOW -- 1 << 32
  godheadTear.SubType = 1
  local sprite = godheadTear:GetSprite()
  sprite:Load("gfx/tear_blank.anm2", true)
  sprite:Play("RegularTear6")
end

function PostNewRoom.NoHealth()
  -- Local variables
  local roomType = g.r:GetType()
  local roomDesc = g.l:GetCurrentRoomDesc()
  local roomVariant = roomDesc.Data.Variant

  -- Get rid of the health UI by using Curse of the Unknown
  -- (but not in Devil Rooms or Black Markets)
  g.seeds:RemoveSeedEffect(SeedEffect.SEED_PREVENT_ALL_CURSES) -- 70

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
end

return PostNewRoom
