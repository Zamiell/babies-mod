local SPCFamiliarInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_FAMILIAR_INIT (7)
function SPCFamiliarInit:Main(familiar)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
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
     SPCGlobals.run.babyBool == false then

    -- Spawn 5 bird familiars instead of 4
    SPCGlobals.run.babyBool = true
    for i = 1, 4 do
      game:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.DEAD_BIRD, player.Position, Vector(0, 0), nil, 0, 0)
    end
    SPCGlobals.run.babyBool = false

  elseif baby.name == "Black Eye Baby" and -- 164
         familiar.Variant == FamiliarVariant.LEPROCY and -- 121
         SPCGlobals.run.babyCounters < 3 then

    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1

  elseif baby.name == "Graven Baby" and -- 453
         familiar.Variant == FamiliarVariant.BUMBO then -- 88

    -- Bumbo needs 25 coins to reach the max level
    familiar.Coins = 25
  end
end

return SPCFamiliarInit
