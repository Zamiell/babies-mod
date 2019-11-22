local PostBombUpdate = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_BOMB_UPDATE (58)
function PostBombUpdate:Main(bomb)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostBombUpdate.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(bomb)
  end
end

-- The collection of functions for each baby
PostBombUpdate.functions = {}

-- Bomb Baby
PostBombUpdate.functions[75] = function(bomb)
  -- 50% chance for bombs to have the D6 effect
  if bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
     bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
    math.randomseed(g.run.roomRNG)
    local d6chance = math.random(1, 2)
    if d6chance == 2 then
      g.p:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false) -- 105
    end
  end
end

-- Tongue Baby
PostBombUpdate.functions[97] = function(bomb)
  -- Recharge bombs
  if bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
     bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    Misc:AddCharge()
    if RacingPlusSchoolbag ~= nil then
      RacingPlusSchoolbag:AddCharge(true) -- Giving an argument will make it only give 1 charge
    end
  end
end

-- Skull Baby
PostBombUpdate.functions[211] = function(bomb)
  -- Shockwave bombs
  if bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
     bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    for i = 1, 4 do
      local velocity
      if i == 1 then
        velocity = Vector(1, 0) -- Right
      elseif i == 2 then
        velocity = Vector(0, 1) -- Up
      elseif i == 3 then
        velocity = Vector(-1, 0) -- Left
      elseif i == 4 then
        velocity = Vector(0, -1) -- Down
      end
      g.run.babyTears[#g.run.babyTears + 1] = {
        frame = g.g:GetFrameCount(),
        position = bomb.Position,
        velocity = velocity * 30,
      }
    end
  end
end

-- Bony Baby
PostBombUpdate.functions[284] = function(bomb)
  if bomb.FrameCount == 1 and -- Frame 0 does not work
     bomb:GetData().doubled == nil then

    local position = Misc:GetOffsetPosition(bomb.Position, 15, bomb.InitSeed)
    local doubledBomb = g.g:Spawn(bomb.Type, bomb.Variant, position, bomb.Velocity,
                                  bomb.SpawnerEntity, bomb.SubType, bomb.InitSeed):ToBomb()
    doubledBomb.Flags = bomb.Flags
    doubledBomb.IsFetus = bomb.IsFetus
    if bomb.IsFetus then
      -- There is a bug where Dr. Fetus bombs that are doubled have twice as long of a cooldown
      doubledBomb:SetExplosionCountdown(28)
    end
    doubledBomb.ExplosionDamage = bomb.ExplosionDamage
    doubledBomb.RadiusMultiplier = bomb.RadiusMultiplier
    doubledBomb:GetData().doubled = true
  end
end

-- Barbarian Baby
PostBombUpdate.functions[344] = function(bomb)
  if bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
     bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    g.r:MamaMegaExplossion()
  end
end

-- Orange Ghost Baby
PostBombUpdate.functions[373] = function(bomb)
  if bomb.FrameCount == 1 and
     bomb.Variant ~= BombVariant.BOMB_SUPERTROLL then -- 5

    g.g:Spawn(bomb.Type, BombVariant.BOMB_SUPERTROLL,
              bomb.Position, bomb.Velocity, bomb.SpawnerEntity, bomb.SubType, bomb.InitSeed)
    bomb:Remove()
  end
end

return PostBombUpdate
