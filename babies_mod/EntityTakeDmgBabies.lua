local EntityTakeDmgBabies = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

function EntityTakeDmgBabies:Player(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local type = g.run.babyType
  local baby = g.babies[type]

  -- Check to see if the player is supposed to be temporarily invulnerable
  if g.run.invulnerabilityFrame ~= 0 and
     g.run.invulnerabilityFrame >= gameFrameCount then

    return false
  end
  if g.run.invulnerable then
    return false
  end

  -- Check to see if this baby is immune to explosive damage
  if baby.explosionImmunity and
     damageFlag & DamageFlag.DAMAGE_EXPLOSION ~= 0 then -- 1 << 2

    return false
  end

  local babyFunc = EntityTakeDmgBabies.functions[type]
  if babyFunc ~= nil then
    return babyFunc(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
end

-- The collection of functions for each baby
EntityTakeDmgBabies.functions = {}

-- Host Baby
EntityTakeDmgBabies.functions[9] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  for i = 1, 10 do
    player:AddBlueSpider(player.Position)
  end
end

-- Lost Baby
EntityTakeDmgBabies.functions[10] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Lost-style health
  player:Kill()
end

-- Wrapped Baby
EntityTakeDmgBabies.functions[20] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Use Kamikaze on the next 5 frames
  g.run.babyCounters = 5
end

-- -0- Baby
EntityTakeDmgBabies.functions[24] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Invulnerability
  return false
end

-- Cry Baby
EntityTakeDmgBabies.functions[32] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Enemies are fully healed on hit
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc.HitPoints = npc.MaxHitPoints
    end
  end
end

-- Yellow Baby
EntityTakeDmgBabies.functions[33] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0) -- 26
end

-- Buddy Baby
EntityTakeDmgBabies.functions[41] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local maxHearts = player:GetMaxHearts()

  -- Removes a heart container on hit
  if not g.run.babyBool and
     maxHearts >= 2 then

    player:AddMaxHearts(-2, true)
    g.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    g.run.babyBool = false
    return false
  end
end

-- Blinding Baby
EntityTakeDmgBabies.functions[46] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Sun Card - 5.300.20
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, g.zeroVector, player, 20, 0)
end

-- Revenge Baby
EntityTakeDmgBabies.functions[50] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random Heart - 5.10.0
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, g.zeroVector,
             player, 0, g.run.randomSeed)
end

-- Apollyon Baby
EntityTakeDmgBabies.functions[56] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.RUNE_BLACK) -- 41
end

-- Goat Baby
EntityTakeDmgBabies.functions[62] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = g.babies[62]

  -- Guaranteed Devil Room + Angel Room after X hits
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters >= baby.numHits and
     not g.run.babyBool then

    g.run.babyBool = true
    g.sfx:Play(SoundEffect.SOUND_SATAN_GROW, 1, 0, false, 1) -- 241
    player:AddCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD, 0, false) -- 215
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_GOAT_HEAD)) -- 215
    player:AddCollectible(CollectibleType.COLLECTIBLE_DUALITY, 0, false) -- 498
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_DUALITY)) -- 498
  end
end

-- Ghoul Baby
EntityTakeDmgBabies.functions[83] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SECRETS, false, false, false, false) -- 287
end

-- Half Head Baby
EntityTakeDmgBabies.functions[98] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Take double damage
  if not g.run.babyBool then
    g.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    g.run.babyBool = false
  end
end

-- D Baby
EntityTakeDmgBabies.functions[101] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Spawns creep on hit (improved)
  local creep = g.g:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, -- 46
                          player.Position, g.zeroVector, player, 0, 0)
  creep:ToEffect().Scale = 10
  creep:ToEffect().Timeout = 240
end

-- Cyber Baby
EntityTakeDmgBabies.functions[116] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  Misc:SpawnRandomPickup(player.Position)
end

-- Hopeless Baby
EntityTakeDmgBabies.functions[125] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Keys are hearts
  if not g.run.babyBool then
    g.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    g.run.babyBool = false
    player:AddKeys(-1)
    return false
  end
end

