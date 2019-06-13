local PostUpdateBabies = {}

-- Includes
local g               = require("babies_mod/globals")
local PostRender      = require("babies_mod/postrender")
local PseudoRoomClear = require("babies_mod/pseudoroomclear")

function PostUpdateBabies:Main()
  -- Local variables
  local type = g.run.babyType
  local babyFunc = PostUpdateBabies.functions[type]
  if babyFunc ~= nil then
    babyFunc()
  end
end

-- The collection of functions for each baby
PostUpdateBabies.functions = {}

-- Troll Baby
PostUpdateBabies.functions[6] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 90 == 0 then -- 3 seconds
    -- Spawn a Troll Bomb (4.3)
    g.g:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, g.p.Position, g.zeroVector, nil, 0, 0)
  end
end

-- Bean Baby
PostUpdateBabies.functions[17] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Prevent softlocks that occur if you try to jump into a Big Chest
  local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #bigChests > 0 then
    return
  end

  if gameFrameCount % 30 == 0 then -- 1 second
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BUTTER_BEAN, false, false, false, false) -- 294
  end
end

-- Wrath Baby
PostUpdateBabies.functions[19] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 210 == 0 then -- 7 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, false, false, false, false) -- 65
  end
end

-- Wrapped Baby
PostUpdateBabies.functions[20] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 3 == 0 and -- If the explosions happen too fast, it looks buggy
     g.run.babyCounters > 0 then

    -- This should not cause any damage since the player will have invulnerability frames
    g.run.babyCounters = g.run.babyCounters - 1
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
  end
end

-- Black Baby
PostUpdateBabies.functions[27] = function()
  PseudoRoomClear:PostUpdate()
end

-- Lil' Baby
PostUpdateBabies.functions[36] = function()
  -- Everything is tiny
  -- This does not work if we put it in the MC_POST_NEW_LEVEL callback for some reason
  if g.p.SpriteScale.X > 0.5 or
     g.p.SpriteScale.Y > 0.5 then

    g.p.SpriteScale = Vector(0.5, 0.5)
  end
end

-- Big Baby
PostUpdateBabies.functions[37] = function()
  -- Everything is giant
  -- This does not work if we put it in the MC_POST_NEW_LEVEL callback for some reason
  if g.p.SpriteScale.X < 2 or
     g.p.SpriteScale.Y < 2 then

    g.p.SpriteScale = Vector(2, 2)
  end
end

-- Noose Baby
PostUpdateBabies.functions[39] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Shooting when the timer reaches 0 causes damage
  local remainingTime = g.run.babyCounters - gameFrameCount
  if remainingTime <= 0 then
    g.run.babyCounters = gameFrameCount + g.babies[341].time -- Reset the timer

    for i = 0, 3 do -- There are 4 possible inputs/players from 0 to 3
      if Input.IsActionPressed(ButtonAction.ACTION_SHOOTLEFT, i) or -- 4
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTRIGHT, i) or -- 5
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTUP, i) or -- 6
         Input.IsActionPressed(ButtonAction.ACTION_SHOOTDOWN, i) then -- 7

        g.p:TakeDamage(1, 0, EntityRef(g.p), 0)
        return
      end
    end
  end
end

-- Whore Baby
PostUpdateBabies.functions[43] = function()
  -- Local variables
  local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = g.l:GetCurrentRoomIndex()
  end

  -- All enemies explode
  -- Perform the explosion that was initiated in the MC_POST_ENTITY_KILL callback
  for i, explosion in ipairs(g.run.babyCounters) do
    if explosion.roomIndex == roomIndex then
      Isaac.Explode(explosion.position, nil, 50) -- 49 deals 1 half heart of damage
    end
    table.remove(g.run.babyCounters, i)
  end
end

