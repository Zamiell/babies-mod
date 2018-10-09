local SPCEntityTakeDmg = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_ENTITY_TAKE_DMG (11)
-- (this must return nil or false)
function SPCEntityTakeDmg:Main(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  --[[
  Isaac.DebugString("MC_ENTITY_TAKE_DMG - " ..
                    tostring(damageSource.Type) .. "." .. tostring(damageSource.Variant) .. "." ..
                    tostring(damageSource.SubType) .. " --> " ..
                    tostring(tookDamage.Type) .. "." .. tostring(tookDamage.Variant) .. "." ..
                    tostring(tookDamage.SubType))
  --]]

  local player = tookDamage:ToPlayer()
  if player ~= nil then
    return SPCEntityTakeDmg:Player(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
  return SPCEntityTakeDmg:Entity(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
end

function SPCEntityTakeDmg:Player(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Check to see if the player is supposed to be temporarily invulnerable
  if SPCGlobals.run.invulnerabilityFrame ~= 0 and
     SPCGlobals.run.invulnerabilityFrame >= gameFrameCount then

    return false
  end
  if SPCGlobals.run.invulnerable == true then
    return false
  end

  if baby.name == "Host Baby" then -- 9
    for i = 1, 10 do
      player:AddBlueSpider(player.Position)
    end

  elseif baby.name == "Lost Baby" then -- 10
    -- Lost-style health
    player:Kill()

  elseif baby.name == "Glass Baby" then -- 14
    SPCMisc:SpawnRandomPickup(player.Position)

  elseif baby.name == "Bean Baby" then -- 17
    player:UseCard(Card.CARD_FOOL) -- 1

  elseif baby.name == "Wrapped Baby" then -- 20
    -- Use Kamikaze on the next 5 frames
    SPCGlobals.run.babyCounters = 5

  elseif baby.name == "-0- Baby" then -- 24
    -- Invulnerability
    return false

  elseif baby.name == "Cry Baby" then -- 32
    -- Enemies are fully healed on hit
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

        npc.HitPoints = npc.MaxHitPoints
      end
    end

  elseif baby.name == "Yellow Baby" then -- 33
    player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0) -- 26

  elseif baby.name == "Blinding Baby" then -- 46
    -- Sun Card - 5.300.20
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, Vector(0, 0), player, 20, 0)

  elseif baby.name == "Revenge Baby" then -- 50
    -- Random Heart - 5.10.0
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, Vector(0, 0),
               player, 0, SPCGlobals.run.randomSeed)

  elseif baby.name == "Half Head Baby" and -- 98
         SPCGlobals.run.babyBool == false then

    -- Take double damage
    SPCGlobals.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.babyBool = false

  elseif baby.name == "D Baby" then -- 101
    -- Spawns creep on hit (improved)
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, -- 46
                             player.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Scale = 10
    creep:ToEffect().Timeout = 240

  elseif baby.name == "Hopeless Baby" and -- 125
         SPCGlobals.run.babyBool == false then

    -- Keys are hearts
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    SPCGlobals.run.babyBool = false
    player:AddKeys(-1)
    return false

  elseif baby.name == "Freaky Baby" then -- 132
    player:UseActiveItem(CollectibleType.COLLECTIBLE_CONVERTER, false, false, false, false) -- 296

  elseif baby.name == "Mohawk Baby" and -- 138
         SPCGlobals.run.babyBool == false then

    -- Bombs are hearts
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    SPCGlobals.run.babyBool = false
    player:AddBombs(-1)
    return false

  elseif baby.name == "Aban Baby" and -- 177
         SPCGlobals.run.babyBool == false then

    -- Sonic-style health
    local coins = player:GetNumCoins()
    if coins == 0 then
      player:Kill()
    else
      SPCGlobals.run.babyBool = true
      player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
      SPCGlobals.run.babyBool = false
      player:AddCoins(-99)
      for i = 1, coins do
        -- Spawn a Penny (5.20.1)
        local velocity = player.Position - Isaac.GetRandomPosition()
        velocity = velocity:Normalized()
        local modifier = math.random(4, 20)
        velocity = velocity * modifier
        local coin = game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN,
                                player.Position, velocity, player, 1, 0)
        local data = coin:GetData()
        data.recovery = true
      end
      sfx:Play(SoundEffect.SOUND_GOLD_HEART, 1, 0, false, 1) -- 465
    end
    return false

  elseif baby.name == "Small Face Baby" then -- 200
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, false, false, false, false) -- 77

  elseif baby.name == "MeatBoy Baby" then -- 210
    player:UseActiveItem(CollectibleType.COLLECTIBLE_POTATO_PEELER, false, false, false, false) -- 487

  elseif baby.name == "Conjoined Baby" then -- 212
    -- Open all of the doors
    for i = 0, 7 do
      local door = room:GetDoor(i)
      if door ~= nil then
        door:Open(true)
      end
    end

  elseif baby.name == "Beard Baby" then -- 227
    player:UseActiveItem(CollectibleType.COLLECTIBLE_CROOKED_PENNY, false, false, false, false) -- 485

  elseif baby.name == "Gargoyle Baby" then -- 276
    player:UseActiveItem(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS, false, false, false, false) -- 293

  elseif baby.name == "Spiky Demon Baby" then -- 277
    -- Play a custom sound effect if we got hit by a mimic
    for i = 0, 21 do -- There are 21 damage flags
      local bit = (damageFlag & (1 << i)) >> i

      -- Mimic damage tracking
      if i == 20 and bit == 1 then -- DAMAGE_CHEST
        sfx:Play(Isaac.GetSoundIdByName("Laugh"), 0.75, 0, false, 1)
        break
      end
    end

  elseif baby.name == "Big Tongue Baby" then -- 285
    player:UseActiveItem(CollectibleType.COLLECTIBLE_FLUSH, false, false, false, false) -- 291

  elseif baby.name == "Banshee Baby" then -- 293
    player:UseActiveItem(CollectibleType.COLLECTIBLE_CRACK_THE_SKY, false, false, false, false) -- 160

  elseif baby.name == "X Mouth Baby" then -- 308
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MOVING_BOX, false, false, false, false) -- 523

  elseif baby.name == "Starry Eyed Baby" then -- 310
    -- Stars Card (5.300.18)
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, Vector(0, 0), player, 18, 0)

  elseif baby.name == "Puzzle Baby" then -- 315
    player:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false) -- 105

  elseif baby.name == "Fireball Baby" and -- 318
         damageSource.Type == EntityType.ENTITY_FIREPLACE then -- 33

    -- Immunity from fires
    return false

  elseif baby.name == "Tortoise Baby" then -- 330
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    math.randomseed(SPCGlobals.run.randomSeed)
    local avoidChance = math.random(1, 2)
    if avoidChance == 2 then
      return false
    end

  elseif baby.name == "Skinless Baby" and -- 322
         SPCGlobals.run.babyBool == false then

    -- Take double damage
    SPCGlobals.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.babyBool = false

  elseif baby.name == "Hero Baby" then -- 336
    -- We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
    -- so mark to do it later in the PostUpdate callback
    SPCGlobals.run.babyBool = true

  elseif baby.name == "Tanooki Baby" then -- 359
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MR_ME, false, false, false, false) -- 527

  elseif baby.name == "Fiery Baby" then -- 366
    player:ShootRedCandle(Vector(0, 0))

  elseif baby.name == "Dark Elf Baby" then -- 378
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD, false, false, false, false) -- 545

  elseif baby.name == "Fairyman Baby" then -- 385
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()

  elseif baby.name == "Censored Baby" then -- 408
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

        npc:AddConfusion(EntityRef(player), 150, false) -- 5 seconds
      end
    end

  elseif baby.name == "Catsuit Baby" then -- 412
    player:UseActiveItem(CollectibleType.COLLECTIBLE_GUPPYS_PAW, false, false, false, false) -- 133

  elseif baby.name == "Cup Baby" then -- 435
    player:UseCard(Card.CARD_HUMANITY) -- 45
    player:StopExtraAnimation()

  elseif baby.name == "Handsome Mr. Frog Baby" then -- 456
    player:AddBlueFlies(baby.num, player.Position, nil)

  elseif baby.name == "Mufflerscarf Baby" then -- 472
    for i, entity in pairs(Isaac.GetRoomEntities()) do
      local npc = entity:ToNPC()
      if npc ~= nil and
         npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

        npc:AddFreeze(EntityRef(player), 150) -- 5 seconds
      end
    end

  elseif baby.name == "Scoreboard Baby" and -- 474
         SPCGlobals.run.babyCounters == 0 then

    -- Death in 1 minute
    SPCGlobals.run.babyCounters = gameFrameCount + (60 * 30)

  elseif baby.name == "Egg Baby" then -- 488
    -- Random pill effect on hit
    SPCGlobals.run.roomRNG = SPCGlobals:IncrementRNG(SPCGlobals.run.roomRNG)
    math.randomseed(SPCGlobals.run.roomRNG)
    local pillEffect = math.random(0, 46)
    player:UsePill(pillEffect, 0)
    player:StopExtraAnimation()

  elseif baby.name == "Glittery Peach Baby" and -- 493
         SPCGlobals.run.babyBool == false then

    -- Teleport to the boss room after X hits
    -- (but only do it once per floor)
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    if SPCGlobals.run.babyCounters == baby.num then
      SPCGlobals.run.babyBool = true
      player:UseCard(Card.CARD_EMPEROR) -- 5
    end

  elseif baby.name == "Sister Maggy" then -- 523
    SPCGlobals.run.babyCountersRoom = SPCGlobals.run.babyCountersRoom + 1
    if SPCGlobals.run.babyCountersRoom >= 2 and
       #SPCGlobals.run.passiveItems > 0 then

      -- Take away an item
      local itemToTakeAway = SPCGlobals.run.passiveItems[#SPCGlobals.run.passiveItems]
      table.remove(SPCGlobals.run.passiveItems) -- This removes the last value
      if player:HasCollectible(itemToTakeAway) then
        player:RemoveCollectible(itemToTakeAway)
        Isaac.DebugString("Removing collectible " .. tostring(itemToTakeAway))
      end
    end
  end
end

function SPCEntityTakeDmg:Entity(entity, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables (2)
  local game = Game()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  if baby.name == "Water Baby" and -- 3
     damageSource.Type == EntityType.ENTITY_TEAR and -- 2
     damageSource.Entity.SubType == 1 then

    -- Make the tears from Isaac's Tears do a lot of damage,
    -- like a Polyphemus tear (that scales with the floor)
    local damage = damageAmount * 10 * (1 + stage * 0.1)
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)

  elseif baby.name == "Lost Baby" and -- 10
         damageSource.Type == EntityType.ENTITY_EFFECT and -- 1000
         damageSource.Variant == EffectVariant.PLAYER_CREEP_RED then -- 46

    -- By default, player creep only deals 2 damage per tick, so increase the damage
    local damage = player.Damage * 2
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)

  elseif baby.name == "Mustache Baby" and -- 66
         SPCGlobals.run.dealingExtraDamage == false then

    -- By default, the boomerang only does 2x damage, so make it deal extra
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Rider Baby" and -- 295
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make the Pony do extra damage
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Slicer Baby" and -- 331
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- Make the Soy Milk tears do extra damage
    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Boxers Baby" and -- 337
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- Play a random punching-related sound effect
    sfx:Play(Isaac.GetSoundIdByName("Fist"), 1, 0, false, 1) -- 37

    -- Give the tear extra knockback
    -- ("damageSource.Velocity" doesn't exist, so we have to find it manually)
    entity.Velocity = entity.Velocity + damageSource.Entity.Velocity * 5

  elseif baby.name == "Arcade Baby" and -- 368
         SPCGlobals.run.dealingExtraDamage == false then

    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Elf Baby" and -- 377
         SPCGlobals.run.dealingExtraDamage == false then

    -- Make the Spear of Destiny do extra damage
    local damage = player.Damage * 4
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Astronaut Baby" and -- 406
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 then

    -- 5% chance for a black hole to spawn
    math.randomseed(damageSource.Entity.InitSeed)
    local chance = math.random(1, 100)
    if chance <= 5 then
      game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.BLACK_HOLE, -- 107
                 damageSource.Position, damageSource.Entity.Velocity, nil, 0, 0)
    end

  elseif baby.name == "Tooth Head Baby" and -- 442
         damageSource.Type == EntityType.ENTITY_TEAR and -- 2
         damageSource.Entity.SubType == 1 and
         SPCGlobals.run.dealingExtraDamage == false then

    local damage = player.Damage * 3.2
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false

  elseif baby.name == "Road Kill Baby" and -- 507
         SPCGlobals.run.dealingExtraDamage == false then

    -- Give the Pointy Rib extra damage
    local damage = player.Damage * 3
    SPCGlobals.run.dealingExtraDamage = true
    entity:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.dealingExtraDamage = false
  end
end

return SPCEntityTakeDmg
