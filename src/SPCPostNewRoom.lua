local SPCPostNewRoom = {}

-- Includes
local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_NEW_ROOM (19)
function SPCPostNewRoom:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local stageType = level:GetStageType()

  Isaac.DebugString("MC_POST_NEW_ROOM (SPC)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if gameFrameCount == 0 or
     (SPCGlobals.run.currentFloor ~= stage or
      SPCGlobals.run.currentFloorType ~= stageType) then

    return
  end

  SPCPostNewRoom:NewRoom()
end

function SPCPostNewRoom:NewRoom()
  -- Local variabbles
  local game = Game()
  local level = game:GetLevel()
  local roomIndex = level:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = level:GetCurrentRoomIndex()
  end
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local roomSeed = room:GetSpawnSeed()

  Isaac.DebugString("MC_POST_NEW_ROOM2 (SPC)")

  -- Increment level variables
  SPCGlobals.run.currentFloorRoomsEntered = SPCGlobals.run.currentFloorRoomsEntered + 1
  if roomIndex == level:GetStartingRoomIndex() and
     SPCGlobals.run.currentFloorRoomsEntered == 1 then

    -- We don't want the starting room of the floor to count towards the rooms entered
    SPCGlobals.run.currentFloorRoomsEntered = 0
  end

  -- Reset room variables
  SPCGlobals.run.roomClear = roomClear
  SPCGlobals.run.roomRNG = roomSeed
  SPCGlobals.run.babyCountersRoom = 0
  SPCGlobals.run.roomPseudoClear = true
  SPCGlobals.run.roomDoorsModified = {}
  SPCGlobals.run.roomButtonsPushed = false
  SPCGlobals.run.roomClearDelayFrame = 0
  SPCGlobals.run.lastRoomIndex = SPCGlobals.run.currentRoomIndex
  SPCGlobals.run.currentRoomIndex = roomIndex
  SPCGlobals.run.shootTears = {}

  -- Do nothing if we are not a baby
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Reset the player's sprite, just in case it got messed up
  SPCPostRender:SetPlayerSprite()

  -- Stop drawing the baby intro text once the player goes into a new room
  if SPCGlobals.run.drawIntro then
    SPCGlobals.run.drawIntro = false
  end

  SPCPostNewRoom:ApplyTemporaryEffects()
end

function SPCPostNewRoom:ApplyTemporaryEffects()
  -- Local variables
  local game = Game()
  local itemPool = game:GetItemPool()
  local level = game:GetLevel()
  local rooms = level:GetRooms()
  local room = game:GetRoom()
  local roomType = room:GetType()
  local roomSeed = room:GetSpawnSeed()
  local player = game:GetPlayer(0)
  local effects = player:GetEffects()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Some babies have flight
  if baby.flight and
     player.CanFly == false then

    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BIBLE, true) -- 33
  end

  -- Apply baby-specific temporary effects
  if baby.name == "Shadow Baby" and -- 13
     (roomType == RoomType.ROOM_DEVIL or -- 14
      roomType == RoomType.ROOM_ANGEL) then -- 15

    level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    game:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, 0) -- -6, -1

  elseif baby.name == "Gold Baby" then -- 15
    room:TurnGold()

  elseif baby.name == "Cy-Baby" then -- 16
    -- Spawn a laser ring around the player
    local laser = player:FireTechXLaser(player.Position, Vector(0,0), 66):ToLaser() -- The third argument is the radius
    -- (we copy the radius from Samael's Tech X ability)
    if laser.Variant ~= 2 then
      laser.Variant = 2
      laser.SpriteScale = Vector(0.5, 1)
    end
    laser.TearFlags = laser.TearFlags | TearFlags.TEAR_CONTINUUM -- 1 << 36
    laser.CollisionDamage = laser.CollisionDamage * 0.66
    local data = laser:GetData()
    data.ring = true

  elseif baby.name == "Blue Baby" then -- 30
    -- Sprinkler tears
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516

  elseif baby.name == "Statue Baby 2" and -- 118
         roomType == RoomType.ROOM_SECRET and -- 7
         room:IsFirstVisit() then

    -- Improved Secret Rooms
    for i = 1, 4 do
      local center = room:GetCenterPos()
      local position = room:FindFreePickupSpawnPosition(center, 1, true)
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
    end

  elseif baby.name == "Twin Baby" and -- 141
         SPCGlobals.run.currentFloorRoomsEntered > 0 then -- We don't want to teleport away from the first room
         -- (the starting room does not count for the purposes of this variable)

    if SPCGlobals.run.babyBool then
      -- We teleported to this room
      SPCGlobals.run.babyBool = false
    else
      -- We are entering a new room
      SPCGlobals.run.babyBool = true
      player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44
    end

  elseif baby.name == "Butterfly Baby" and -- 149
         roomType == RoomType.ROOM_SUPERSECRET and -- 8
         room:IsFirstVisit() then

    -- Improved Super Secret Rooms
    for i = 1, 5 do
      local center = room:GetCenterPos()
      local position = room:FindFreePickupSpawnPosition(center, 1, true)
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
      end

  elseif baby.name == "Spelunker Baby" and -- 181
         roomType == RoomType.ROOM_DUNGEON and -- 16
         SPCGlobals.run.lastRoomIndex ~= GridRooms.ROOM_BLACK_MARKET_IDX then -- -6
         -- (we want to be able to backtrack from a Black Market to a Crawlspace)

    level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    game:StartRoomTransition(GridRooms.ROOM_BLACK_MARKET_IDX, Direction.NO_DIRECTION, 0) -- -6, -1

  elseif baby.name == "Beast Baby" then -- 242
    player:UseActiveItem(CollectibleType.COLLECTIBLE_D10, false, false, false, false) -- 285

  elseif baby.name == "Love Eye Baby" and -- 249
         SPCGlobals.run.babyBool and
         roomType ~= RoomType.ROOM_BOSS then -- 5

    -- Replace all of the existing enemies with the stored one
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil then
        game:Spawn(SPCGlobals.run.babyNPC.type, SPCGlobals.run.babyNPC.variant,
                   npc.Position, npc.Velocity, nil, SPCGlobals.run.babyNPC.subType, npc.InitSeed)
        npc:Remove()
      end
    end

  elseif baby.name == "Viking Baby" and -- 261
         roomType == RoomType.ROOM_SECRET then -- 7

    -- Find the grid index of the Super Secret Room
    for i = 0, rooms.Size - 1 do -- This is 0 indexed
      local roomDesc = rooms:Get(i)
      local roomIndex = roomDesc.SafeGridIndex -- This is always the top-left index
      local roomData = roomDesc.Data
      local roomType2 = roomData.Type
      if roomType2 == RoomType.ROOM_SUPERSECRET then -- 8
        -- Teleport to the Super Secret Room
        level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
        game:StartRoomTransition(roomIndex, Direction.NO_DIRECTION, 3) -- -1, 3 is Teleport
        break
      end
    end

  elseif baby.name == "Suit Baby" and -- 287
         roomType ~= RoomType.ROOM_DEFAULT and -- 1
         roomType ~= RoomType.ROOM_ERROR and -- 3
         roomType ~= RoomType.ROOM_BOSS and -- 5
         roomType ~= RoomType.ROOM_DEVIL and -- 14
         roomType ~= RoomType.ROOM_ANGEL and -- 15
         roomType ~= RoomType.ROOM_DUNGEON and -- 16
         roomType ~= RoomType.ROOM_BOSSRUSH and -- 17
         roomType ~= RoomType.ROOM_BLACK_MARKET then -- 22

    -- All special rooms are Devil Rooms
    local item = itemPool:GetCollectible(ItemPoolType.POOL_DEVIL, true, roomSeed) -- 3
    local position = SPCGlobals:GridToPos(6, 4)
    local pedestal = game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                                position, Vector(0, 0), nil, item, roomSeed):ToPickup()
    pedestal.AutoUpdatePrice = false
    pedestal.Price = -2

    -- Spawn the Devil Statue
    room:SpawnGridEntity(52, GridEntityType.GRID_STATUE, 0, 0, 0) -- 21

    -- Spawn the two fires
    local pos1 = SPCGlobals:GridToPos(3, 1)
    game:Spawn(EntityType.ENTITY_FIREPLACE, 0, pos1, Vector(0, 0), nil, 0, 0) -- 33
    local pos2 = SPCGlobals:GridToPos(9, 1)
    game:Spawn(EntityType.ENTITY_FIREPLACE, 0, pos2, Vector(0, 0), nil, 0, 0) -- 33

  elseif baby.name == "Woodsman Baby" then -- 297
    -- Open all of the doors
    for i = 0, 7 do
      local door = room:GetDoor(i)
      if door ~= nil then
        door:Open(true)
      end
    end

  elseif baby.name == "Butterfly Baby 2" then -- 332
    player.GridCollisionClass = 0

  elseif baby.name == "Gamer Baby" then -- 492
    player:UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL) -- 37, 0
    player:StopExtraAnimation()

  elseif baby.name == "Psychic Baby" then -- 504
    -- Get Abel
    local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8

    -- Disable the vanilla shooting behavior
    entities[1]:ToFamiliar().FireCooldown = 1000000

  elseif baby.name == "Silly Baby" then -- 516
    player:UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL) -- 42, 0
    player:StopExtraAnimation()

  elseif baby.name == "Brother Bobby" then -- 522
    local godheadTear = player:FireTear(player.Position, Vector(0, 0), false, true, false)
    godheadTear.TearFlags = TearFlags.TEAR_GLOW -- 1 << 32
    godheadTear.SubType = 1
    local sprite = godheadTear:GetSprite()
    sprite:Load("gfx/tear_blank.anm2", true)
    sprite:Play("RegularTear6")
  end
end

return SPCPostNewRoom
