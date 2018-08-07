local SPCEntityTakeDmg = {}

--
-- Includes
--

local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_ENTITY_TAKE_DMG (11)
-- (this must return nil or false)
function SPCEntityTakeDmg:Main(tookDamage, damageAmount, damageFlag, damageSource, damageCountdownFrames)
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  local player = tookDamage:ToPlayer()
  if player ~= nil then
    SPCEntityTakeDmg:Player(player)
    return
  end

  if baby.name == "Water Baby" and -- 3
     damageSource.Type == EntityType.ENTITY_TEAR and -- 2
     damageSource.Entity.SubType == 1 then

    -- Big damage, like a Polyphemus tear (that scales with the floor)
    local damage = damageAmount * 10 * (1 + stage * 0.1)
    tookDamage:TakeDamage(damage, 0, EntityRef(player), damageCountdownFrames)
  end
end

function SPCEntityTakeDmg:Player(player)
  -- Local variables
  --local type = SPCGlobals.run.babyType
  --local baby = SPCGlobals.babies[type]

  --[[
  if baby.name == "Water Baby" then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS , false, false, false, false) -- 323
  end
  --]]
end

return SPCEntityTakeDmg
