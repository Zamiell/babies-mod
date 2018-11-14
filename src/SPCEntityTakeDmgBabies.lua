local SPCEntityTakeDmgBabies = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- Called from the MC_ENTITY_TAKE_DMG (11) callback
function SPCEntityTakeDmgBabies:Player(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Check to see if the player is supposed to be temporarily invulnerable
  if SPCGlobals.run.invulnerabilityFrame ~= 0 and
     SPCGlobals.run.invulnerabilityFrame >= gameFrameCount then

    return false
  end
  if SPCGlobals.run.invulnerable then
    return false
  end

  -- Check to see if this baby is immune to explosive damage
  if baby.explosionImmunity and
     damageFlag & DamageFlag.DAMAGE_EXPLOSION ~= 0 then -- 1 << 2

    return false
  end

  if SPCEntityTakeDmgBabies.functions[type] ~= nil then
    return SPCEntityTakeDmgBabies.functions[type](player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  end
end

-- The collection of functions for each baby effect
SPCEntityTakeDmgBabies.functions = {}

-- Host Baby
SPCEntityTakeDmgBabies.functions[9] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  for i = 1, 10 do
    player:AddBlueSpider(player.Position)
  end
end

-- Lost Baby
SPCEntityTakeDmgBabies.functions[10] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Lost-style health
  player:Kill()
end

-- Wrapped Baby
SPCEntityTakeDmgBabies.functions[20] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Use Kamikaze on the next 5 frames
  SPCGlobals.run.babyCounters = 5
end

-- -0- Baby
SPCEntityTakeDmgBabies.functions[24] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Invulnerability
  return false
end

-- Cry Baby
SPCEntityTakeDmgBabies.functions[32] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Enemies are fully healed on hit
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc.HitPoints = npc.MaxHitPoints
    end
  end
end

-- Yellow Baby
SPCEntityTakeDmgBabies.functions[33] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UsePill(PillEffect.PILLEFFECT_LEMON_PARTY, 0) -- 26
end

-- Buddy Baby
SPCEntityTakeDmgBabies.functions[41] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local maxHearts = player:GetMaxHearts()

  -- Removes a heart container on hit
  if maxHearts >= 2 then
    player:AddMaxHearts(-2, true)
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    return false
  end
end

-- Blinding Baby
SPCEntityTakeDmgBabies.functions[46] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Sun Card - 5.300.20
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, Vector(0, 0), player, 20, 0)
end

-- Revenge Baby
SPCEntityTakeDmgBabies.functions[50] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Random Heart - 5.10.0
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_HEART, player.Position, Vector(0, 0),
             player, 0, SPCGlobals.run.randomSeed)
end

-- Apollyon Baby
SPCEntityTakeDmgBabies.functions[56] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.RUNE_BLACK) -- 41
end

-- Goat Baby
SPCEntityTakeDmgBabies.functions[62] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local sfx = SFXManager()
  local baby = SPCGlobals.babies[62]

  -- Guaranteed Devil Room + Angel Room after X hits
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters >= baby.numHits and
     SPCGlobals.run.babyBool == false then

    SPCGlobals.run.babyBool = true
    sfx:Play(SoundEffect.SOUND_SATAN_GROW, 1, 0, false, 1) -- 241
    player:AddCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD, 0, false) -- 215
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_GOAT_HEAD)) -- 215
    player:AddCollectible(CollectibleType.COLLECTIBLE_DUALITY, 0, false) -- 498
    Isaac.DebugString("Removing collectible " .. tostring(CollectibleType.COLLECTIBLE_DUALITY)) -- 498
  end
end

-- Ghoul Baby
SPCEntityTakeDmgBabies.functions[83] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SECRETS, false, false, false, false) -- 287
end

-- Half Head Baby
SPCEntityTakeDmgBabies.functions[98] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Take double damage
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.babyBool = false
  end
end

-- D Baby
SPCEntityTakeDmgBabies.functions[101] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Spawns creep on hit (improved)
  local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_RED, -- 46
                           player.Position, Vector(0, 0), player, 0, 0)
  creep:ToEffect().Scale = 10
  creep:ToEffect().Timeout = 240
end

-- Cyber Baby
SPCEntityTakeDmgBabies.functions[116] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  SPCMisc:SpawnRandomPickup(player.Position)
end

-- Hopeless Baby
SPCEntityTakeDmgBabies.functions[125] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Keys are hearts
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    SPCGlobals.run.babyBool = false
    player:AddKeys(-1)
    return false
  end
end

-- Freaky Baby
SPCEntityTakeDmgBabies.functions[132] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CONVERTER, false, false, false, false) -- 296
end

-- Mohawk Baby
SPCEntityTakeDmgBabies.functions[138] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Bombs are hearts
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    SPCGlobals.run.babyBool = false
    player:AddBombs(-1)
    return false
  end
end

-- Rotten Meat Baby
SPCEntityTakeDmgBabies.functions[139] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.CARD_FOOL) -- 1
end

