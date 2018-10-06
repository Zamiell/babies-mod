local SPCPostEffectUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_EFFECT_UPDATE (55)
function SPCPostEffectUpdate:Main(effect)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Sloppy Baby" and -- 146
     effect.Variant == EffectVariant.TARGET and -- 30
     effect.FrameCount == 1 then

    -- Shorten the lag time of the missiles
    -- (this is not possible in the MC_POST_EFFECT_INIT callback since effect.Timeout is -1)
    effect.Timeout = 10 -- 9 doesn't result in a missile coming out
  end
end

return SPCPostEffectUpdate