-- Dark Baby
PostUpdateBabies.functions[48] = function()
  -- Local variables
  local baby = g.babies[48]

  -- Temporary blindness
  -- Make the counters tick from 0 --> max --> 0, etc.
  if not g.run.babyBool then
    g.run.babyCounters = g.run.babyCounters + 1
    if g.run.babyCounters == baby.num then
      g.run.babyBool = true
    end
  else
    g.run.babyCounters = g.run.babyCounters - 1
    if g.run.babyCounters == 0 then
      g.run.babyBool = false
    end
  end
end

-- Bound Baby
PostUpdateBabies.functions[58] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 210 == 0 then -- 7 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false) -- 123
  end
end

-- Butthole Baby
PostUpdateBabies.functions[63] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a random poop
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    math.randomseed(g.run.randomSeed)
    local poopVariant = math.random(0, 6)
    if poopVariant == PoopVariant.POOP_RED or -- 1
       poopVariant == PoopVariant.POOP_CORN then -- 2

      -- If the poop is this type, then it will instantly damage the player, so give them some invulnerability frames
      g.run.invulnerabilityFrame = gameFrameCount + 25
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, g.p.Position, false) -- 14

    -- Playing ID 37 will randomly play one of the three farting sound effects
    g.sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37
  end
end

-- Eye Patch Baby
PostUpdateBabies.functions[64] = function()
  Isaac.GridSpawn(GridEntityType.GRID_SPIKES, 0, g.p.Position, false) -- 8
end

-- Scream Baby
PostUpdateBabies.functions[81] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local activeCharge = g.p:GetActiveCharge()
  local batteryCharge = g.p:GetBatteryCharge()

  if g.run.babyFrame ~= 0 and
     gameFrameCount <= g.run.babyFrame + 1 and
     (activeCharge ~= g.run.babyCounters or -- We store the main charge in the "babyCounters" variable
      batteryCharge ~= g.run.babyNPC.type) then -- We store the Battery charge in the "babyNPC.type" variable

    g.p:SetActiveCharge(g.run.babyCounters + g.run.babyNPC.type)
    g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
    g.sfx:Stop(SoundEffect.SOUND_BEEP) -- 171
    Isaac.DebugString("Reset the active item charge.")
  end
end

-- Nerd Baby
PostUpdateBabies.functions[90] = function()
  PseudoRoomClear:PostUpdate()
end

-- Frown Baby
PostUpdateBabies.functions[96] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEST_FRIEND, false, false, false, false) -- 136
  end
end

-- Brownie Baby
PostUpdateBabies.functions[107] = function()
  -- Starts with Level 4 Meatboy + Level 4 Meatgirl
  -- (if you spawn them in the MC_POST_NEW_LEVEL callback, it does not work for some reason)
  if not g.run.babyBool then
    g.run.babyBool = true
    g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.CUBE_OF_MEAT_4, -- 3.47
              g.p.Position, g.zeroVector, nil, 0, 0)
    g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BALL_OF_BANDAGES_4, -- 3.72
              g.p.Position, g.zeroVector, nil, 0, 0)
  end
end

-- Pubic Baby
PostUpdateBabies.functions[110] = function()
  -- Local variables
  local rooms = g.l:GetRooms()
  local roomClear = g.r:IsClear()

  -- Don't do anything if we already full cleared the floor
  if g.run.babyBool then
    return
  end

  -- The doors are not open because the room is not yet cleared
  if not roomClear then
    return
  end

  -- Check to see if the floor is full cleared
  local allCleared = true
  for i = 0, rooms.Size - 1 do -- This is 0 indexed
    local roomDesc = rooms:Get(i)
    local roomData = roomDesc.Data
    local roomType2 = roomData.Type
    if (roomType2 == RoomType.ROOM_DEFAULT or -- 1
        roomType2 == RoomType.ROOM_MINIBOSS) and -- 6
       not roomDesc.Clear then

      allCleared = false
      break
    end
  end
  if allCleared then
    g.run.babyBool = true
    return
  end

  -- Keep the boss room door closed
  for i = 0, 7 do
    local door = g.r:GetDoor(i)
    if door ~= nil and
       door:IsRoomType(RoomType.ROOM_BOSS) then -- 5

      door:Bar()
    end
  end
