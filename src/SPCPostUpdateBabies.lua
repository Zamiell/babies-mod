local SPCPostUpdateBabies = {}

-- Includes
local SPCGlobals         = require("src/spcglobals")
local SPCPostRender      = require("src/spcpostrender")
local SPCPseudoRoomClear = require("src/spcpseudoroomclear")

-- Called from the MC_POST_UPDATE (1) callback
function SPCPostUpdateBabies:Main()
  -- Local variables
  local type = SPCGlobals.run.babyType
  if SPCPostUpdateBabies.functions[type] ~= nil then
    SPCPostUpdateBabies.functions[type]()
  end
end

-- The collection of functions for each baby effect
SPCPostUpdateBabies.functions = {}

-- Troll Baby
SPCPostUpdateBabies.functions[6] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 90 == 0 then -- 3 seconds
    -- Spawn a Troll Bomb (4.3)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Bean Baby
SPCPostUpdateBabies.functions[17] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BUTTER_BEAN, false, false, false, false) -- 294
  end
end

-- Wrath Baby
SPCPostUpdateBabies.functions[19] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, false, false, false, false) -- 65
  end
end

-- Wrapped Baby
SPCPostUpdateBabies.functions[20] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 and -- If the explosions happen too fast, it looks buggy
     SPCGlobals.run.babyCounters > 0 then

    -- This should not cause any damage since the player will have invulnerability frames
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1
    player:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
  end
end

-- Black Baby
SPCPostUpdateBabies.functions[27] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Lil' Baby
SPCPostUpdateBabies.functions[36] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Everything is tiny
  -- This does not work if we put it in the MC_POST_NEW_LEVEL callback for some reason
  if player.SpriteScale.X > 0.5 or
     player.SpriteScale.Y > 0.5 then

    player.SpriteScale = Vector(0.5, 0.5)
  end
end

-- Big Baby
SPCPostUpdateBabies.functions[37] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Everything is giant
  -- This does not work if we put it in the MC_POST_NEW_LEVEL callback for some reason
  if player.SpriteScale.X < 2 or
     player.SpriteScale.Y < 2 then

    player.SpriteScale = Vector(2, 2)
  end
end

-- Noose Baby
SPCPostUpdateBabies.functions[39] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Shooting when the timer reaches 0 causes damage
  local remainingTime = SPCGlobals.run.babyCounters - gameFrameCount
  if remainingTime <= 0 then
    SPCGlobals.run.babyCounters = gameFrameCount + SPCGlobals.babies[341].time -- Reset the timer

    for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
      if Input.IsActionPressed(ButtonAction.ACTION_SHOOTLEFT, i) or -- 4
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTRIGHT, i) or -- 5
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTUP, i) or -- 6
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTDOWN, i) then -- 7

        player:TakeDamage(1, 0, EntityRef(player), 0)
        return
      end
    end
  end
end

-- Dark Baby
SPCPostUpdateBabies.functions[48] = function()
  -- Local variables
  local baby = SPCGlobals.babies[48]

  -- Temporary blindness
  -- Make the counters tick from 0 --> max --> 0, etc.
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    if SPCGlobals.run.babyCounters == baby.num then
      SPCGlobals.run.babyBool = true
    end
  else
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1
    if SPCGlobals.run.babyCounters == 0 then
      SPCGlobals.run.babyBool = false
    end
  end
end

-- Bound Baby
SPCPostUpdateBabies.functions[58] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false) -- 123
  end
end

-- Butthole Baby
SPCPostUpdateBabies.functions[63] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a random poop
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    math.randomseed(SPCGlobals.run.randomSeed)
    local poopVariant = math.random(0, 6)
    if poopVariant == PoopVariant.POOP_RED or -- 1
       poopVariant == PoopVariant.POOP_CORN then -- 2

      -- If the poop is this type, then it will instantly damage the player, so give them some invulnerability frames
      SPCGlobals.run.invulnerabilityFrame = gameFrameCount + 25
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, player.Position, false) -- 14

    -- Playing ID 37 will randomly play one of the three farting sound effects
    sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37
  end
