local SPCPostTearUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_TEAR_UPDATE (40)
function SPCPostTearUpdate:Main(tear)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Octopus Baby" and
     gameFrameCount % 5 == 0 then -- If we spawn creep on every frame, it becomes too thick

    -- Make the tear drip black creep
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_BLACK, -- 45
                               tear.Position, Vector(0, 0), tear, 0, 0)
    creep:ToEffect().Timeout = 240
  end
end

return SPCPostTearUpdate