end

-- Eyemouth Baby
PostUpdateBabies.functions[111] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyTears.frame ~= 0 and
     gameFrameCount >= g.run.babyTears.frame then

    g.run.babyTears.frame = 0
    g.p:FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false)
  end
end

-- Hopeless Baby
PostUpdateBabies.functions[125] = function()
  -- Local variables
  local keys = g.p:GetNumKeys()

  -- Keys are hearts
  if keys == 0 then
    g.p:Kill()
  end
end

-- Earwig Baby
PostUpdateBabies.functions[128] = function()
  -- Local variables
  local startingRoomIndex = g.l:GetStartingRoomIndex()
  local rooms = g.l:GetRooms()
  local centerPos = g.r:GetCenterPos()
  local baby = g.babies[128]

  -- The floor may be reseeded, so we do not want this to be in the MC_POST_NEW_LEVEL callback
  if g.run.babyBool then
    return
  end
  g.run.babyBool = true

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
      g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
      math.randomseed(g.run.randomSeed)
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
    g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
    g.l:ChangeRoom(randomIndex)

    -- We might have traveled to the Boss Room, so stop the Portcullis sound effect just in case
    g.sfx:Stop(SoundEffect.SOUND_CASTLEPORTCULLIS) -- 190
  end
  g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
  g.l:ChangeRoom(startingRoomIndex)
  g.p.Position = centerPos
end

-- Mohawk Baby
PostUpdateBabies.functions[138] = function()
  -- Local variables
  local bombs = g.p:GetNumBombs()

  -- Bombs are hearts
  if bombs == 0 then
    g.p:Kill()
  end
end

-- Bluebird Baby
PostUpdateBabies.functions[147] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyFrame ~= 0 and
     gameFrameCount >= g.run.babyFrame then

    g.run.babyFrame = 0
  end

  -- Touching pickups causes paralysis (1/2)
  if not g.p:IsItemQueueEmpty() and
     g.run.babyFrame == 0 then

    -- Using a pill does not clear the queue, so without a frame check the following code would soflock the player
    g.run.babyFrame = gameFrameCount + 45
    g.p:UsePill(PillEffect.PILLEFFECT_PARALYSIS, PillColor.PILL_NULL) -- 22, 0
  end
end

-- Awaken Baby
PostUpdateBabies.functions[155] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 second
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEKINESIS, false, false, false, false) -- 522
  end
end

-- Puff Baby
PostUpdateBabies.functions[156] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local hearts = g.p:GetHearts()
  local soulHearts = g.p:GetSoulHearts()
  local boneHearts = g.p:GetBoneHearts()

  -- Prevent softlocks that occur if you try to jump into a Big Chest
  local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #bigChests > 0 then
    return
  end

  -- Prevent dying animation softlocks
  if hearts + soulHearts + boneHearts == 0 then
    return
  end

  if gameFrameCount % 150 == 0 then -- 5 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_BEAN, false, false, false, false) -- 351
  end
end

-- Pretty Baby
PostUpdateBabies.functions[158] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false) -- 123
    g.sfx:Stop(SoundEffect.SOUND_SATAN_GROW) -- 241
  end
end

-- Digital Baby
PostUpdateBabies.functions[162] = function()
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()

  if not g.run.babyBool and
     roomFrameCount <= 1 then

    g.run.babyBool = true

    -- This baby grants SeedEffect.SEED_OLD_TV (8)
    -- However, applying this in the MC_POST_NEW_LEVEL callback can cause game crashes
    -- Instead, we manually apply it in the MC_POST_UPDATE callback
    g.seeds:AddSeedEffect(SeedEffect.SEED_OLD_TV) -- 8
  end
end

