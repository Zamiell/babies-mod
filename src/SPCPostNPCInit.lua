local SPCPostNPCInit  = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_NPC_INIT (27)
function SPCPostNPCInit:Main(npc)
  -- Local variables
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Hooligan Baby" then -- 291
    SPCPostNPCInit:Baby291(npc)

  elseif baby.name == "Moth Baby" then -- 450
    npc:MakeChampion(npc.InitSeed)
    npc:Morph(npc.Type, npc.Variant, npc.SubType, 11) -- Purple / Gaping Maw effect

  elseif baby.name == "404 Baby" then -- 463
    SPCGlobals:SetRandomColor(npc)
  end
end

function SPCPostNPCInit:Baby291(npc)
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local player = game:GetPlayer(0)

  -- Doubling certain enemies leads to bugs
  if npc.Type == EntityType.ENTITY_FIREPLACE or -- 33
     npc.Type == EntityType.ENTITY_STONEHEAD or -- 42
     npc.Type == EntityType.ENTITY_POKY or -- 44
     npc.Type == EntityType.ENTITY_MOM or -- 45
     npc.Type == EntityType.ENTITY_MOMS_HEART or -- 78
     (npc.Type == EntityType.ENTITY_GEMINI and -- 79
      npc.Variant >= 10) or
     npc.Type == EntityType.ENTITY_ETERNALFLY or -- 96
     npc.Type == EntityType.ENTITY_ISAAC or -- 102
     npc.Type == EntityType.ENTITY_CONSTANT_STONE_SHOOTER or -- 202
     npc.Type == EntityType.ENTITY_BRIMSTONE_HEAD or -- 203
     (npc.Type == EntityType.ENTITY_SWINGER and -- 216
      npc.Variant > 0) or
     npc.Type == EntityType.ENTITY_WALL_HUGGER or -- 218
     npc.Type == EntityType.ENTITY_GAPING_MAW or -- 235
     npc.Type == EntityType.ENTITY_BROKEN_GAPING_MAW or -- 236
     npc.Type == EntityType.ENTITY_SWARM then -- 281

    return
  end

  if SPCGlobals.run.hooliganBabySpawning == false then
    SPCGlobals.run.hooliganBabySpawning = true
    local pos = room:FindFreePickupSpawnPosition(npc.Position, 1, true)
    if SPCGlobals:InsideSquare(pos, player.Position, 15) == false then
      game:Spawn(npc.Type, npc.Variant, pos, npc.Velocity, npc, npc.SubType, npc.InitSeed)
    end
    SPCGlobals.run.hooliganBabySpawning = false
  end
end

return SPCPostNPCInit
