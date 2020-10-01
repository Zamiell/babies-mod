local PostEffectInit = {}

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_EFFECT_INIT (54)
function PostEffectInit:Main(effect)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostEffectInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(effect)
  end
end

-- The collection of functions for each baby
PostEffectInit.functions = {}

-- Blue Baby
PostEffectInit.functions[30] = function(effect)
  -- Get rid of the poof effect that occurs when a Sprinkler is summoned
  if (
    effect.Variant == EffectVariant.POOF01 -- 15
    and g.run.babyBool
  ) then
    g.run.babyBool = false
    effect:Remove()
  end
end

-- Fang Demon Baby
PostEffectInit.functions[281] = function(effect)
  -- By default, the Marked target spawns at the center of the room,
  -- and we want it to be spawned at the player instead
  -- If we change the position here, it won't work, so make the effect invisible in the meantime
  if effect.Variant == EffectVariant.TARGET then -- 30
    effect.Visible = false
  end
end

-- 404 Baby
PostEffectInit.functions[463] = function(effect)
  Misc:SetRandomColor(effect)
end

return PostEffectInit
