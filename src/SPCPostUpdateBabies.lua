local SPCPostUpdateBabies = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- The collection of functions for each baby effect
SPCPostUpdateBabies.functions = {}

function SPCPostUpdateBabies:Main()
  -- Local variables
  local type = SPCGlobals.run.babyType
  if SPCPostUpdateBabies.functions[type] ~= nil then
    SPCPostUpdateBabies.functions[type]()
  end
end

SPCPostUpdateBabies.functions[6] = function() -- Troll Baby
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 90 == 0 then -- 3 seconds
    -- Spawn a Troll Bomb (4.3)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, player.Position, Vector(0, 0), nil, 0, 0)
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

-- Bound Baby
SPCPostUpdateBabies.functions[58] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS, false, false, false, false) -- 357
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
    if poopVariant == 1 or -- Red Poop
       poopVariant == 2 then -- Corn Poop

      -- If the poop is this type, then it will instantly damage the player, so give them some invulnerability frames
      SPCGlobals.run.invulnerabilityFrame = gameFrameCount + 25
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, player.Position, false) -- 14

    -- Playing ID 37 will randomly play one of the three farting sound effects
    sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37
  end
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

-- Eyemouth Baby
SPCPostUpdateBabies.functions[111] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTearInfo.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTearInfo.frame then

    SPCGlobals.run.babyTearInfo.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTearInfo.velocity, false, true, false)
  end
end

-- Rotten Meat Baby
SPCPostUpdateBabies.functions[139] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BUTTER_BEAN, false, false, false, false) -- 294
  end
end

-- No Arms Baby
SPCPostUpdateBabies.functions[140] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  local entities = Isaac.FindByType(EntityType.ENTITY_PICKUP, -1, -1, false, false) -- 5
  for i = 1, #entities do
    local entity = entities[i]
    if entity.Variant ~= PickupVariant.PICKUP_COLLECTIBLE and -- 100
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
    end
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

-- Bawl Baby
SPCPostUpdateBabies.functions[231] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false) -- 323
  end
end

-- Cloud Baby
SPCPostUpdateBabies.functions[256] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 600 == 0 then -- 20 seconds
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

-- Lantern Baby
SPCPostUpdateBabies.functions[292] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  local entities = Isaac.FindByType(EntityType.ENTITY_TEAR, -1, -1, false, false) -- 2
  for i = 1, #entities do
    local entity = entities[i]
    if entity.Type == EntityType.ENTITY_TEAR and -- 2
       entity.Parent ~= nil and
       entity.Parent.Type == EntityType.ENTITY_PLAYER then -- 1

      -- Emulate having a Godhead aura
      local pos = Vector(player.Position.X, player.Position.Y + 10)
      entity.Position = pos

      -- Clear the sprite for the Ludo tear
      entity:GetSprite():Reset()
      break
    end
  end
end

-- Rider Baby
SPCPostUpdateBabies.functions[295] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local sfx = SFXManager()

  if activeItem == CollectibleType.COLLECTIBLE_PONY and -- 130
     player:NeedsCharge() then

    -- Keep the pony fully charged
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

    if player.Velocity.X > 0.2 or
       player.Velocity.X < -0.2 or
       player.Velocity.Y > 0.2 or
       player.Velocity.Y < -0.2 then

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

  if activeItem == CollectibleType.COLLECTIBLE_CANDLE and -- 164
     player:NeedsCharge() then

    -- Keep the Candle always fully charged
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
  end
end

-- Froggy Baby
SPCPostUpdateBabies.functions[363] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Kill flies on touch
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    if entity:IsDead() == false and
       SPCMisc:IsFly(entity) and
       SPCGlobals:InsideSquare(player.Position, entity.Position, 37) then

      entity:Kill()
    end
  end
end

-- Dino Baby
SPCPostUpdateBabies.functions[376] = function()
  local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, 1, false, false) -- 3.59
  for i = 1, #entities do
    -- Bob's Brain familiars have a SubType of 1 after they explodes
    local entity = entities[i]
    entity:Remove()
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

-- Red Wrestler Baby
SPCPostUpdateBabies.functions[389] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local pill1 = player:GetPill(0)
  local pill2 = player:GetPill(1)

  if pill1 ~= PillColor.PILL_NULL or -- 0
     pill2 ~= PillColor.PILL_NULL then -- 0

    SPCGlobals.run.babyBool = true
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

-- Magiccat Baby
SPCPostUpdateBabies.functions[428] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Charm close enemies
  local entities = Isaac.FindInRadius(player.Position, 100, EntityPartition.ENEMY) -- 1 << 3
  for i = 1, #entities do
    local entity = entities[i]
    if entity:ToNPC() ~= nil and
       entity:ToNPC():IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      entity:AddCharmed(150) -- 5 seconds
    end
  end
end

-- Driver Baby
SPCPostUpdateBabies.functions[431] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Drip slippery brown creep (but hide it)
  local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.CREEP_SLIPPERY_BROWN, -- 94
                           player.Position, Vector(0, 0), player, 0, 0)
  creep.Visible = false
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

-- Mern Baby
SPCPostUpdateBabies.functions[500] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTearInfo.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTearInfo.frame then

    SPCGlobals.run.babyTearInfo.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTearInfo.velocity, false, true, false)
  end
end

-- Sausage Lover Baby
SPCPostUpdateBabies.functions[508] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local isClear = room:IsClear()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 and -- 5 seconds
     isClear == false then -- Monstro is unavoidable if he targets you

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

  player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
  player:EvaluateItems()
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
