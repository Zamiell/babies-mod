local SPCFamiliarUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

function SPCFamiliarUpdate:Main(familiar)
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Pixie Baby" and -- 403
     familiar.Variant == FamiliarVariant.YO_LISTEN and -- 111
     familiar.FrameCount % 5 == 0 then

    -- Speed it up
    familiar.Velocity = familiar.Velocity * 2

  elseif baby.name == "Seraphim" and -- 538
         familiar.Variant == FamiliarVariant.CENSER then -- 89

    familiar.Position = player.Position
    local sprite = familiar:GetSprite()
    sprite:Load("gfx/003.089_censer_invisible.anm2", true)
    sprite:Play("Idle")
  end
end

return SPCFamiliarUpdate
