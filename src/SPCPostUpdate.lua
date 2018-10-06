local SPCPostUpdate  = {}

-- Includes
local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_UPDATE (1)
function SPCPostUpdate:Main()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Reapply the co-op baby sprite after every pedestal item recieved
  -- (and keep track of our passive items over the course of the run)
  if player:IsItemQueueEmpty() == false and
     SPCGlobals.run.queuedItems == false then

    SPCGlobals.run.queuedItems = true
    if player.QueuedItem.Item.Type == ItemType.ITEM_PASSIVE then -- 1
      SPCGlobals.run.passiveItems[#SPCGlobals.run.passiveItems + 1] = player.QueuedItem.Item.ID
      Isaac.DebugString("Added passive item " .. tostring(player.QueuedItem.Item.ID) ..
                        " (total items: " .. #SPCGlobals.run.passiveItems .. ")")
    end

  elseif player:IsItemQueueEmpty() and
         SPCGlobals.run.queuedItems then

    SPCGlobals.run.queuedItems = false
    SPCPostRender:SetPlayerSprite()
  end

  -- Check to see if this is a trinket baby and they dropped the trinket
  SPCPostUpdate:CheckTrinket()

  -- Certain babies do things if the room is cleared
  SPCPostUpdate:CheckRoomCleared()

  -- Do custom baby effects
  SPCPostUpdate:DoBabyEffects()

  -- Check grid entities
  SPCPostUpdate:CheckGridEntities()

  -- Check normal entities
  SPCPostUpdate:CheckEntities()
end

-- Check to see if this is a trinket baby and they dropped the trinket
function SPCPostUpdate:CheckTrinket()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Check to see if we are on baby that is supposed to have a permanent trinket
  local trinket = baby.trinket
  if trinket == nil then
    return
  end

  -- Check to see if we dropped the trinket
  if player:HasTrinket(trinket) then
    return
  end

  -- Give it back
  local pos = room:FindFreePickupSpawnPosition(player.Position, 1, true)
  player:DropTrinket(pos, true)
  player:AddTrinket(trinket)
  Isaac.DebugString("Dropped trinket detected; manually giving it back.")

  -- Delete the dropped trinket
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    if entity.Type == EntityType.ENTITY_PICKUP and -- 5
       entity.Variant == PickupVariant.PICKUP_TRINKET and -- 350
       entity.SubType == trinket then

      entity:Remove()
    end
  end
end

-- Certain babies do things if the room is cleared
function SPCPostUpdate:CheckRoomCleared()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Check the clear status of the room and compare it to what it was a frame ago
  if roomClear == SPCGlobals.run.roomClear then
    return
  end

  SPCGlobals.run.roomClear = roomClear

  if roomClear == false then
    return
  end

  SPCPostUpdate:RoomCleared()
end

function SPCPostUpdate:RoomCleared()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomSeed = room:GetSpawnSeed() -- Gets a reproducible seed based on the room, something like "2496979501"
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  local zeroVelocity = Vector(0, 0)

  Isaac.DebugString("Room cleared.")

  if baby.name == "Love Baby" then
    -- Random Heart - 5.10.0
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, zeroVelocity, player, 0, roomSeed)
  end
end

function SPCPostUpdate:DoBabyEffects()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local activeItem = player:GetActiveItem()
  local pill1 = player:GetPill(0)
  local pill2 = player:GetPill(1)
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Troll Baby" and -- 6
     gameFrameCount % 90 == 0 then -- 3 seconds

    -- Spawn a Troll Bomb (4.3)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, player.Position, Vector(0, 0), nil, 0, 0)

  elseif baby.name == "Wrath Baby" and -- 19
         gameFrameCount % 210 == 0 then -- 7 seconds

    player:UseActiveItem(CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, false, false, false, false) -- 65

  elseif baby.name == "Wrapped Baby" and -- 20
         gameFrameCount % 3 == 0 and -- If the explosions happen too fast, it looks buggy
         SPCGlobals.run.wrappedBabyKami > 0 then

    -- This should not cause any damage since the player will have invulnerability frames
    SPCGlobals.run.wrappedBabyKami = SPCGlobals.run.wrappedBabyKami - 1
    player:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40

  elseif baby.name == "Butthole Baby" and -- 63
         gameFrameCount % 150 == 0 then -- 5 seconds

    -- Spawn a random poop
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    math.randomseed(SPCGlobals.run.randomSeed)
    local poopVariant = math.random(0, 6)
    if poopVariant == 1 or -- Red Poop
       poopVariant == 2 then -- Corn Poop

      -- If the poop is this type, then it will instantly damage the player, so give them some invulnerability frames
      SPCGlobals.run.invulnerabilityFrame = gameFrameCount + 25
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, player.Position, false) -- 14

    -- Playing ID 37 will randomly play one of the three farting sound effects
    sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37

  elseif baby.name == "Eyemouth Baby" and -- 111
         SPCGlobals.run.eyemouthBaby.frame ~= 0 and
         gameFrameCount >= SPCGlobals.run.eyemouthBaby.frame then

    SPCGlobals.run.eyemouthBaby.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.eyemouthBaby.velocity, false, true, false)

  elseif baby.name == "Bawl Baby" and -- 231
         gameFrameCount % 3 == 0 then

    player:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false) -- 323

  elseif baby.name == "Rider Baby" and -- 295
         activeItem == CollectibleType.COLLECTIBLE_PONY and -- 130
         player:NeedsCharge() then

    -- Keep the pony always fully charged
    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170

  elseif baby.name == "Hotdog Baby" and -- 304
         gameFrameCount % 3 == 0 then

    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111

  elseif baby.name == "Hero Baby" and -- 304
         SPCGlobals.run.heroBabyEval then

    SPCGlobals.run.heroBabyEval = false
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()

  elseif baby.name == "Corrupted Baby" then -- 307
    -- Taking items/pickups causes damage (1/2)
    if player:IsItemQueueEmpty() == false then
      player:TakeDamage(1, 0, EntityRef(player), 0)
    end

  elseif baby.name == "Exploding Baby" and -- 320
         SPCGlobals.run.explodingBabyFrame ~= 0 and
         gameFrameCount >= SPCGlobals.run.explodingBabyFrame then

    SPCGlobals.run.explodingBabyFrame = 0

  elseif baby.name == "Vomit Baby" then -- 341
    -- Moving when the timer reaches 0 causes damage
    local remainingTime = SPCGlobals.run.vomitBabyTimer - gameFrameCount
    if remainingTime <= 0 then
      SPCGlobals.run.vomitBabyTimer = gameFrameCount + baby.time -- Reset the timer

      if player.Velocity.X > 0.2 or
         player.Velocity.X < -0.2 or
         player.Velocity.Y > 0.2 or
         player.Velocity.Y < -0.2 then

        player:TakeDamage(1, 0, EntityRef(player), 0)
      end
    end

  elseif baby.name == "Fourtone Baby" and -- 348
         activeItem == CollectibleType.COLLECTIBLE_CANDLE and -- 164
         player:NeedsCharge() then

    -- Keep the Candle always fully charged
    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170

  elseif baby.name == "Blue Pig Baby" and -- 382
         gameFrameCount % 150 == 0 then -- 5 seconds

    -- Spawn a Mega Troll Bomb (4.5)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, player.Position, Vector(0, 0), nil, 0, 0)

  elseif baby.name == "Red Wrestler Baby" then -- 389
    if pill1 ~= PillColor.PILL_NULL or -- 0
       pill2 ~= PillColor.PILL_NULL then -- 0

      SPCGlobals.run.redWresterBabyUse = true
    end

  elseif baby.name == "Plague Baby" and -- 396
         gameFrameCount % 5 == 0 then -- Every 5 frames

    -- Drip green creep
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_GREEN, -- 53
                               player.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Timeout = 240

  elseif baby.name == "Corgi Baby" and -- 401
         gameFrameCount % 45 == 0 then -- 1.5 seconds

    -- Spawn a Fly (13.0)
    game:Spawn(EntityType.ENTITY_FLY, 0, player.Position, Vector(0, 0), nil, 0, 0)

  elseif baby.name == "Driver Baby" then -- 431
    -- Drip slippery brown creep (but hide it)
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.CREEP_SLIPPERY_BROWN, -- 94
                               player.Position, Vector(0, 0), player, 0, 0)
    creep.Visible = false

  elseif baby.name == "Mern Baby" and -- 500
         SPCGlobals.run.mernBaby.frame ~= 0 and
         gameFrameCount >= SPCGlobals.run.mernBaby.frame then

    SPCGlobals.run.mernBaby.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.mernBaby.velocity, false, true, false)

  elseif baby.name == "Baggy Cap Baby" then -- 519
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

  elseif baby.name == "Twitchy Baby" then -- 511
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()

  elseif baby.name == "Little Steven" and -- 526
         SPCGlobals.run.littleStevenTimer ~= 0 then

    local remainingTime = SPCGlobals.run.littleStevenTimer - gameFrameCount
    if remainingTime <= 0 then
      SPCGlobals.run.littleStevenTimer = 0
      player:Kill()
    end
  end