end

-- Eye Patch Baby
SPCPostUpdateBabies.functions[64] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  Isaac.GridSpawn(GridEntityType.GRID_SPIKES, 0, player.Position, false) -- 8
end

-- Mustache Baby
SPCPostUpdateBabies.functions[66] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  -- Using the boomerang removes the charge on the current active item for some reason,
  -- so we have to restore it on the next frame
  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
    player:SetActiveCharge(SPCGlobals.run.babyCounters)
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
    sfx:Stop(SoundEffect.SOUND_BEEP) -- 171
    SPCGlobals.run.babyCounters = 0
  end
end

-- Scream Baby
SPCPostUpdateBabies.functions[81] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local activeCharge = player:GetActiveCharge()
  local sfx = SFXManager()

  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount <= SPCGlobals.run.babyFrame + 1 and
     activeCharge ~= SPCGlobals.run.babyCounters then

    player:SetActiveCharge(SPCGlobals.run.babyCounters)
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
    sfx:Stop(SoundEffect.SOUND_BEEP) -- 171
    Isaac.DebugString("Reset the active item charge.")
  end
end

-- Nerd Baby
SPCPostUpdateBabies.functions[90] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Frown Baby
SPCPostUpdateBabies.functions[96] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEST_FRIEND, false, false, false, false) -- 136
  end
end

-- Brownie Baby
SPCPostUpdateBabies.functions[107] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Starts with Level 4 Meatboy + Level 4 Meatgirl
  -- (if you spawn them in the MC_POST_NEW_LEVEL callback, it does not work for some reason)
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyBool = true
    game:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.CUBE_OF_MEAT_4, -- 3.47
               player.Position, Vector(0, 0), nil, 0, 0)
    game:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BALL_OF_BANDAGES_4, -- 3.72
               player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Pubic Baby
SPCPostUpdateBabies.functions[110] = function()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local rooms = level:GetRooms()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Don't do anything if we already full cleared the floor
  if SPCGlobals.run.babyBool then
    return
  end

  -- The doors are not open because the room is not yet cleared
  if roomClear == false then
    return
  end

  -- Check to see if the floor is full cleared
  local allCleared = true
  for i = 0, rooms.Size - 1 do -- This is 0 indexed
    local roomDesc = rooms:Get(i)
    local roomData = roomDesc.Data
    local roomType2 = roomData.Type
    if roomType2 == RoomType.ROOM_DEFAULT and -- 1
       roomDesc.Clear == false then

      allCleared = false
      break
    end
  end
  if allCleared then
    SPCGlobals.run.babyBool = true
    return
  end

  -- Keep the boss room door closed
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil and
       door:IsRoomType(RoomType.ROOM_BOSS) then -- 5

      door:Bar()
    end
  end
end

-- Eyemouth Baby
SPCPostUpdateBabies.functions[111] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTears.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTears.frame then

    SPCGlobals.run.babyTears.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTears.velocity, false, true, false)
  end
end

-- Hopeless Baby
SPCPostUpdateBabies.functions[125] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local keys = player:GetNumKeys()

  -- Keys are hearts
  if keys == 0 then
    player:Kill()
  end
end

