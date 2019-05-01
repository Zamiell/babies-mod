local PostKnifeInit = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_USE_ITEM (3)
function PostKnifeInit:Main(knife)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  if baby.name == "Brother Bobby" then -- 522
    -- Make the knife invisible
    knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
    knife.Visible = false
  end
end

return PostKnifeInit