end

function SPCPostUpdate:CheckGridEntities()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local gridSize = room:GetGridSize()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  for i = 1, gridSize do
    local gridEntity = room:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if baby.name == "Blockhead Baby" and -- 71
         saveState.Type == GridEntityType.GRID_ROCKB and -- 3
         SPCGlobals:InsideSquare(player.Position, gridEntity.Position, 36) then

        gridEntity.Sprite = Sprite() -- If we don't do this, it will still show for a frame
        room:RemoveGridEntity(i, 0, false) -- gridEntity:Destroy() does not work
        sfx:Play(SoundEffect.SOUND_POT_BREAK, 1, 0, false, 1) -- 138

      elseif baby.name == "Exploding Baby" and -- 320
             SPCGlobals.run.explodingBabyFrame == 0 and
             ((saveState.Type == GridEntityType.GRID_ROCK and saveState.State == 1) or -- 2
              (saveState.Type == GridEntityType.GRID_ROCKT and saveState.State == 1) or-- 4
              (saveState.Type == GridEntityType.GRID_ROCK_BOMB and saveState.State == 1) or -- 5
              (saveState.Type == GridEntityType.GRID_ROCK_ALT and saveState.State == 1) or -- 6
              (saveState.Type == GridEntityType.GRID_SPIDERWEB and saveState.State == 0) or -- 10
              (saveState.Type == GridEntityType.GRID_TNT and saveState.State ~= 4) or -- 12
              (saveState.Type == GridEntityType.GRID_POOP and saveState.State ~= 4) or -- 14
              (saveState.Type == GridEntityType.GRID_ROCK_SS and saveState.State ~= 3)) and -- 22
             SPCGlobals:InsideSquare(player.Position, gridEntity.Position, 36) then

        SPCGlobals.run.invulnerable = true
        Isaac.DebugString("state: " .. tostring(saveState.State) .. ", vardata: " .. tostring(saveState.VarData))
        player:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
        SPCGlobals.run.invulnerable = false
        SPCGlobals.run.explodingBabyFrame = gameFrameCount + 10
      end
    end
  end