-- Freaky Baby
EntityTakeDmgBabies.functions[132] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CONVERTER, false, false, false, false) -- 296
end

-- Mohawk Baby
EntityTakeDmgBabies.functions[138] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Bombs are hearts
  if not g.run.babyBool then
    g.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    g.run.babyBool = false
    player:AddBombs(-1)
    return false
  end
end

-- Rotten Meat Baby
EntityTakeDmgBabies.functions[139] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.CARD_FOOL) -- 1
end

-- Fat Baby
EntityTakeDmgBabies.functions[148] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_NECRONOMICON , false, false, false, false) -- 35
end

-- Helmet Baby
EntityTakeDmgBabies.functions[163] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Invulnerability when standing still
  if g.run.babyBool then
    return false
  end
end

-- Aban Baby
EntityTakeDmgBabies.functions[177] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local coins = player:GetNumCoins()

  -- Sonic-style health
  if coins == 0 then
    player:Kill()
    return
  end

  player:AddCoins(-99)
  for i = 1, coins do
    -- Spawn a Penny (5.20.1)
    local velocity = player.Position - Isaac.GetRandomPosition()
    velocity = velocity:Normalized()
    local modifier = math.random(4, 20)
    velocity = velocity * modifier
    local coin = g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COIN,
                           player.Position, velocity, player, 1, 0)
    local data = coin:GetData()
    data.recovery = true
  end
  g.sfx:Play(SoundEffect.SOUND_GOLD_HEART, 1, 0, false, 1) -- 465
end

-- Faded Baby
EntityTakeDmgBabies.functions[186] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random teleport on hit
  player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT , false, false, false, false) -- 44
end

-- Small Face Baby
EntityTakeDmgBabies.functions[200] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, false, false, false, false) -- 77
end

-- Dented Baby
EntityTakeDmgBabies.functions[204] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Spawns a random key on hit
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, -- 5.30
            player.Position, g.zeroVector, player, 0, g.run.randomSeed)
end

-- MeatBoy Baby
EntityTakeDmgBabies.functions[210] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_POTATO_PEELER, false, false, false, false) -- 487
end

-- Conjoined Baby
EntityTakeDmgBabies.functions[212] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Open all of the doors
  for i = 0, 7 do
    local door = g.r:GetDoor(i)
    if door ~= nil then
      door:Open(true)
    end
  end
end

-- Zipper Baby
EntityTakeDmgBabies.functions[225] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  local roomSeed = g.r:GetSpawnSeed() -- Gets a reproducible seed based on the room, e.g. "2496979501"

  -- Extra enemies spawn on hit
  -- Find an existing enemy in the room
  local dupeEnemy
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       not npc:IsBoss() then

      dupeEnemy = {
        type = npc.Type,
        variant = npc.Variant,
      }
      break
    end
  end

  -- There were no non-boss enemies in the room, so default to spawning a portal
  if dupeEnemy == nil then
    dupeEnemy = {
      type = EntityType.ENTITY_PORTAL, -- 306
      variant = 0,
    }
  end

  -- Spawn a new enemy
  local position = g.r:FindFreePickupSpawnPosition(player.Position, 1, true)
  g.g:Spawn(dupeEnemy.type, dupeEnemy.variant, position, g.zeroVector, nil, 0, roomSeed)
end

-- Beard Baby
EntityTakeDmgBabies.functions[227] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CROOKED_PENNY, false, false, false, false) -- 485
end

-- Rocker Baby
EntityTakeDmgBabies.functions[258] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Spawns a random bomb on hit
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, -- 5.40
            player.Position, g.zeroVector, player, 0, g.run.randomSeed)
end

-- Coat Baby
EntityTakeDmgBabies.functions[260] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_DECK_OF_CARDS, false, false, false, false) -- 85
end

