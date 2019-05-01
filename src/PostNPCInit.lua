local PostNPCInit  = {}

-- Includes
local g    = require("src/globals")
local Misc = require("src/misc")

-- ModCallbacks.MC_POST_NPC_INIT (27)
function PostNPCInit:Main(npc)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Lil' Baby" then -- 36
    -- Tiny enemies
    npc.Scale = 0.5

  elseif baby.name == "Big Baby" then -- 37
    -- Everything is giant
    npc.Scale = 2

  elseif baby.name == "404 Baby" then -- 463
    Misc:SetRandomColor(npc)
  end
end



return PostNPCInit
