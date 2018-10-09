local SPCPostBombUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_BOMB_UPDATE (58)
function SPCPostBombUpdate:Main(bomb)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Bony Baby" and -- 284
     bomb.FrameCount == 1 and -- Frame 0 does not work
     bomb:GetData().doubled == nil then

    local position = SPCMisc:GetOffsetPosition(bomb.Position, 15, bomb.InitSeed)
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

return SPCPostBombUpdate