-- Helmet Baby
PostUpdateBabies.functions[163] = function()
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
  if not g.run.babyBool and
     not leftPressed and
     not rightPressed and
     not upPressed and
     not downPressed then

    -- They stopped moving
    g.run.babyBool = true
    local color = g.p:GetColor()
    local fadeAmount = 0.5
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    g.p:SetColor(newColor, 0, 0, true, true)

  elseif g.run.babyBool and
         (leftPressed or
          rightPressed or
          upPressed or
          downPressed) then

    -- They started moving
    g.run.babyBool = false
    local color = g.p:GetColor()
    local fadeAmount = 1
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    g.p:SetColor(newColor, 0, 0, true, true)
  end
end

-- Black Eye Baby
PostUpdateBabies.functions[164] = function()
  -- Starts with Leprosy, +5 damage on Leprosy breaking
  local leprocyChunks = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.LEPROCY, -1, false, false) -- 3.121
  if #leprocyChunks < g.run.babyCounters then
    g.run.babyCounters = g.run.babyCounters - 1

    -- We use the "babyFrame" variable to track how many damage ups we have recieved
    g.run.babyFrame = g.run.babyFrame + 1
    g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    g.p:EvaluateItems()
  end
end

-- Worry Baby
PostUpdateBabies.functions[167] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyFrame ~= 0 and
     gameFrameCount >= g.run.babyFrame then

    g.run.babyFrame = 0
  end

  -- Touching pickups causes teleportation (1/2)
  if not g.p:IsItemQueueEmpty() then
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT, false, false, false, false) -- 44
  end
end

-- Gappy Baby
PostUpdateBabies.functions[171] = function()
  -- Broken machines drop pedestal items
  -- (there is no MC_POST_SLOT_UPDATE callback so we have to do this here)
  local slots = Isaac.FindByType(EntityType.ENTITY_SLOT, -1, -1, false, false) -- 6
  for _, slot in ipairs(slots) do
    local sprite = slot:GetSprite()
    local data = slot:GetData()
    if data.destroyed == nil and
       (sprite:IsPlaying("Broken") or -- Normal machines
        sprite:IsPlaying("Death")) then -- Restock machines

      data.destroyed = true
      g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
      g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                slot.Position, g.zeroVector, nil, 0, g.run.randomSeed)
    end
  end
end

