local EvaluateCache = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_EVALUATE_CACHE (8)
function EvaluateCache:Main(player, cacheFlag)
  -- Local variables
  local character = player:GetPlayerType()
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  -- Give the character a flat +1 damage as a bonus, similar to Samael
  if (
    character == Isaac.GetPlayerTypeByName("Random Baby")
    and cacheFlag == CacheFlag.CACHE_DAMAGE -- 2
  ) then
     player.Damage = player.Damage + 1
  end

  -- Handle blindfolded characters
  if (
    baby.blindfolded
    and cacheFlag == CacheFlag.CACHE_FIREDELAY -- 2
  ) then

    player.MaxFireDelay = 100000
    -- (setting "player.FireDelay" here will not work,
    -- so do one frame later in the MC_POST_UPDATE callback)
  end

  local babyFunc = EvaluateCache.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(player, cacheFlag)
  end
end

  -- The collection of functions for each baby
  EvaluateCache.functions = {}

-- Cute Baby
EvaluateCache.functions[11] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    -- -1 damage per pickup taken
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage - 1
    end
  end
end

-- Lowface Baby
EvaluateCache.functions[73] = function(player, cacheFlag)
  -- 0.5x range
  if cacheFlag == CacheFlag.CACHE_RANGE then -- 8
    player.TearHeight = player.TearHeight / 2
    if player.TearHeight > -5 then
      -- Set an absolute minimum range
      player.TearHeight = -5
    end
  end
end

-- Derp Baby
EvaluateCache.functions[78] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    player.Damage = player.Damage * 0.5
  end
end

-- Lipstick Baby
EvaluateCache.functions[105] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_RANGE then -- 8
    player.TearHeight = player.TearHeight * 2
  end
end

-- Tusks Baby
EvaluateCache.functions[124] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    player.Damage = player.Damage * 2
  end
end

-- Cape Baby
EvaluateCache.functions[152] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = 1
  end
end

-- Black Eye Baby
EvaluateCache.functions[164] = function(player, cacheFlag)
  -- Starts with Leprosy, +5 damage on Leprosy breaking
  -- We use the "babyFrame" variable to track how many damage ups we have recieved
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    local babyType = g.run.babyType
    local baby = g.babies[babyType]
    player.Damage = player.Damage + (g.run.babyFrame * baby.num)
  end
end

-- Sick Baby
EvaluateCache.functions[187] = function(player, cacheFlag)
  -- Explosive fly tears
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3)
  end
end

-- Blisters Baby
EvaluateCache.functions[240] = function(player, cacheFlag)
  -- This is the minimum shot speed that you can set
  if cacheFlag == CacheFlag.CACHE_SHOTSPEED then -- 4
    player.ShotSpeed = 0.6
  end
end

-- Snail Baby
EvaluateCache.functions[244] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_SPEED then -- 16
    player.MoveSpeed = player.MoveSpeed * 0.5
  end
end

-- Tabby Baby
EvaluateCache.functions[269] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)
  end
end

-- Killer Baby
EvaluateCache.functions[291] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 0.2
    end
  end
end

-- Cupcake Baby
EvaluateCache.functions[321] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_SHOTSPEED then -- 4
    player.ShotSpeed = 4
  end
end

-- Skinless Baby
EvaluateCache.functions[322] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    player.Damage = player.Damage * 2
  end
end

-- Hero Baby
EvaluateCache.functions[336] = function(player, cacheFlag)
  -- Local variables
  local hearts = player:GetHearts()
  local soulHearts = player:GetSoulHearts()
  local eternalHearts = player:GetEternalHearts()
  local boneHearts = player:GetBoneHearts()
  local totalHearts = hearts + soulHearts + eternalHearts + (boneHearts * 2)

  if totalHearts <= 2 then
    if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
      player.Damage = player.Damage * 3
    elseif cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
      player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3)
    end
  end
end

-- Rabbit Baby
EvaluateCache.functions[350] = function(player, cacheFlag)
  -- Starts with How to Jump; must jump often
  -- Speed has a lower bound of 0.1, so we cannot set it lower than this
  if (
    cacheFlag == CacheFlag.CACHE_SPEED -- 16
    and g.g:GetFrameCount() >= g.run.babyFrame
  ) then
    player.MoveSpeed = 0.1
  end
end

-- Scared Ghost Baby
EvaluateCache.functions[369] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_SPEED then -- 16
    player.MoveSpeed = player.MoveSpeed * 2
  end
end

-- Blue Ghost Baby
EvaluateCache.functions[370] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = 1
  end
end

-- Red Ghost Baby
EvaluateCache.functions[371] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    player.Damage = player.Damage + 10
  end
end

-- Fairyman Baby
EvaluateCache.functions[385] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage * 0.7
    end
  end
end

-- Firemage Baby
EvaluateCache.functions[419] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_LUCK then -- 1024
    player.Luck = player.Luck + 13
  end
end

-- Sad Bunny Baby
EvaluateCache.functions[459] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    for i = 1, g.run.babyCounters do
      player.MaxFireDelay = player.MaxFireDelay - 1
    end
  end
end

-- Voxdog Baby
EvaluateCache.functions[462] = function(player, cacheFlag)
  -- Shockwave tears
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2)
  end
end

-- Robbermask Baby
EvaluateCache.functions[473] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 1
    end
  end
end

-- Text Baby
EvaluateCache.functions[476] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    player.Damage = player.Damage / 2
  end
end

-- Bubbles Baby
EvaluateCache.functions[483] = function(player, cacheFlag)
  if cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1
    for i = 1, g.run.babyCounters do
      player.Damage = player.Damage + 1
    end
  end
end

-- Twitchy Baby
EvaluateCache.functions[511] = function(player, cacheFlag)
  -- Tear rate oscillates
  if cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2
    player.MaxFireDelay = player.MaxFireDelay + g.run.babyCounters
  end
end

return EvaluateCache
