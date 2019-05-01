local NPCUpdate = {}

-- Includes
local g = require("src/globals")

-- ModCallbacks.MC_NPC_UPDATE (0)
function NPCUpdate:Main(npc)
  -- Local variables
  local data = npc:GetData()
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- This callback will see NPCs on frame 0

  if baby.name == "Zombie Baby" and -- 61
     npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29

    -- Brings back enemies from the dead
    -- Reapply the fade on every frame because enemies can be unfaded occasionally
    local color = npc:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
    -- (for some reason, in this callback, RO, GO, and BO will be float values,
    -- but the Color constructor only wants integers, so manually use 0 for these 3 values instead of the existing ones)
    npc:SetColor(newColor, 0, 0, true, true)

  elseif baby.name == "Hooligan Baby" and -- 514
         npc.FrameCount == 0 and
         npc.Type ~= EntityType.ENTITY_FIREPLACE and -- 33
         npc.Type ~= EntityType.ENTITY_SHOPKEEPER and -- 17
         data.duplicated == nil then

    -- Double enemies
    -- (if we do this in the MC_POST_NPC_INIT callback, some positions are not yet initialized,
    -- so we do it here instead)
    NPCUpdate:Baby514(npc)
  end
end

function NPCUpdate:Baby514(npc)
  -- Local variables
  local player = g.g:GetPlayer(0)

  -- Doubling certain enemies leads to bugs
  if npc.Type == EntityType.ENTITY_CHUB or -- 28
     npc.Type == EntityType.ENTITY_FIREPLACE or -- 33
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
     npc.Type == EntityType.ENTITY_SWARM or -- 281
     npc.Type == EntityType.ENTITY_PITFALL then -- 291

    return
  end

  if g.run.babyBool == false then
    g.run.babyBool = true
    local position = g.r:FindFreePickupSpawnPosition(npc.Position, 1, true)
    if g:InsideSquare(position, player.Position, 15) == false then
      local newNPC = g.g:Spawn(npc.Type, npc.Variant, position, npc.Velocity, npc, npc.SubType, npc.InitSeed)
      newNPC:GetData().duplicated = true
    end
    g.run.babyBool = false
  end
end

return NPCUpdate