-- Earwig Baby
SPCPostUpdateBabies.functions[128] = function()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local startingRoomIndex = level:GetStartingRoomIndex()
  local rooms = level:GetRooms()
  local room = game:GetRoom()
  local centerPos = room:GetCenterPos()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()
  local baby = SPCGlobals.babies[128]

  -- The floor may be reseeded, so we do not want this to be in the MC_POST_NEW_LEVEL callback
  if SPCGlobals.run.babyBool then
    return
  end
  SPCGlobals.run.babyBool = true

  -- 3 rooms are already explored
  -- Get the indexes of every room on the floor
  local floorIndexes = {}
  for i = 0, rooms.Size - 1 do -- This is 0 indexed
    floorIndexes[#floorIndexes + 1] = rooms:Get(i).SafeGridIndex
  end

  -- Get 3 unique random indexes
  local randomIndexes = {}
  for i = 1, baby.num do
    while true do
      -- Get a random room index on the floor
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      math.randomseed(SPCGlobals.run.randomSeed)
      local randomIndex = floorIndexes[math.random(1, #floorIndexes)]

      -- Check to see if this is one of the indexes that we are already warping to
      local valid = true
      for j = 1, #floorIndexes do
        if randomIndexes[j] == randomIndex then
          valid = false
          break
        end
      end

      -- Check to see if this is the starting room
      -- (we don't want the starting room to count)
      if randomIndex == startingRoomIndex then
        valid = false
      end

      -- Add it
      if valid then
        randomIndexes[#randomIndexes + 1] = randomIndex
        break
      end
    end
  end

  -- Explore these rooms
  for i = 1, #randomIndexes do
    local randomIndex = randomIndexes[i]
    level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    level:ChangeRoom(randomIndex)
  end
  level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
  level:ChangeRoom(startingRoomIndex)
  player.Position = centerPos

  -- We might have traveled to the Boss Room, so stop the Portcullis sound effect just in case
  sfx:Stop(SoundEffect.SOUND_CASTLEPORTCULLIS) -- 190
end

-- Mohawk Baby
SPCPostUpdateBabies.functions[138] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local bombs = player:GetNumBombs()

  -- Bombs are hearts
  if bombs == 0 then
    player:Kill()
  end
end

-- Bluebird Baby
SPCPostUpdateBabies.functions[147] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
  end

  -- Touching pickups causes paralysis (1/2)
  if player:IsItemQueueEmpty() == false and
     SPCGlobals.run.babyFrame == 0 then

    -- Using a pill does not clear the queue, so without a frame check the following code would soflock the player
    SPCGlobals.run.babyFrame = gameFrameCount + 45
    player:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
  end
end

-- Awaken Baby
SPCPostUpdateBabies.functions[155] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEKINESIS, false, false, false, false) -- 522
  end
end

-- Puff Baby
SPCPostUpdateBabies.functions[156] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_BEAN, false, false, false, false) -- 351
  end
end

-- Pretty Baby
SPCPostUpdateBabies.functions[158] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false) -- 123
    sfx:Stop(SoundEffect.SOUND_SATAN_GROW) -- 241
  end
end

-- Digital Baby
SPCPostUpdateBabies.functions[162] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local seeds = game:GetSeeds()

  if SPCGlobals.run.babyBool == false and
     roomFrameCount <= 1 then

    SPCGlobals.run.babyBool = true

    -- This baby grants SeedEffect.SEED_OLD_TV (8)
    -- However, applying this in the MC_POST_NEW_LEVEL callback can cause game crashes
    -- Instead, we manually apply it in the MC_POST_UPDATE callback
    seeds:AddSeedEffect(SeedEffect.SEED_OLD_TV) -- 8
  end
end

-- Helmet Baby
SPCPostUpdateBabies.functions[163] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Check to see if they are pressing any movement buttons
  local leftPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_LEFT, i) then -- 0
      leftPressed = true
      break
    end
  end
  local rightPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_RIGHT, i) then -- 1
      rightPressed = true
      break
    end
  end
  local upPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_UP, i) then -- 2
      upPressed = true
      break
    end
  end
  local downPressed = false
  for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
    if Input.IsActionPressed(ButtonAction.ACTION_DOWN, i) then -- 3
      downPressed = true
      break
    end
  end

  -- Keep track of whether they are moving or not
  -- Also, fade the character to indicate that they are invulnerable
  if SPCGlobals.run.babyBool == false and
     leftPressed == false and
     rightPressed == false and
     upPressed == false and
     downPressed == false then

    -- They stopped moving
    SPCGlobals.run.babyBool = true
    local color = player:GetColor()
    local fadeAmount = 0.5
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    player:SetColor(newColor, 0, 0, true, true)

  elseif SPCGlobals.run.babyBool and
         (leftPressed or
          rightPressed or
          upPressed or
          downPressed) then

    -- They started moving
    SPCGlobals.run.babyBool = false
    local color = player:GetColor()
    local fadeAmount = 1
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    player:SetColor(newColor, 0, 0, true, true)
  end
