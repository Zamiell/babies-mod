local SPCPostNPCInit  = {}

-- Includes
local SPCGlobals = require("src/spcglobals")
local SPCMisc    = require("src/spcmisc")

-- ModCallbacks.MC_POST_NPC_INIT (27)
function SPCPostNPCInit:Main(npc)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Bloodsucker Baby" then -- 87
    -- Tiny enemies
    npc.Scale = 0.5

  elseif baby.name == "New Jammies Baby" then -- 193
    -- Everything is giant
    npc.Scale = 2

  elseif baby.name == "Moth Baby" then -- 450
    npc:MakeChampion(npc.InitSeed)
    npc:Morph(npc.Type, npc.Variant, npc.SubType, 11) -- Purple / Gaping Maw effect

  elseif baby.name == "404 Baby" then -- 463
    SPCMisc:SetRandomColor(npc)
  end
end



return SPCPostNPCInit
