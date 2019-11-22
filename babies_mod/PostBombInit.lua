local PostBombInit = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_BOMB_INIT (57)
function PostBombInit:Main(bomb)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostBombInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(bomb)
  end
end

-- The collection of functions for each baby
PostBombInit.functions = {}

-- Lil' Baby
PostBombInit.functions[36] = function(bomb)
  -- Everything is tiny
  bomb.SpriteScale = Vector(0.5, 0.5)
end

-- Big Baby
PostBombInit.functions[37] = function(bomb)
  -- Everything is giant
  bomb.SpriteScale = Vector(2, 2)
end

-- 404 Baby
PostBombInit.functions[463] = function(bomb)
  Misc:SetRandomColor(bomb)
end

return PostBombInit
