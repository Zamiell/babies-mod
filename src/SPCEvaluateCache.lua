local SPCEvaluateCache = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_EVALUATE_CACHE (8)
function SPCEvaluateCache:Main(player, cacheFlag)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
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
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, SPCGlobals.run.babyCounters do
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

    for i = 1, SPCGlobals.run.babyCounters do
      player.Damage = player.Damage * 0.7
    end

  elseif baby.name == "Firemage Baby" and -- 419
         cacheFlag == CacheFlag.CACHE_LUCK then -- 1024

    player.Luck = player.Luck + 13

  elseif baby.name == "Sad Bunny Baby" and -- 459
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    for i = 1, SPCGlobals.run.babyCounters do
      player.MaxFireDelay = player.MaxFireDelay - 1
    end

  elseif baby.name == "Robbermask Baby" and -- 473
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, SPCGlobals.run.babyCounters do
      player.Damage = player.Damage + 0.5
    end

  elseif baby.name == "Text Baby" and -- 476
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    player.Damage = player.Damage / 2

  elseif baby.name == "Bubbles Baby" and -- 483
         cacheFlag == CacheFlag.CACHE_DAMAGE then -- 1

    for i = 1, SPCGlobals.run.babyCounters do
      player.Damage = player.Damage + 1
    end

  elseif baby.name == "Twitchy Baby" and -- 511
         cacheFlag == CacheFlag.CACHE_FIREDELAY then -- 2

    local period = (gameFrameCount % 600) + 1
    local modifier
    if period <= 37.5 then
      modifier = -4
    elseif period <= 75 then
      modifier = -3
    elseif period <= 112.5 then
      modifier = -2
    elseif period <= 150 then
      modifier = -1
    elseif period <= 187.5 then
      modifier = 0
    elseif period <= 225 then
      modifier = 1
    elseif period <= 262.5 then
      modifier = 2
    elseif period <= 300 then
      modifier = 3
    elseif period <= 337.5 then
      modifier = 4
    elseif period <= 375 then
      modifier = 3
    elseif period <= 412.5 then
      modifier = 2
    elseif period <= 450 then
      modifier = 1
    elseif period <= 487.5 then
      modifier = 0
    elseif period <= 525 then
      modifier = -1
    elseif period <= 562.5 then
      modifier = -2
    elseif period <= 600 then
      modifier = -3
    end
    player.MaxFireDelay = player.MaxFireDelay + modifier
  end
end

return SPCEvaluateCache