-- Skull Baby
PostUpdateBabies.functions[211] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Shockwave bombs
  for i = 1, #g.run.babyTears do
    local tear = g.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    if (gameFrameCount - tear.frame) % 2 == 0 then
      local explosion = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, -- 1000.62
                                  tear.position, g.zeroVector, g.p, 0, 0)
      local index = g.r:GetGridIndex(tear.position)
      g.r:DestroyGrid(index)
      tear.position = tear.position + tear.velocity
      g.sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1) -- 137
      -- (if the sound effect plays at full volume, it starts to get annoying)

      -- Make the shockwave deal damage to the player
      if tear.position:Distance(g.p.Position) <= 40 then
        g.p:TakeDamage(1, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
      end

      -- Make the shockwave deal damage to NPCs
      local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY) -- 1 << 3
      for _, entity in ipairs(entities) do
        local damageAmount = g.p.Damage * 1.5
        entity:TakeDamage(damageAmount, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
       end
     end

     -- Stop if it gets to a wall
     if not g.r:IsPositionInRoom(tear.position, 0) then
       table.remove(g.run.babyTears, i)
     end
  end
end

-- Fancy Baby
PostUpdateBabies.functions[216] = function()
  -- Local variables
  local rooms = g.l:GetRooms()

  local teleport = 0
  local item = g.p.QueuedItem.Item
  if item ~= nil then
    local itemID = item.ID
    if itemID == CollectibleType.COLLECTIBLE_SHOP_TELEPORT then
      teleport = RoomType.ROOM_SHOP -- 2
    elseif itemID == CollectibleType.COLLECTIBLE_TREASURE_ROOM_TELEPORT then
      teleport = RoomType.ROOM_TREASURE -- 4
    elseif itemID == CollectibleType.COLLECTIBLE_MINIBOSS_ROOM_TELEPORT then
      teleport = RoomType.ROOM_MINIBOSS -- 6
    elseif itemID == CollectibleType.COLLECTIBLE_ARCADE_TELEPORT then
      teleport = RoomType.ROOM_ARCADE -- 9
    elseif itemID == CollectibleType.COLLECTIBLE_CURSE_ROOM_TELEPORT then
      teleport = RoomType.ROOM_CURSE -- 10
    elseif itemID == CollectibleType.COLLECTIBLE_CHALLENGE_ROOM_TELEPORT then
      teleport = RoomType.ROOM_CHALLENGE -- 11
    elseif itemID == CollectibleType.COLLECTIBLE_LIBRARY_TELEPORT then
      teleport = RoomType.ROOM_LIBRARY -- 12
    elseif itemID == CollectibleType.COLLECTIBLE_SACRIFICE_ROOM_TELEPORT then
      teleport = RoomType.ROOM_SACRIFICE -- 13
    elseif itemID == CollectibleType.COLLECTIBLE_BEDROOM_CLEAN_TELEPORT then
      teleport = RoomType.ROOM_ISAACS -- 18
    elseif itemID == CollectibleType.COLLECTIBLE_BEDROOM_DIRTY_TELEPORT then
      teleport = RoomType.ROOM_BARREN -- 19
    elseif itemID == CollectibleType.COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT then
      teleport = RoomType.ROOM_CHEST -- 20
    elseif itemID == CollectibleType.COLLECTIBLE_DICE_ROOM_TELEPORT then
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
        g.l.LeaveDoor = -1 -- You have to set this before every teleport or else it will send you to the wrong room
        g.g:StartRoomTransition(index, Direction.NO_DIRECTION, RoomTransition.TRANSITION_TELEPORT) -- -1, 3
        break
      end
    end
  end
end

-- Drool Baby
PostUpdateBabies.functions[221] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local roomClear = g.r:IsClear()

  -- Starts with Monstro's Tooth (improved)
  if g.run.babyFrame ~= 0 and
     gameFrameCount >= g.run.babyFrame then

    if roomClear then
      -- The room might have been cleared since the initial Monstro's Tooth activation
      -- If so, cancel the remaining Monstro's
      g.run.babyCounters = 0
      g.run.babyFrame = 0
    else
      g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false) -- 86
    end
  end
end

-- Bawl Baby
PostUpdateBabies.functions[231] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local hearts = g.p:GetHearts()
  local soulHearts = g.p:GetSoulHearts()
  local boneHearts = g.p:GetBoneHearts()

  -- Prevent softlocks that occur if you try to jump into a Big Chest
  local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #bigChests > 0 then
    return
  end

  -- Prevent dying animation softlocks
  if hearts + soulHearts + boneHearts == 0 then
    return
  end

  -- Constant Isaac's Tears effect + blindfolded
  if gameFrameCount % 3 == 0 then
    g.run.babyBool = true
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false) -- 323
    g.run.babyBool = false
  end
end

-- Medusa Baby
PostUpdateBabies.functions[250] = function()
  -- Local variables
  local bombs = g.p:GetNumBombs()
  local keys = g.p:GetNumKeys()

  -- Coins convert to bombs and keys
  if bombs == 0 and
     g.p:GetNumCoins() > 0 then

    g.p:AddCoins(-1)
    g.p:AddBombs(1)
  end
  if keys == 0 and
     g.p:GetNumCoins() > 0 then

    g.p:AddCoins(-1)
    g.p:AddKeys(1)
  end
end

-- Cloud Baby
PostUpdateBabies.functions[256] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local baby = g.babies[256]

  if gameFrameCount % baby.num == 0 then
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, false, false, false, false) -- 396
  end
