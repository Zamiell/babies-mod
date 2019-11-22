local PostKnifeInit = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_USE_ITEM (3)
function PostKnifeInit:Main(knife)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostKnifeInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(knife)
  end
end

-- The collection of functions for each baby
PostKnifeInit.functions = {}

-- Brother Bobby
PostKnifeInit.functions[522] = function(knife)
  -- Make the knife invisible
  knife.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE -- 0
  knife.Visible = false
end

return PostKnifeInit
