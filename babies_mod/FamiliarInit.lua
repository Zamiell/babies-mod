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

  local babyFunc = FamiliarInit.functions[type]
  if babyFunc ~= nil then
    babyFunc(familiar)
  end
end

-- The collection of functions for each baby
FamiliarInit.functions = {}

-- Blue Baby
FamiliarInit.functions[30] = function(familiar)
  -- Making the Sprinkler invisible
  -- (setting "familiar.Visible = false" does not work, so blank out the sprite)
  if familiar.Variant == FamiliarVariant.SPRINKLER then -- 120
    familiar:GetSprite():Load("gfx/003.120_sprinkler2.anm2", true)
  end
end

-- Sucky Baby
FamiliarInit.functions[48] = function(familiar)
  -- Make the Sucubus invisible
  -- (setting "familiar.Visible = false" does not work because it will also make the aura invisible)
  if familiar.Variant == FamiliarVariant.SUCCUBUS then -- 96
    local sprite = familiar:GetSprite()
    sprite:Load("gfx/003.096_succubus2.anm2", true)
    sprite:Play("IdleDown", true)
  end
end

-- Crow Baby
FamiliarInit.functions[117] = function(familiar)
  if familiar.Variant == FamiliarVariant.DEAD_BIRD and -- 14
     not g.run.babyBool then

    -- Spawn 5 bird familiars instead of 4
    g.run.babyBool = true
    for i = 1, 4 do
      g.g:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.DEAD_BIRD, g.p.Position, g.zeroVector, nil, 0, 0)
    end
    g.run.babyBool = false
  end
end

-- Black Eye Baby
FamiliarInit.functions[164] = function(familiar)
  if familiar.Variant == FamiliarVariant.LEPROCY and -- 121
     g.run.babyCounters < 3 then

    g.run.babyCounters = g.run.babyCounters + 1
  end
end

-- Graven Baby
FamiliarInit.functions[453] = function(familiar)
  -- Bumbo needs 25 coins to reach the max level
  if familiar.Variant == FamiliarVariant.BUMBO then -- 88
    familiar.Coins = 25
  end
end

return FamiliarInit