end

-- Raccoon Baby
PostUpdateBabies.functions[263] = function()
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()

  -- Reroll all of the rocks in the room
  -- (this does not work if we do it in the MC_POST_NEW_ROOM callback or on the 0th frame)
  if roomFrameCount == 1 and
     g.r:IsFirstVisit() then

    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D12, false, false, false, false) -- 386
  end
end

-- Hare Baby
PostUpdateBabies.functions[267] = function()
  local playerSprite = g.p:GetSprite()

  -- Takes damage when standing still
  -- Prevent the (vanilla) bug where the player will take damage upon jumping into a trapdoor
  if not g.p:HasInvincibility() and
     (playerSprite:IsPlaying("Trapdoor") or
      playerSprite:IsPlaying("Trapdoor2") or
      playerSprite:IsPlaying("Jump") or
      playerSprite:IsPlaying("LightTravel")) then

    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    g.sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) -- 55
  end
end

-- Porcupine Baby
PostUpdateBabies.functions[270] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_WAIT_WHAT, false, false, false, false) -- 484
  end
end

-- Heart Baby
PostUpdateBabies.functions[290] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    g.sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) -- 55
  end
end

-- Rider Baby
PostUpdateBabies.functions[295] = function()
  -- Local variables
  local activeItem = g.p:GetActiveItem()

  -- Keep the pony fully charged
  if activeItem == CollectibleType.COLLECTIBLE_PONY and -- 130
     g.p:NeedsCharge() then

    g.p:FullCharge()
    g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Pizza Baby
PostUpdateBabies.functions[303] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyFrame ~= 0 and
     gameFrameCount >= g.run.babyFrame then

    g.run.babyCounters = g.run.babyCounters + 1
    g.run.babyFrame = gameFrameCount + g.babies[303].delay
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BROWN_NUGGET, false, false, false, false) -- 504
    if g.run.babyCounters == 19 then -- One is already spawned with the initial trigger
      g.run.babyCounters = 0
      g.run.babyFrame = 0
    end
  end
end

-- Hotdog Baby
PostUpdateBabies.functions[304] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local hearts = g.p:GetHearts()
  local soulHearts = g.p:GetSoulHearts()
  local boneHearts = g.p:GetBoneHearts()

  -- Prevent softlocks that occur if you try to jump into a Big Chest
  local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #bigChests > 0 then
    return
  end

  -- Prevent dying animation softlocks
  if hearts + soulHearts + boneHearts == 0 then
    return
  end

  -- Constant The Bean effect + flight + explosion immunity + blindfolded
  if gameFrameCount % 3 == 0 then
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111
  end
end

-- Corrupted Baby
PostUpdateBabies.functions[307] = function()
  -- Taking items/pickups causes damage (1/2)
  if not g.p:IsItemQueueEmpty() then
    g.p:TakeDamage(1, 0, EntityRef(g.p), 0)
  end
end

-- Exploding Baby
PostUpdateBabies.functions[320] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Check to see if we need to reset the cooldown
  -- (after we used the Kamikaze! effect upon touching an obstacle)
  if g.run.babyFrame ~= 0 and
     gameFrameCount >= g.run.babyFrame then

    g.run.babyFrame = 0
  end
end

-- Butterfly Baby 2
PostUpdateBabies.functions[332] = function()
  -- Flight + can walk through walls
  g.p.GridCollisionClass = GridCollisionClass.COLLISION_NONE -- 0
end

-- Hero Baby
PostUpdateBabies.functions[336] = function()
  if g.run.babyBool then
    g.run.babyBool = false
    g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    g.p:EvaluateItems()
  end
end

