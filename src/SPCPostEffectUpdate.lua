local SPCPostEffectUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_EFFECT_UPDATE (55)
function SPCPostEffectUpdate:Main(effect)
  -- Local variables
  local game = Game()
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

  elseif baby.name == "Cool Orange Baby" then -- 485
    if effect.Variant == Isaac.GetEntityVariantByName("FetusBossTarget") and
       effect.FrameCount == 30 then -- 1 second

      local rocket = game:Spawn(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossRocket"),
                                effect.Position, Vector(0, 0), nil, 0, 0)
      local rocketHeightOffset = Vector(0, -300)
      rocket.SpriteOffset = rocket.SpriteOffset + rocketHeightOffset

    elseif effect.Variant == Isaac.GetEntityVariantByName("FetusBossRocket") then

      local rocketFallSpeed = Vector(0, 30)
      effect.SpriteOffset = effect.SpriteOffset + rocketFallSpeed
      if effect.SpriteOffset.Y >= 0 then
        Isaac.Explode(effect.Position, nil, 50) -- 49 deals 1 half heart of damage
        effect:Remove()
        local entities = Isaac.FindByType(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossTarget"),
                                          -1, false, false) -- 1000
        entities[1]:Remove()
      end
    end
  end
end

return SPCPostEffectUpdate
