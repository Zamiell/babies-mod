local PostTearInit = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_TEAR_INIT (39)
function PostTearInit:Main(tear)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostTearInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(tear)
  end
end

-- The collection of functions for each baby
PostTearInit.functions = {}

-- Lil' Baby
PostTearInit.functions[36] = function(tear)
  -- Everything is tiny
  tear.SpriteScale = Vector(0.5, 0.5)
end

-- Big Baby
PostTearInit.functions[37] = function(tear)
  -- Everything is giant
  tear.SpriteScale = Vector(2, 2)
end

return PostTearInit