-- Vomit Baby
PostUpdateBabies.functions[341] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Moving when the timer reaches 0 causes damage
  local remainingTime = g.run.babyCounters - gameFrameCount
  if remainingTime <= 0 then
    g.run.babyCounters = gameFrameCount + g.babies[341].time -- Reset the timer


    local cutoff = 0.2
    if g.p.Velocity.X > cutoff or
       g.p.Velocity.X < cutoff * -1 or
       g.p.Velocity.Y > cutoff or
       g.p.Velocity.Y < cutoff * -1 then

      g.p:TakeDamage(1, 0, EntityRef(g.p), 0)
    end
  end
end

-- Fourtone Baby
PostUpdateBabies.functions[348] = function()
  -- Local variables
  local activeItem = g.p:GetActiveItem()

  -- Keep the Candle always fully charged
  if activeItem == CollectibleType.COLLECTIBLE_CANDLE and -- 164
     g.p:NeedsCharge() then

    g.p:FullCharge()
    g.sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Grayscale Baby
PostUpdateBabies.functions[349] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 300 == 0 then -- 10 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_DELIRIOUS, false, false, false, false) -- 510
    PostRender:SetPlayerSprite()
  end
end

-- Rabbit Baby
PostUpdateBabies.functions[350] = function()
  -- Starts with How to Jump; must jump often
  g.p:AddCacheFlags(CacheFlag.CACHE_SPEED) -- 16
  g.p:EvaluateItems()
end

-- Mouse Baby
PostUpdateBabies.functions[351] = function()
  PseudoRoomClear:PostUpdate()
end

-- Pink Princess Baby
PostUpdateBabies.functions[374] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 120 == 0 then -- 4 second
    -- Spawn a random stomp
    g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.MOM_FOOT_STOMP, -- 1000.29
              Isaac.GetRandomPosition(), g.zeroVector, nil, 0, 0)
  end
end

-- Blue Pig Baby
PostUpdateBabies.functions[382] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a Mega Troll Bomb (4.5)
    g.g:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, g.p.Position, g.zeroVector, nil, 0, 0)
  end
end

-- Imp Baby
PostUpdateBabies.functions[386] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local baby = g.babies[386]

  -- If we rotate the knives on every frame, then it spins too fast
  if gameFrameCount < g.run.babyFrame then
    return
  end

  g.run.babyFrame = g.run.babyFrame + baby.num

  -- Rotate through the four directions
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters >= 8 then
    g.run.babyCounters = 4
  end
end

-- Blue Wrestler Baby
PostUpdateBabies.functions[388] = function()
  -- Enemies spawn projectiles upon death
  for i = 1, #g.run.babyTears do
    local tear = g.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    local velocity = g.p.Position - tear.position
    velocity = velocity:Normalized() * 12
    g.g:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, -- 9.0
              tear.position, velocity, nil, 0, 0)
    tear.num = tear.num - 1
    if tear.num == 0 then
      -- The dead enemy has shot all of its tears, so we remove the tracking element for it
      table.remove(g.run.babyTears, i)
    end
  end
end

-- Plague Baby
PostUpdateBabies.functions[396] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 5 == 0 then -- Every 5 frames
    -- Drip green creep
    local creep = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_GREEN, -- 53
                            g.p.Position, g.zeroVector, g.p, 0, 0)
    creep:ToEffect().Timeout = 240
  end
end

-- Corgi Baby
PostUpdateBabies.functions[401] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 45 == 0 then -- 1.5 seconds
    -- Spawn a Fly (13.0)
    g.g:Spawn(EntityType.ENTITY_FLY, 0, g.p.Position, g.zeroVector, nil, 0, 0)
  end
end

-- Magic Cat Baby
PostUpdateBabies.functions[428] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 second
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_KIDNEY_BEAN, false, false, false, false) -- 421
  end
end

-- Mutated Fish Baby
PostUpdateBabies.functions[449] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 210 == 0 then -- 7 seconds
    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516
  end
end

