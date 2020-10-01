local NPCUpdate = {}

-- Note: This callback only fires on frame 1 and onwards

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_NPC_UPDATE (0)
-- This callback will fire on frame 0
function NPCUpdate:Main(npc)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  local babyFunc = NPCUpdate.functions[type]
  if babyFunc ~= nil then
    return babyFunc(npc)
  end
end

-- The collection of functions for each baby
NPCUpdate.functions = {}

-- Zombie Baby
NPCUpdate.functions[61] = function(npc)
  -- Brings back enemies from the dead
  -- Reapply the fade on every frame because enemies can be unfaded occasionally
  if npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then -- 1 << 29
    local color = npc:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, 0, 0, 0)
    -- (for some reason, in this callback, RO, GO, and BO will be float values,
    -- but the Color constructor only wants integers,
    -- so manually use 0 for these 3 values instead of the existing ones)
    npc:SetColor(newColor, 0, 0, true, true)
  end
end

-- Hooligan Baby
NPCUpdate.functions[514] = function(npc)
  -- Double enemies
  -- (if we do this in the MC_POST_NPC_INIT callback, some positions are not yet initialized,
  -- so we do it here instead)
  if (
    npc.FrameCount ~= 0
    or npc:GetData().duplicated ~= nil
    -- Doubling certain enemies leads to bugs
    or npc.Type == EntityType.ENTITY_SHOPKEEPER -- 17
    or npc.Type == EntityType.ENTITY_CHUB -- 28
    or npc.Type == EntityType.ENTITY_FIREPLACE -- 33
    or npc.Type == EntityType.ENTITY_STONEHEAD -- 42
    or npc.Type == EntityType.ENTITY_POKY -- 44
    or npc.Type == EntityType.ENTITY_MOM -- 45
    or npc.Type == EntityType.ENTITY_MOMS_HEART -- 78
    or (npc.Type == EntityType.ENTITY_GEMINI and npc.Variant >= 10) -- 79
    or npc.Type == EntityType.ENTITY_ETERNALFLY -- 96
    or npc.Type == EntityType.ENTITY_ISAAC -- 102
    or npc.Type == EntityType.ENTITY_CONSTANT_STONE_SHOOTER -- 202
    or npc.Type == EntityType.ENTITY_BRIMSTONE_HEAD -- 203
    or (npc.Type == EntityType.ENTITY_SWINGER and npc.Variant > 0) -- 216
    or npc.Type == EntityType.ENTITY_WALL_HUGGER -- 218
    or npc.Type == EntityType.ENTITY_GAPING_MAW -- 235
    or npc.Type == EntityType.ENTITY_BROKEN_GAPING_MAW -- 236
    or npc.Type == EntityType.ENTITY_SWARM -- 281
    or npc.Type == EntityType.ENTITY_PITFALL -- 291
  ) then
    return
  end

  if not g.run.babyBool then
    g.run.babyBool = true
    local position = g.r:FindFreePickupSpawnPosition(npc.Position, 1, true)
    if position:Distance(g.p.Position) > 40 then
      local newNPC = g.g:Spawn(
        npc.Type,
        npc.Variant,
        position,
        npc.Velocity,
        npc,
        npc.SubType,
        npc.InitSeed
      )
      newNPC:GetData().duplicated = true
    end
    g.run.babyBool = false
  end
end

return NPCUpdate
