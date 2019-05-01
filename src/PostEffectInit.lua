local PostEffectInit = {}

-- Includes
local g    = require("src/globals")
local Misc = require("src/misc")

-- ModCallbacks.MC_POST_EFFECT_INIT (54)
function PostEffectInit:Main(effect)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Blue Baby" and -- 30
     effect.Variant == EffectVariant.POOF01 and -- 15
     g.run.babyBool then

    -- Get rid of the poof effect that occurs when a Sprinkler is summoned
    g.run.babyBool = false
    effect:Remove()

  elseif baby.name == "404 Baby" then -- 463
    Misc:SetRandomColor(effect)

  elseif baby.name == "Fang Demon Baby" and -- 281
         effect.Variant == EffectVariant.TARGET then -- 30

    -- By default, the Marked target spawns at the center of the room,
    -- and we want it to be spawned at the player instead
    -- If we change the position here, it won't work, so make the effect invisible in the meantime
    effect.Visible = false
  end
end

return PostEffectInit
