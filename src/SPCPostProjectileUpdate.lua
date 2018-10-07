local SPCPostProjectileUpdate = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_PROJECTILE_UPDATE (43)
function SPCPostProjectileUpdate:Main(projectile)
  -- Local variables
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "404 Baby" and -- 463
     projectile.FrameCount <= 1 then

    -- The first frame for a projectile is 1
    -- (frame 0 will happen with a tear, but not a projectile for some reason)
    SPCMisc:SetRandomColor(projectile)
  end
end

return SPCPostProjectileUpdate