-- Fat Baby
SPCEntityTakeDmgBabies.functions[148] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_NECRONOMICON , false, false, false, false) -- 35
end

-- Helmet Baby
SPCEntityTakeDmgBabies.functions[163] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Invulnerability when standing still
  if SPCGlobals.run.babyBool then
    return false
  end
end

-- Aban Baby
SPCEntityTakeDmgBabies.functions[177] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local sfx = SFXManager()

  if SPCGlobals.run.babyBool then
    return
  end

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
end

-- Faded Baby
SPCEntityTakeDmgBabies.functions[186] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random teleport on hit
  player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEPORT , false, false, false, false) -- 44
end

-- Small Face Baby
SPCEntityTakeDmgBabies.functions[200] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN, false, false, false, false) -- 77
end

-- Dented Baby
SPCEntityTakeDmgBabies.functions[204] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Random Key (5.30.0)
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_KEY, player.Position, Vector(0, 0), player, 0, 0)
end

-- MeatBoy Baby
SPCEntityTakeDmgBabies.functions[210] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_POTATO_PEELER, false, false, false, false) -- 487
end

-- Conjoined Baby
SPCEntityTakeDmgBabies.functions[212] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()

  -- Open all of the doors
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil then
      door:Open(true)
    end
  end
end

-- Zipper Baby
SPCEntityTakeDmgBabies.functions[225] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomSeed = room:GetSpawnSeed()

  -- Extra enemies spawn on hit
  -- Find an existing enemy in the room
  local dupeEnemy
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsBoss() == false then

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
  local position = room:FindFreePickupSpawnPosition(player.Position, 1, true)
  game:Spawn(dupeEnemy.type, dupeEnemy.variant, position, Vector(0, 0), nil, 0, roomSeed)
end

-- Beard Baby
SPCEntityTakeDmgBabies.functions[227] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CROOKED_PENNY, false, false, false, false) -- 485
end

-- Rocker Baby
SPCEntityTakeDmgBabies.functions[258] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Random Bomb (5.40.0)
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_BOMB, player.Position, Vector(0, 0), player, 0, 0)
end

-- Coat Baby
SPCEntityTakeDmgBabies.functions[260] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_DECK_OF_CARDS, false, false, false, false) -- 85
end

-- Gargoyle Baby
SPCEntityTakeDmgBabies.functions[276] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS, false, false, false, false) -- 293
end

-- Spiky Demon Baby
SPCEntityTakeDmgBabies.functions[277] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local sfx = SFXManager()

  -- Play a custom sound effect if we got hit by a mimic
  for i = 0, 21 do -- There are 21 damage flags
    local bit = (damageFlag & (1 << i)) >> i

    -- Mimic damage tracking
    if i == 20 and bit == 1 then -- DAMAGE_CHEST
      sfx:Play(Isaac.GetSoundIdByName("Laugh"), 0.75, 0, false, 1)
      break
    end
  end
end

-- Big Tongue Baby
SPCEntityTakeDmgBabies.functions[285] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_FLUSH, false, false, false, false) -- 291
end

-- Banshee Baby
SPCEntityTakeDmgBabies.functions[293] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_CRACK_THE_SKY, false, false, false, false) -- 160
end

-- X Mouth Baby
SPCEntityTakeDmgBabies.functions[308] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MOVING_BOX, false, false, false, false) -- 523
end

-- Starry Eyed Baby
SPCEntityTakeDmgBabies.functions[310] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Stars Card (5.300.18)
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, player.Position, Vector(0, 0), player, 18, 0)
end

-- Puzzle Baby
SPCEntityTakeDmgBabies.functions[315] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false) -- 105
end

-- Fireball Baby
SPCEntityTakeDmgBabies.functions[318] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Immunity from fires
  if damageSource.Type == EntityType.ENTITY_FIREPLACE then -- 33
    return false
  end
end

-- Spartan Baby
SPCEntityTakeDmgBabies.functions[329] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()

  -- Spawns a pedestal item after 6 hits
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters == 6 then
    SPCGlobals.run.babyCounters = 0
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    local position = room:FindFreePickupSpawnPosition(player.Position, 1, true)
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
               position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
  end
end

-- Tortoise Baby
SPCEntityTakeDmgBabies.functions[330] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- 0.5x speed + 50% chance to ignore damage
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
  math.randomseed(SPCGlobals.run.randomSeed)
  local avoidChance = math.random(1, 2)
  if avoidChance == 2 then
    return false
  end
end

-- Skinless Baby
SPCEntityTakeDmgBabies.functions[322] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Take double damage
  if SPCGlobals.run.babyBool == false then
    SPCGlobals.run.babyBool = true
    player:TakeDamage(damageAmount, 0, EntityRef(player), damageCountdownFrames)
    SPCGlobals.run.babyBool = false
  end
end

-- Ballerina Baby
SPCEntityTakeDmgBabies.functions[323] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Summons a Restock Machine after 6 hits
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters == 6 then
    SPCGlobals.run.babyCounters = 0
    player:UseActiveItem(Isaac.GetItemIdByName("Clockwork Assembly"), false, false, false, false)
  end
