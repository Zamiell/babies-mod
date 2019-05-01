local EvaluateCache = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_EVALUATE_CACHE (8)
function EvaluateCache:Main(player, cacheFlag)
  -- Local variables
  local gameFrameCount = g.g:GetFrameCount()
  local character = player:GetPlayerType()
  local hearts = player:GetHearts()
  local soulHearts = player:GetSoulHearts()
  local eternalHearts = player:GetEternalHearts()
  local boneHearts = player:GetBoneHearts()
  local totalHearts = hearts + soulHearts + eternalHearts + (boneHearts * 2)
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- Give the character a flat +1 damage as a bonus, similar to Samael
  if character == Isaac.GetPlayerTypeByName("Random Baby") and
     cacheFlag == CacheFlag.CACHE_DAMAGE then -- 2

     player.Damage = player.Damage + 1
  end

  -- Handle blindfolded characters
  if baby.blindfolded and
     cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    player.MaxFireDelay = 100000
    -- (setting "player.FireDelay" here will not work, so do one frame later in the MC_POST_UPDATE callback)
  end

  -- Per baby stat changes
  if baby.name == "Cute Baby" and -- 11
     cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    -- -1 damage per pickup taken
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage - 1
    end

  elseif baby.name == "Lowface Baby" and -- 73
         cacheFlag == CacheFlag.CACHE_RANGE then -- 8

    -- 0.5x range
    player.TearHeight = player.TearHeight / 2
    if player.TearHeight > -5 then
      -- Set an absolute minimum range
      player.TearHeight = -5
    end

  elseif baby.name == "Derp Baby" and -- 78
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage * 0.5

  elseif baby.name == "Lipstick Baby" and -- 105
         cacheFlag == CacheFlag.CACHE_RANGE then -- 8

    player.TearHeight = player.TearHeight * 2

  elseif baby.name == "Tusks Baby" and -- 124
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage * 2

  elseif baby.name == "Cape Baby" and -- 152
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    player.MaxFireDelay = 1

  elseif baby.name == "Black Eye Baby" and -- 164
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    -- Starts with Leprosy, +5 damage on Leprosy breaking
    -- We use the "babyFrame" variable to track how many damage ups we have recieved
    player.Damage = player.Damage + (g.run.babyFrame * baby.num)

  elseif baby.name == "Sick Baby" and -- 187
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    -- Explosive fly tears
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3)

  elseif baby.name == "Blisters Baby" and -- 240
         cacheFlag == CacheFlag.CACHE_SHOTSPEED then -- 4

    -- This is the minimum shot speed that you can set
    player.ShotSpeed = 0.6

  elseif baby.name == "Snail Baby" and -- 244
         cacheFlag == CacheFlag.CACHE_SPEED then -- 16

    player.MoveSpeed = player.MoveSpeed * 0.5

  elseif baby.name == "Tabby Baby" and -- 269
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)

  elseif baby.name == "Killer Baby" and -- 291
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 0.2
    end

  elseif baby.name == "Cupcake Baby" and -- 321
         cacheFlag == CacheFlag.CACHE_SHOTSPEED then -- 4

    player.ShotSpeed = 4

  elseif baby.name == "Skinless Baby" and -- 322
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage * 2

  elseif baby.name == "Hero Baby" and -- 336
         cacheFlag == CacheFlag.CACHE_DAMAGE and -- 1
         totalHearts <= 2 then

    player.Damage = player.Damage * 3

  elseif baby.name == "Hero Baby" and -- 336
         cacheFlag == CacheFlag.CACHE_FIREDELAY and -- 2
         totalHearts <= 2 then

    player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3)

  elseif baby.name == "Rabbit Baby" and -- 350
         cacheFlag == CacheFlag.CACHE_SPEED and -- 16
         gameFrameCount >= g.run.babyFrame then

    -- Starts with How to Jump; must jump often
    -- Speed has a lower bound of 0.1, so we cannot set it lower than this
    player.MoveSpeed = 0.1

  elseif baby.name == "Scared Ghost Baby" and -- 369
         cacheFlag == CacheFlag.CACHE_SPEED then -- 16

    player.MoveSpeed = player.MoveSpeed * 2

  elseif baby.name == "Blue Ghost Baby" and -- 370
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    player.MaxFireDelay = 1

  elseif baby.name == "Red Ghost Baby" and -- 371
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage + 10

  elseif baby.name == "Fairyman Baby" and -- 385
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage * 0.7
    end

  elseif baby.name == "Firemage Baby" and -- 419
         cacheFlag == CacheFlag.CACHE_LUCK then -- 1024

    player.Luck = player.Luck + 13

  elseif baby.name == "Sad Bunny Baby" and -- 459
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    for i = 1, g.run.babyCounters do
      player.MaxFireDelay = player.MaxFireDelay - 1
    end

  elseif baby.name == "Voxdog Baby" and -- 462
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    -- Shockwave tears
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)

  elseif baby.name == "Robbermask Baby" and -- 473
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 1
    end

  elseif baby.name == "Text Baby" and -- 476
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage / 2

  elseif baby.name == "Bubbles Baby" and -- 483
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 1
    end

  elseif baby.name == "Twitchy Baby" and -- 511
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    -- Tear rate oscillates
    player.MaxFireDelay = player.MaxFireDelay + g.run.babyCounters
  end
end

return EvaluateCache
