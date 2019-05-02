local PostBombInit = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_BOMB_INIT (57)
function PostBombInit:Main(bomb)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Lil' Baby" then -- 36
    -- Everything is tiny
    bomb.SpriteScale = Vector(0.5, 0.5)

  elseif baby.name == "Big Baby" then -- 37
    -- Everything is giant
    bomb.SpriteScale = Vector(2, 2)

  elseif baby.name == "404 Baby" then -- 463
    Misc:SetRandomColor(bomb)
  end
end

return PostBombInit
