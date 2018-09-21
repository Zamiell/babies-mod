local SPCEvaluateCache = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_EVALUATE_CACHE (8)
function SPCEvaluateCache:Main(player, cacheFlag)
  -- Local variables
  local hearts = player:GetHearts()
  local soulHearts = player:GetSoulHearts()
  local eternalHearts = player:GetEternalHearts()
  local boneHearts = player:GetBoneHearts()
  local totalHearts = hearts + soulHearts + eternalHearts + (boneHearts * 2)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if cacheFlag == CacheFlag.CACHE_FIREDELAY and -- 2
     baby.blindfolded then

    player.FireDelay = 100000
    Isaac.DebugString("Set blindfolded.")
  end

  if baby.name == "Lowface Baby" and -- 73
     cacheFlag == CacheFlag.CACHE_RANGE then -- 8

    player.TearHeight = player.TearHeight / 2
    if player.TearHeight > -5 then
      -- Set an absolute minimum range
      player.TearHeight = -5
    end

  elseif baby.name == "Tusks Baby" and -- 124
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage * 2

  elseif baby.name == "Snail Baby" and -- 244
         cacheFlag == CacheFlag.CACHE_SPEED then -- 16

    player.MoveSpeed = player.MoveSpeed * 0.5

  elseif baby.name == "Killer Baby" and -- 291
         cacheFlag == CacheFlag.CACHE_DAMAGE and -- 1
         SPCGlobals.run.killerBabyCounter > 0 then

    for i = 1, SPCGlobals.run.killerBabyCounter do
      player.Damage = player.Damage + 0.2
    end

  elseif baby.name == "Ranger Baby" and -- 294
         cacheFlag == CacheFlag.CACHE_RANGE then -- 8

    player.TearHeight = player.TearHeight * 2

  elseif baby.name == "Skinless Baby" and -- 322
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage * 2

  elseif baby.name == "Tortoise Baby" and -- 330
         cacheFlag == CacheFlag.CACHE_SPEED then -- 16

    player.MoveSpeed = player.MoveSpeed * 0.5

  elseif baby.name == "Hero Baby" and -- 336
         cacheFlag == CacheFlag.CACHE_DAMAGE and -- 1
         totalHearts <= 2 then

    player.Damage = player.Damage * 3

  elseif baby.name == "Hero Baby" and -- 336
         cacheFlag == CacheFlag.CACHE_FIREDELAY and -- 2
         totalHearts <= 2 then

    player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3)

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

    for i = 1, SPCGlobals.run.fairymanBabyHits do
      player.Damage = player.Damage * 0.7
    end
  end
end

return SPCEvaluateCache