end

-- Black Eye Baby
SPCPostUpdateBabies.functions[164] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Starts with Leprosy, +5 damage on Leprosy breaking
  local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.LEPROCY, -1, false, false) -- 3.121
  if #entities < SPCGlobals.run.babyCounters then
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1

    -- We use the "babyFrame" variable to track how many damage ups we have recieved
    SPCGlobals.run.babyFrame = SPCGlobals.run.babyFrame + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()
  end
end

-- Worry Baby
SPCPostUpdateBabies.functions[167] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
  end

  -- Touching pickups causes teleportation (1/2)
  if player:IsItemQueueEmpty() == false then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44
  end
end

-- Gappy Baby
SPCPostUpdateBabies.functions[171] = function()
  -- Local variables
  local game = Game()

  -- Broken machines drop pedestal items
  -- (there is no MC_POST_SLOT_UPDATE callback so we have to do this here)
  local entities = Isaac.FindByType(EntityType.ENTITY_SLOT, -1, -1, false, false) -- 6
  for i = 1, #entities do
    local entity = entities[i]
    local sprite = entity:GetSprite()
    local data = entity:GetData()
    if data.destroyed == nil and
       (sprite:IsPlaying("Broken") or -- Normal machines
        sprite:IsPlaying("Death")) then -- Restock machines

      data.destroyed = true
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 entity.Position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
    end
  end
end

-- Skull Baby
SPCPostUpdateBabies.functions[211] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  -- Shockwave bombs
  for i = 1, #SPCGlobals.run.babyTears do
    local tear = SPCGlobals.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    if (gameFrameCount - tear.frame) % 2 == 0 then
      local explosion = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, -- 1000.62
                                   tear.position, Vector(0, 0), player, 0, 0)
      local index = room:GetGridIndex(tear.position)
      room:DestroyGrid(index)
      tear.position = tear.position + tear.velocity
      sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1) -- 137
      -- (if the sound effect plays at full volume, it starts to get annoying)

      -- Make the shockwave deal damage to the player
      if SPCGlobals:InsideSquare(tear.position, player.Position, 40) then
        player:TakeDamage(1, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
      end

      -- Make the shockwave deal damage to NPCs
      local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY) -- 1 << 3
      for j = 1, #entities do
        local damage = player.Damage * 1.5
        entities[j]:TakeDamage(damage, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
       end
     end

     -- Stop if it gets to a wall
     if room:IsPositionInRoom(tear.position, 0) == false then
       table.remove(SPCGlobals.run.babyTears, i)
     end
  end
end

-- Fancy Baby
SPCPostUpdateBabies.functions[216] = function()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local rooms = level:GetRooms()
  local player = game:GetPlayer(0)

  local teleport = 0
  if player.QueuedItem.Item ~= nil then
    if player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Shop Teleport") then
      teleport = RoomType.ROOM_SHOP -- 2
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Treasure Room Teleport") then
      teleport = RoomType.ROOM_TREASURE -- 4
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Mini-Boss Room Teleport") then
      teleport = RoomType.ROOM_MINIBOSS -- 6
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Arcade Teleport") then
      teleport = RoomType.ROOM_ARCADE -- 9
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Curse Room Teleport") then
      teleport = RoomType.ROOM_CURSE -- 10
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Challenge Room Teleport") then
      teleport = RoomType.ROOM_CHALLENGE -- 11
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Library Teleport") then
      teleport = RoomType.ROOM_LIBRARY -- 12
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Sacrifice Room Teleport") then
      teleport = RoomType.ROOM_SACRIFICE -- 13
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Bedroom (Clean) Teleport") then
      teleport = RoomType.ROOM_ISAACS -- 18
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Bedroom (Dirty) Teleport") then
      teleport = RoomType.ROOM_BARREN -- 19
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Treasure Chest Room Teleport") then
      teleport = RoomType.ROOM_CHEST -- 20
    elseif player.QueuedItem.Item.ID == Isaac.GetItemIdByName("Dice Room Teleport") then
      teleport = RoomType.ROOM_DICE -- 21
    end
  end
  if teleport ~= 0 then
    -- Find the grid index of the intended room
    for i = 0, rooms.Size - 1 do -- This is 0 indexed
      local roomDesc = rooms:Get(i)
      local index = roomDesc.SafeGridIndex -- This is always the top-left index
      local roomData = roomDesc.Data
      local roomType = roomData.Type
      if roomType == teleport then -- 8
        -- Teleport to the intended room
        level.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
        game:StartRoomTransition(index, Direction.NO_DIRECTION, RoomTransition.TRANSITION_TELEPORT) -- -1, 3
        break
      end
    end
  end
end

-- Drool Baby
SPCPostUpdateBabies.functions[221] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local player = game:GetPlayer(0)

  -- Starts with Monstro's Tooth (improved)
  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    if roomClear then
      -- The room might have been cleared since the initial Monstro's Tooth activation
      -- If so, cancel the remaining Monstro's
      SPCGlobals.run.babyCounters = 0
      SPCGlobals.run.babyFrame = 0
    else
      player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false) -- 86
    end
  end