end

function SPCPostUpdate:CheckEntities()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  local babiesThatRequireChecking = {
    "No Arms Baby", -- 140
    "Lantern Baby", -- 292
    "Froggy Baby", -- 363
    "Dino Baby", -- 376
    "Magiccat Baby", -- 428
  }
  local check = false
  for i = 1, #babiesThatRequireChecking do
    if baby.name == babiesThatRequireChecking[i] then
      check = true
      break
    end
  end
  if check == false then
    return
  end

  for i, entity in pairs(Isaac.GetRoomEntities()) do
    if baby.name == "No Arms Baby" and -- 140
       entity.Type == EntityType.ENTITY_PICKUP and -- 5
       entity.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
       entity.Variant ~= PickupVariant.PICKUP_SHOPITEM and -- 150
       entity.Variant ~= PickupVariant.PICKUP_BIGCHEST and -- 340
       entity.Variant ~= PickupVariant.PICKUP_TROPHY and -- 370
       entity.Variant ~= PickupVariant.PICKUP_BED then -- 380

      -- Make it impossible for the player to pick up this pickup
      if entity.EntityCollisionClass ~= 0 then
        entity.EntityCollisionClass = 0
      end
      if SPCGlobals:InsideSquare(player.Position, entity.Position, 25) then
        local x = entity.Position.X - player.Position.X
        local y = entity.Position.Y - player.Position.Y
        entity.Velocity = Vector(x / 2, y / 2)
      end

    elseif baby.name == "Lantern Baby" and -- 292
           entity.Type == EntityType.ENTITY_TEAR and -- 2
           entity.Parent ~= nil and
           entity.Parent.Type == EntityType.ENTITY_PLAYER then -- 1

      -- Emulate having a Godhead aura
      local pos = Vector(player.Position.X, player.Position.Y + 10)
      entity.Position = pos

      -- Clear the sprite for the Ludo tear
      entity:GetSprite():Reset()

    elseif baby.name == "Froggy Baby" and -- 363
           entity:IsDead() == false and
           SPCGlobals:IsFly(entity) and
           SPCGlobals:InsideSquare(player.Position, entity.Position, 36) then

      entity:Kill()

    elseif baby.name == "Dino Baby" and -- 376
           entity.Type == EntityType.ENTITY_FAMILIAR and -- 3
           entity.Variant == FamiliarVariant.BOBS_BRAIN and -- 59
           entity.SubType == 1 then -- It has a SubType of 1 after it explodes

      entity:Remove()

    elseif baby.name == "Magiccat Baby" and -- 428
           entity:ToNPC() ~= nil and
           entity:ToNPC():IsVulnerableEnemy() and -- Returns true for enemies that can be damaged
           SPCGlobals:InsideSquare(entity.Position, player.Position, 100) then

      entity:AddCharmed(150) -- 5 seconds
    end
  end
end

return SPCPostUpdate
