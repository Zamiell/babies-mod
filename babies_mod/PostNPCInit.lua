local PostNPCInit  = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_POST_NPC_INIT (27)
function PostNPCInit:Main(npc)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = PostNPCInit.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(npc)
  end
end

-- The collection of functions for each baby
PostNPCInit.functions = {}

-- Lil' Baby
PostNPCInit.functions[36] = function(npc)
  -- Tiny enemies
  npc.Scale = 0.5
end

-- Big Baby
PostNPCInit.functions[37] = function(npc)
  -- Everything is giant
  npc.Scale = 2
end

-- 404 Baby
PostNPCInit.functions[463] = function(npc)
  Misc:SetRandomColor(npc)
end

return PostNPCInit