end

-- Bawl Baby
SPCPostUpdateBabies.functions[231] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local hearts = player:GetHearts()
  local soulHearts = player:GetSoulHearts()
  local boneHearts = player:GetBoneHearts()

  -- Prevent softlocks that occur if you try to jump into a Big Chest
  local chests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #chests > 0 then
    return
  end

  if gameFrameCount % 3 == 0 and
     hearts + soulHearts + boneHearts > 0 then
     -- Prevent the bug where dying with this baby will softlock and not show the game over screen

    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false) -- 323
    SPCGlobals.run.babyBool = false
  end
end

-- Medusa Baby
SPCPostUpdateBabies.functions[250] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local bombs = player:GetNumBombs()
  local keys = player:GetNumKeys()

  -- Coins convert to bombs and keys
  if bombs == 0 and
     player:GetNumCoins() > 0 then

    player:AddCoins(-1)
    player:AddBombs(1)
  end
  if keys == 0 and
    player:GetNumCoins() > 0 then

    player:AddCoins(-1)
    player:AddKeys(1)
  end
end

-- Cloud Baby
SPCPostUpdateBabies.functions[256] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local baby = SPCGlobals.babies[256]

  if gameFrameCount % baby.num == 0 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, false, false, false, false) -- 396
  end
end

-- Raccoon Baby
SPCPostUpdateBabies.functions[263] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Reroll all of the rocks in the room
  -- (this does not work if we do it in the MC_POST_NEW_ROOM callback or on the 0th frame)
  if roomFrameCount == 1 and
     room:IsFirstVisit() then

    player:UseActiveItem(CollectibleType.COLLECTIBLE_D12, false, false, false, false) -- 386
  end
end

-- Hare Baby
SPCPostUpdateBabies.functions[267] = function()
  local game = Game()
  local player = game:GetPlayer(0)
  local playerSprite = player:GetSprite()
  local sfx = SFXManager()

  -- Takes damage when standing still
  -- Prevent the (vanilla) bug where the player will take damage upon jumping into a trapdoor
  if player:HasInvincibility() == false and
     (playerSprite:IsPlaying("Trapdoor") or
      playerSprite:IsPlaying("Trapdoor2") or
      playerSprite:IsPlaying("Jump") or
      playerSprite:IsPlaying("LightTravel")) then

    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) -- 55
  end
end

-- Porcupine Baby
SPCPostUpdateBabies.functions[270] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_WAIT_WHAT, false, false, false, false) -- 484
  end
end

-- Heart Baby
SPCPostUpdateBabies.functions[290] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) -- 55
  end
end

-- Rider Baby
SPCPostUpdateBabies.functions[295] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local sfx = SFXManager()

  -- Keep the pony fully charged
  if activeItem == CollectibleType.COLLECTIBLE_PONY and -- 130
     player:NeedsCharge() then

    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Pizza Baby