-- Hare Baby
EntityTakeDmgBabies.functions[267] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local gridSize = g.r:GetGridSize()

  -- Check to see if there are vanilla trapdoors in the room, as those will cause unavoidable damage
  for i = 1, gridSize do
    local gridEntity = g.r:GetGridEntity(i)
    if gridEntity ~= nil then
      local saveState = gridEntity:GetSaveState()
      if saveState.Type == GridEntityType.GRID_TRAPDOOR then -- 17
        return false
      end
    end
  end

  -- Check to see if there are Big Chests in the room, as those will cause unavoidable damage
  local bigChests = Isaac.FindByType(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BIGCHEST, -1, false, false) -- 5.340
  if #bigChests > 0 then
    return false
  end
end

-- Gargoyle Baby
EntityTakeDmgBabies.functions[276] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS, false, false, false, false) -- 293
end

-- Spiky Demon Baby
EntityTakeDmgBabies.functions[277] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Play a custom sound effect if we got hit by a mimic
  for i = 0, 21 do -- There are 21 damage flags
    local bit = (damageFlag & (1 << i)) >> i

    -- Mimic damage tracking
    if i == 20 and bit == 1 then -- DAMAGE_CHEST
      g.sfx:Play(Isaac.GetSoundIdByName("Laugh"), 0.75, 0, false, 1)
      break
    end
  end
end

-- Big Tongue Baby
EntityTakeDmgBabies.functions[285] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_FLUSH, false, false, false, false) -- 291
end

-- Banshee Baby
EntityTakeDmgBabies.functions[293] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CRACK_THE_SKY, false, false, false, false) -- 160
end

-- X Mouth Baby
EntityTakeDmgBabies.functions[308] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MOVING_BOX, false, false, false, false) -- 523
end

-- Starry Eyed Baby
EntityTakeDmgBabies.functions[310] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Stars Card (5.300.18)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, g.zeroVector, player, 18, 0)
end

-- Puzzle Baby
EntityTakeDmgBabies.functions[315] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false) -- 105
end

-- Fireball Baby
EntityTakeDmgBabies.functions[318] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Immunity from fires
  if damageSource.Type == EntityType.ENTITY_FIREPLACE then -- 33
    return false
  end
end

-- Spartan Baby
EntityTakeDmgBabies.functions[329] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Spawns a pedestal item after 6 hits
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == 6 then
    g.run.babyCounters = 0
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    local position = g.r:FindFreePickupSpawnPosition(player.Position, 1, true)
    g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
              position, g.zeroVector, nil, 0, g.run.randomSeed)
  end
end

-- Tortoise Baby
EntityTakeDmgBabies.functions[330] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- 0.5x speed + 50% chance to ignore damage
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  math.randomseed(g.run.randomSeed)
  local avoidChance = math.random(1, 2)
  if avoidChance == 2 then
    return false
  end
end

-- Skinless Baby
EntityTakeDmgBabies.functions[322] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Take double damage
  if not g.run.babyBool then
    g.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    g.run.babyBool = false
  end
end

-- Ballerina Baby
EntityTakeDmgBabies.functions[323] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Summons a Restock Machine after 6 hits
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == 6 then
    g.run.babyCounters = 0
    player:UseActiveItem(Isaac.GetItemIdByName("Clockwork Assembly"), false, false, false, false)
  end
end

-- Hero Baby
EntityTakeDmgBabies.functions[336] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  -- so mark to do it later in the PostUpdate callback
  g.run.babyBool = true
end

-- Twotone Baby
EntityTakeDmgBabies.functions[346] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_DATAMINER, false, false, false, false) -- 481
end

-- Tanooki Baby
EntityTakeDmgBabies.functions[359] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MR_ME, false, false, false, false) -- 527
end

-- Fiery Baby
EntityTakeDmgBabies.functions[366] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:ShootRedCandle(g.zeroVector)
end

-- Dark Elf Baby
EntityTakeDmgBabies.functions[378] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD, false, false, false, false) -- 545
end

-- Fairyman Baby
EntityTakeDmgBabies.functions[385] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  g.run.babyCounters = g.run.babyCounters + 1
  player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
  player:EvaluateItems()
end

-- Censored Baby
EntityTakeDmgBabies.functions[408] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- All enemies get confused on hit
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc:AddConfusion(EntityRef(player), 150, false) -- 5 seconds
    end
  end
end

-- Catsuit Baby
EntityTakeDmgBabies.functions[412] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_GUPPYS_PAW, false, false, false, false) -- 133
end

