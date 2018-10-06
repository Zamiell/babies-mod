local SPCPostKnifeInit = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_USE_ITEM (3)
function SPCPostKnifeInit:Main(knife)
  -- Local variables
  local babyType = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "Brother Bobby" then -- 522
    -- Make the knife invisible
    knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
    knife.Visible = false
  end
end

return SPCPostKnifeInit