end

-- Hero Baby
SPCEntityTakeDmgBabies.functions[336] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  -- so mark to do it later in the PostUpdate callback
  SPCGlobals.run.babyBool = true
end

-- Twotone Baby
SPCEntityTakeDmgBabies.functions[346] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_DATAMINER, false, false, false, false) -- 481
end

-- Tanooki Baby
SPCEntityTakeDmgBabies.functions[359] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_MR_ME, false, false, false, false) -- 527
end

-- Fiery Baby
SPCEntityTakeDmgBabies.functions[366] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:ShootRedCandle(Vector(0, 0))
end

-- Dark Elf Baby
SPCEntityTakeDmgBabies.functions[378] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_THE_DEAD, false, false, false, false) -- 545
end

-- Fairyman Baby
SPCEntityTakeDmgBabies.functions[385] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
  player:EvaluateItems()
end

-- Censored Baby
SPCEntityTakeDmgBabies.functions[408] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- All enemies get confused on hit
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc:AddConfusion(EntityRef(player), 150, false) -- 5 seconds
    end
  end
end

-- Catsuit Baby
SPCEntityTakeDmgBabies.functions[412] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_GUPPYS_PAW, false, false, false, false) -- 133
end

-- Cup Baby
SPCEntityTakeDmgBabies.functions[435] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseCard(Card.CARD_HUMANITY) -- 45
  -- (the animation will automatically be canceled by the damage)
end

-- TV Baby
SPCEntityTakeDmgBabies.functions[441] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = SPCGlobals.babies[441]

  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters == baby.numHits then
    SPCGlobals.run.babyCounters = 0
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH, false, false, false, false) -- 441
  end
end

-- Steroids Baby
SPCEntityTakeDmgBabies.functions[444] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Forget Me Now on 2nd hit (per room)
  SPCGlobals.run.babyCountersRoom = SPCGlobals.run.babyCountersRoom + 1
  if SPCGlobals.run.babyCountersRoom >= 2 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_FORGET_ME_NOW, false, false, false, false) -- 127
  end
end

-- Rojen Whitefox Baby
SPCEntityTakeDmgBabies.functions[446] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  player:UseActiveItem(CollectibleType.COLLECTIBLE_BOOK_OF_SHADOWS, false, false, false, false) -- 58
end

-- Handsome Mr. Frog Baby
SPCEntityTakeDmgBabies.functions[456] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = SPCGlobals.babies[456]

  player:AddBlueFlies(baby.num, player.Position, nil)
end

-- Mufflerscarf Baby
SPCEntityTakeDmgBabies.functions[472] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- All enemies get freezed on hit
  for i, entity in pairs(Isaac.GetRoomEntities()) do
    local npc = entity:ToNPC()
    if npc ~= nil and
       npc:IsVulnerableEnemy() then -- Returns true for enemies that can be damaged

      npc:AddFreeze(EntityRef(player), 150) -- 5 seconds
    end
  end
end

-- Scoreboard Baby
SPCEntityTakeDmgBabies.functions[474] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  -- Death in 1 minute
  if SPCGlobals.run.babyCounters == 0 then
    SPCGlobals.run.babyCounters = gameFrameCount + (60 * 30)
  end
end

-- Egg Baby
SPCEntityTakeDmgBabies.functions[488] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random pill effect on hit
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
  math.randomseed(SPCGlobals.run.randomSeed)
  local pillEffect = math.random(0, 46)
  player:UsePill(pillEffect, 0)
  -- (the animation will automatically be canceled by the damage)
end

-- Glittery Peach Baby
SPCEntityTakeDmgBabies.functions[493] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local baby = SPCGlobals.babies[493]

  if SPCGlobals.run.babyBool then
    return
  end

  -- Teleport to the boss room after X hits
  -- (but only do it once per floor)
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters == baby.numHits then
    SPCGlobals.run.babyBool = true
    player:UseCard(Card.CARD_EMPEROR) -- 5
  end
end

-- Lazy Baby
SPCEntityTakeDmgBabies.functions[499] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Random card effect on hit
  local cardType
  while true do
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    math.randomseed(SPCGlobals.run.randomSeed)
    cardType = math.random(1, 54)
    if (cardType <= 31 or cardType >= 42) and -- No rune effects
       cardType ~= Card.CARD_SUICIDE_KING then -- 46

      break
    end
  end
  player:UseCard(cardType)
end

-- Reaper Baby
SPCEntityTakeDmgBabies.functions[506] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()

  -- Spawns a random rune on hit
  SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
  math.randomseed(SPCGlobals.run.randomSeed)
  local runeSubType = math.random(32, 41)
  game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_TAROTCARD, -- 5.300
             player.Position, Vector(0, 0), player, runeSubType, SPCGlobals.run.randomSeed)
end

-- Sister Maggy
SPCEntityTakeDmgBabies.functions[523] = function(player, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Loses last item on 2nd hit (per room)
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

return SPCEntityTakeDmgBabies