-- Voxdog Baby
PostUpdateBabies.functions[462] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Shockwave tears
  for i = 1, #g.run.babyTears do
    local tear = g.run.babyTears[i]
    if tear == nil then
      -- We might move past the final element if we removed one or more things from the table
      break
    end
    if (gameFrameCount - tear.frame) % 2 == 0 then
      local explosion = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.ROCK_EXPLOSION, -- 1000.62
                                  tear.position, g.zeroVector, g.p, 0, 0)
      local index = g.r:GetGridIndex(tear.position)
      g.r:DestroyGrid(index)
      tear.position = tear.position + tear.velocity
      g.sfx:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 0.5, 0, false, 1) -- 137
      -- (if the sound effect plays at full volume, it starts to get annoying)

      -- Make the shockwave deal damage to NPCs
      local entities = Isaac.FindInRadius(tear.position, 40, EntityPartition.ENEMY) -- 1 << 3
      for j = 1, #entities do
        local damage = g.p.Damage * 1.5
        entities[j]:TakeDamage(damage, DamageFlag.DAMAGE_EXPLOSION, EntityRef(explosion), 2)
       end
     end

     -- Stop if it gets to a wall
     if not g.r:IsPositionInRoom(tear.position, 0) then
       table.remove(g.run.babyTears, i)
     end
  end
end

-- Scoreboard Baby
PostUpdateBabies.functions[474] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyCounters ~= 0 then
    local remainingTime = g.run.babyCounters - gameFrameCount
    if remainingTime <= 0 then
      g.run.babyCounters = 0
      g.p:Kill()
    end
  end
end

-- Cool Orange Baby
PostUpdateBabies.functions[485] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 second
    -- Spawn a random rocket target
    local target = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.FETUS_BOSS_TARGET, -- 1000
                             Isaac.GetRandomPosition(), g.zeroVector, nil, 0, 0)
    local sprite = target:GetSprite()
    sprite:Play("Blink", true)
    -- Target and rocket behavior are handled in the MC_POST_EFFECT_UPDATE callback
  end
end

-- Mern Baby
PostUpdateBabies.functions[500] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  if g.run.babyTears.frame ~= 0 and
     gameFrameCount >= g.run.babyTears.frame then

    g.run.babyTears.frame = 0
    g.p:FireTear(g.p.Position, g.run.babyTears.velocity, false, true, false)
  end
end

-- Sausage Lover Baby
PostUpdateBabies.functions[508] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local roomClear = g.r:IsClear()

  if gameFrameCount % 150 == 0 and -- 5 seconds
     not roomClear then -- Monstro is unavoidable if he targets you

    g.p:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false) -- 86
  end
end

-- Baggy Cap Baby
PostUpdateBabies.functions[519] = function()
  -- Local variables
  local roomClear = g.r:IsClear()

  -- Check all of the doors
  if roomClear then
    return
  end

  -- Check to see if a door opened before the room was clear
  for i = 0, 7 do
    local door = g.r:GetDoor(i)
    if door ~= nil and
       door:IsOpen() then

      door:Close(true)
    end
  end
end

-- Twitchy Baby
PostUpdateBabies.functions[511] = function()
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local baby = g.babies[511]

  if gameFrameCount >= g.run.babyFrame then
    g.run.babyFrame = g.run.babyFrame + baby.num
    if g.run.babyBool then
      -- Tear rate is increasing
      g.run.babyCounters = g.run.babyCounters + 1
      if g.run.babyCounters == baby.max then
        g.run.babyBool = false
      end
    else
      -- Tear rate is decreasing
      g.run.babyCounters = g.run.babyCounters - 1
      if g.run.babyCounters == baby.min then
        g.run.babyBool = true
      end
    end

    g.p:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    g.p:EvaluateItems()
  end
end

-- Invisible Baby
PostUpdateBabies.functions[541] = function()
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()

  if roomFrameCount == 1 then
    -- The sprite is a blank PNG, but we also want to remove the shadow
    -- Doing this in the MC_POST_NEW_ROOM callback (or on frame 0) won't work
    g.p.Visible = false
  end
end

return PostUpdateBabies