SPCPostUpdateBabies.functions[303] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    SPCGlobals.run.babyFrame = gameFrameCount + SPCGlobals.babies[303].delay
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BROWN_NUGGET, false, false, false, false) -- 504
    if SPCGlobals.run.babyCounters == 19 then -- One is already spawned with the initial trigger
      SPCGlobals.run.babyCounters = 0
      SPCGlobals.run.babyFrame = 0
    end
  end
end

-- Hotdog Baby
SPCPostUpdateBabies.functions[304] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111
  end
end

-- Corrupted Baby
SPCPostUpdateBabies.functions[307] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Taking items/pickups causes damage (1/2)
  if player:IsItemQueueEmpty() == false then
    player:TakeDamage(1, 0, EntityRef(player), 0)
  end
end

-- Exploding Baby
SPCPostUpdateBabies.functions[320] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  -- Check to see if we need to reset the cooldown
  -- (after we used the Kamikaze! effect upon touching an obstacle)
  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
  end
end

-- Butterfly Baby 2
SPCPostUpdateBabies.functions[332] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Flight + can walk through walls
  player.GridCollisionClass = GridCollisionClass.COLLISION_NONE -- 0
end

-- Hero Baby
SPCPostUpdateBabies.functions[336] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyBool then
    SPCGlobals.run.babyBool = false
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

-- Vomit Baby
SPCPostUpdateBabies.functions[341] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Moving when the timer reaches 0 causes damage
  local remainingTime = SPCGlobals.run.babyCounters - gameFrameCount
  if remainingTime <= 0 then
    SPCGlobals.run.babyCounters = gameFrameCount + SPCGlobals.babies[341].time -- Reset the timer


    local cutoff = 0.2
    if player.Velocity.X > cutoff or
       player.Velocity.X < cutoff * -1 or
       player.Velocity.Y > cutoff or
       player.Velocity.Y < cutoff * -1 then

      player:TakeDamage(1, 0, EntityRef(player), 0)
    end
  end
end

-- Fourtone Baby
SPCPostUpdateBabies.functions[348] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local sfx = SFXManager()

  -- Keep the Candle always fully charged
  if activeItem == CollectibleType.COLLECTIBLE_CANDLE and -- 164
     player:NeedsCharge() then

    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Grayscale Baby
SPCPostUpdateBabies.functions[349] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 300 == 0 then -- 10 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DELIRIOUS, false, false, false, false) -- 510
    SPCPostRender:SetPlayerSprite()
  end
end

-- Mouse Baby
SPCPostUpdateBabies.functions[351] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Pink Princess Baby
SPCPostUpdateBabies.functions[374] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  if gameFrameCount % 120 == 0 then -- 4 second
    -- Spawn a random stomp
    game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.MOM_FOOT_STOMP, -- 1000.29
               Isaac.GetRandomPosition(), Vector(0, 0), nil, 0, 0)
  end
end

-- Blue Pig Baby
SPCPostUpdateBabies.functions[382] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a Mega Troll Bomb (4.5)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Imp Baby
SPCPostUpdateBabies.functions[386] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local baby = SPCGlobals.babies[386]

  -- If we rotate the knives on every frame, then it spins too fast
  if gameFrameCount < SPCGlobals.run.babyFrame then
    return
  end

  SPCGlobals.run.babyFrame = SPCGlobals.run.babyFrame + baby.num

  -- Rotate through the four directions
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters >= 8 then
    SPCGlobals.run.babyCounters = 4
  end
end

-- Blue Wrestler Baby
SPCPostUpdateBabies.functions[388] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Enemies spawn projectiles upon death
  for i = 1, #SPCGlobals.run.babyTears do
    local tear = SPCGlobals.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    local velocity = player.Position - tear.position
    velocity = velocity:Normalized() * 13
    game:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, -- 9.0
               tear.position, velocity, nil, 0, 0)
    tear.num = tear.num - 1
    if tear.num == 0 then
      -- The dead enemy has shot all of its tears, so we remove the tracking element for it
      table.remove(SPCGlobals.run.babyTears, i)
    end
  end
end

-- Plague Baby
SPCPostUpdateBabies.functions[396] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 5 == 0 then -- Every 5 frames
    -- Drip green creep
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_GREEN, -- 53
                             player.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Timeout = 240
  end