-- Cup Baby
EntityTakeDmgBabies.functions[435] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.CARD_HUMANITY) -- 45
  -- (the animation will automatically be canceled by the damage)
end

-- TV Baby
EntityTakeDmgBabies.functions[441] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = g.babies[441]

  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.numHits then
    g.run.babyCounters = 0
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, false, false, false, false) -- 441
  end
end

-- Steroids Baby
EntityTakeDmgBabies.functions[444] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Forget Me Now on 2nd hit (per room)
  g.run.babyCountersRoom = g.run.babyCountersRoom + 1
  if g.run.babyCountersRoom >= 2 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_FORGET_ME_NOW, false, false, false, false) -- 127
  end
end

-- Rojen Whitefox Baby
EntityTakeDmgBabies.functions[446] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS, false, false, false, false) -- 58
end

-- Handsome Mr. Frog Baby
EntityTakeDmgBabies.functions[456] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = g.babies[456]

  player:AddBlueFlies(baby.num, player.Position, nil)
end

-- Mufflerscarf Baby
EntityTakeDmgBabies.functions[472] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- All enemies get freezed on hit
  for _, entity in ipairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc:AddFreeze(EntityRef(player), 150) -- 5 seconds
    end
  end
end

-- Scoreboard Baby
EntityTakeDmgBabies.functions[474] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()

  -- Death in 1 minute
  if g.run.babyCounters == 0 then
    g.run.babyCounters = gameFrameCount + (60 * 30)
  end
end

-- Egg Baby
EntityTakeDmgBabies.functions[488] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random pill effect on hit
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  math.randomseed(g.run.randomSeed)
  local pillEffect = math.random(0, 46)
  player:UsePill(pillEffect, 0)
  -- (the animation will automatically be canceled by the damage)
end

-- Glittery Peach Baby
EntityTakeDmgBabies.functions[493] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = g.babies[493]

  if g.run.babyBool then
    return
  end

  -- Teleport to the boss room after X hits
  -- (but only do it once per floor)
  g.run.babyCounters = g.run.babyCounters + 1
  if g.run.babyCounters == baby.numHits then
    g.run.babyBool = true
    player:UseCard(Card.CARD_EMPEROR) -- 5
  end
end

-- Lazy Baby
EntityTakeDmgBabies.functions[499] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random card effect on hit
  local cardType
  while true do
    g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
    math.randomseed(g.run.randomSeed)
    cardType = math.random(1, 54)
    if (cardType <= 31 or cardType >= 42) and -- No rune effects
       cardType ~= Card.CARD_SUICIDE_KING then -- 46

      break
    end
  end
  player:UseCard(cardType)
end

-- Reaper Baby
EntityTakeDmgBabies.functions[506] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Spawns a random rune on hit
  g.run.randomSeed = g:IncrementRNG(g.run.randomSeed)
  math.randomseed(g.run.randomSeed)
  local runeSubType = math.random(32, 41)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, -- 5.300
            player.Position, g.zeroVector, player, runeSubType, g.run.randomSeed)
end

-- Hooligan Baby
EntityTakeDmgBabies.functions[514] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local roomFrameCount = g.r:GetFrameCount()

  -- Double enemies
  -- Fix the bug where an enemy can sometimes spawn next to where the player spawns
  if roomFrameCount == 0 then
    return false
  end
end

-- Sister Maggy
EntityTakeDmgBabies.functions[523] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Loses last item on 2nd hit (per room)
  g.run.babyCountersRoom = g.run.babyCountersRoom + 1
  if g.run.babyCountersRoom >= 2 and
     #g.run.passiveItems > 0 then

    -- Take away an item
    local itemToTakeAway = g.run.passiveItems[#g.run.passiveItems]
    table.remove(g.run.passiveItems) -- This removes the last value
    if player:HasCollectible(itemToTakeAway) then
      player:RemoveCollectible(itemToTakeAway)
      Isaac.DebugString("Removing collectible " .. tostring(itemToTakeAway))
    end
  end
end

return EntityTakeDmgBabies
