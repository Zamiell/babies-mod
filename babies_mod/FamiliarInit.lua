local FamiliarInit = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_FAMILIAR_INIT (7)
function FamiliarInit:Main(familiar)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Blue Baby" and -- 30
     familiar.Variant == FamiliarVariant.SPRINKLER then -- 120

    -- Making the Sprinkler invisible
    -- (setting "familiar.Visible = false" does not work, so blank out the sprite)
    familiar:GetSprite():Load("gfx/003.120_sprinkler2.anm2", true)

  elseif baby.name == "Sucky Baby" and -- 48
         familiar.Variant == FamiliarVariant.SUCCUBUS then -- 96

    -- Make the Sucubus invisible
    -- (setting "familiar.Visible = false" does not work because it will also make the aura invisible)
    local sprite = familiar:GetSprite()
    sprite:Load("gfx/003.096_succubus2.anm2", true)
    sprite:Play("IdleDown", true)

  elseif baby.name == "Crow Baby" and -- 117
     familiar.Variant == FamiliarVariant.DEAD_BIRD and -- 14
     not g.run.babyBool then

    -- Spawn 5 bird familiars instead of 4
    g.run.babyBool = true
    for i = 1, 4 do
      g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.DEAD_BIRD, g.p.Position, g.zeroVector, nil, 0, 0)
    end
    g.run.babyBool = false

  elseif baby.name == "Black Eye Baby" and -- 164
         familiar.Variant == FamiliarVariant.LEPROCY and -- 121
         g.run.babyCounters < 3 then

    g.run.babyCounters = g.run.babyCounters + 1

  elseif baby.name == "Graven Baby" and -- 453
         familiar.Variant == FamiliarVariant.BUMBO then -- 88

    -- Bumbo needs 25 coins to reach the max level
    familiar.Coins = 25
  end
end

return FamiliarInit