end

-- Corgi Baby
SPCPostUpdateBabies.functions[401] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 45 == 0 then -- 1.5 seconds
    -- Spawn a Fly (13.0)
    game:Spawn(EntityType.ENTITY_FLY, 0, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Magic Cat Baby
SPCPostUpdateBabies.functions[428] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_KIDNEY_BEAN, false, false, false, false) -- 421
  end
end

-- Mutated Fish Baby
SPCPostUpdateBabies.functions[449] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516
  end
end

-- Voxdog Baby
SPCPostUpdateBabies.functions[462] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  -- Shockwave tears
  for i = 1, #SPCGlobals.run.babyTears do
    local tear = SPCGlobals.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    if (gameFrameCount - tear.frame) % 2 == 0 then
      local explosion = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, -- 1000.62
                                   tear.position, Vector(0, 0), player, 0, 0)
      local index = room:GetGridIndex(tear.position)
      room:DestroyGrid(index)
      tear.position = tear.position + tear.velocity
      sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1) -- 137
      -- (if the sound effect plays at full volume, it starts to get annoying)

      -- Make the shockwave deal damage to NPCs
      local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY) -- 1 << 3
      for j = 1, #entities do
        local damage = player.Damage * 1.5
        entities[j]:TakeDamage(damage, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
       end
     end

     -- Stop if it gets to a wall
     if room:IsPositionInRoom(tear.position, 0) == false then
       table.remove(SPCGlobals.run.babyTears, i)
     end
  end
end

-- Scoreboard Baby
SPCPostUpdateBabies.functions[474] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyCounters ~= 0 then
    local remainingTime = SPCGlobals.run.babyCounters - gameFrameCount
    if remainingTime <= 0 then
      SPCGlobals.run.babyCounters = 0
      player:Kill()
    end
  end
end

-- Cool Orange Baby
SPCPostUpdateBabies.functions[485] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 second
    -- Spawn a random rocket target
    local target = game:Spawn(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossTarget"), -- 1000
                              Isaac.GetRandomPosition(), Vector(0, 0), nil, 0, 0)
    local sprite = target:GetSprite()
    sprite:Play("Blink", true)
    -- Target and rocket behavior are handled in the MC_POST_EFFECT_UPDATE callback
  end
end

-- Mern Baby
SPCPostUpdateBabies.functions[500] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTears.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTears.frame then

    SPCGlobals.run.babyTears.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTears.velocity, false, true, false)
  end
end

-- Sausage Lover Baby
SPCPostUpdateBabies.functions[508] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 and -- 5 seconds
     roomClear == false then -- Monstro is unavoidable if he targets you

    player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false) -- 86
  end
end

-- Baggy Cap Baby
SPCPostUpdateBabies.functions[519] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Check all of the doors
  if roomClear then
    return
  end

  -- Check to see if a door opened before the room was clear
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil and
       door:IsOpen() then

      door:Close(true)
    end
  end
end

-- Twitchy Baby
SPCPostUpdateBabies.functions[511] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local gameFrameCount = game:GetFrameCount()
  local baby = SPCGlobals.babies[511]

  if gameFrameCount >= SPCGlobals.run.babyFrame then
    SPCGlobals.run.babyFrame = SPCGlobals.run.babyFrame + baby.num
    if SPCGlobals.run.babyBool then
      -- Tear rate is increasing
      SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
      if SPCGlobals.run.babyCounters == baby.max then
        SPCGlobals.run.babyBool = false
      end
    else
      -- Tear rate is decreasing
      SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1
      if SPCGlobals.run.babyCounters == baby.min then
        SPCGlobals.run.babyBool = true
      end
    end

    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

-- Invisible Baby
SPCPostUpdateBabies.functions[541] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)

  if roomFrameCount == 1 then
    -- The sprite is a blank PNG, but we also want to remove the shadow
    -- Doing this in the MC_POST_NEW_ROOM callback (or on frame 0) won't work
    player.Visible = false
  end
end

return SPCPostUpdateBabies
