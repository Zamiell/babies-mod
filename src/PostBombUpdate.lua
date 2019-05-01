local PostBombUpdate = {}

-- Includes
local g    = require("src/globals")
local Misc = require("src/misc")

-- ModCallbacks.MC_POST_BOMB_UPDATE (58)
function PostBombUpdate:Main(bomb)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Bomb Baby" and -- 75
     bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
     bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    -- 50% chance for bombs to have the D6 effect
    g.run.roomRNG = g:IncrementRNG(g.run.roomRNG)
    math.randomseed(g.run.roomRNG)
    local d6chance = math.random(1, 2)
    if d6chance == 2 then
      player:UseActiveItem(CollectibleType.COLLECTIBLE_D6, false, false, false, false) -- 105
    end

  elseif baby.name == "Tongue Baby" and -- 97
         bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
         bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    -- Recharge bombs
    Misc:AddCharge()
    if RacingPlusSchoolbag ~= nil then
      RacingPlusSchoolbag:AddCharge(true) -- Giving an argument will make it only give 1 charge
    end

  elseif baby.name == "Skull Baby" and -- 211
         bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
         bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    -- Shockwave bombs
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
        frame = gameFrameCount,
        position = bomb.Position,
        velocity = velocity * 30,
      }
    end

  elseif baby.name == "Bony Baby" and -- 284
         bomb.FrameCount == 1 and -- Frame 0 does not work
         bomb:GetData().doubled == nil then

    local position = Misc:GetOffsetPosition(bomb.Position, 15, bomb.InitSeed)
    local doubledBomb = game:Spawn(bomb.Type, bomb.Variant, position, bomb.Velocity,
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

  elseif baby.name == "Barbarian Baby" and -- 344
         bomb.SpawnerType == EntityType.ENTITY_PLAYER and -- 1
         bomb.FrameCount == 51 then -- Bombs explode on the 51st frame exactly

    room:MamaMegaExplossion()

  elseif baby.name == "Orange Ghost Baby" and -- 373
         bomb.FrameCount == 1 and
         bomb.Variant ~= BombVariant.BOMB_SUPERTROLL then -- 5

    game:Spawn(bomb.Type, BombVariant.BOMB_SUPERTROLL,
               bomb.Position, bomb.Velocity, bomb.SpawnerEntity, bomb.SubType, bomb.InitSeed)
    bomb:Remove()
  end
end

return PostBombUpdate
