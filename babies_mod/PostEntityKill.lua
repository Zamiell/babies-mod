local PostEntityKill = {}

-- Includes
local g = require("babies_mod/globals")

-- ModCallbacks.MC_POST_ENTITY_KILL (68)
function PostEntityKill:Main(entity)
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  -- We only care if an actual enemy dies
  local npc = entity:ToNPC()
  if npc == nil then
    return
  end

  local babyFunc = PostEntityKill.functions[type]
  if babyFunc ~= nil then
    babyFunc(npc)
  end
end

-- The collection of functions for each baby
PostEntityKill.functions = {}

-- Black Baby
PostEntityKill.functions[27] = function(npc)
  -- We don't want to clear the room too fast after an enemy dies
  g.run.roomClearDelayFrame = g.g:GetFrameCount() + 1
end

-- Brown Baby
PostEntityKill.functions[38] = function(npc)
  -- Spawns a poop per enemy killed
  Isaac.GridSpawn(GridEntityType.GRID_POOP, PoopVariant.POOP_NORMAL, npc.Position, false) -- 14.0
end

-- Whore Baby
PostEntityKill.functions[43] = function(npc)
  -- Local variables
  local roomIndex = g.l:GetCurrentRoomDesc().SafeGridIndex
  if roomIndex < 0 then -- SafeGridIndex is always -1 for rooms outside the grid
    roomIndex = g.l:GetCurrentRoomIndex()
  end

  -- All enemies explode
  -- We cannot explode enemies in the MC_POST_ENTITY_KILL callback due to a crash having to do with black hearts
  -- So, mark to explode in the MC_POST_UPDATE callback
  g.run.babyCounters[#g.run.babyCounters + 1] = {
    roomIndex = roomIndex,
    position  = npc.Position,
  }
end

-- Zombie Baby
PostEntityKill.functions[61] = function(npc)
  if not npc:IsBoss() and
     npc.Type ~= EntityType.ENTITY_MOVABLE_TNT and -- 292
     not npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then-- 1 << 29

    local friend = g.g:Spawn(npc.Type, npc.Variant, npc.Position, g.zeroVector, nil, npc.SubType, npc.InitSeed)
    friend:AddEntityFlags(EntityFlag.FLAG_CHARM) -- 1 << 8
    friend:AddEntityFlags(EntityFlag.FLAG_FRIENDLY) -- 1 << 29
    friend:AddEntityFlags(EntityFlag.FLAG_PERSISTENT) -- 1 << 37

    -- Fade the entity so that it is easier to see everything
    -- (this is also reapplied on every frame because enemies can be unfaded occasionally)
    local color = friend:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    friend:SetColor(newColor, 0, 0, true, true)
  end
end

-- Nerd Baby
PostEntityKill.functions[90] = function(npc)
  -- We don't want to clear the room too fast after an enemy dies
  g.run.roomClearDelayFrame = g.g:GetFrameCount() + 1
end

-- Turd Baby
PostEntityKill.functions[92] = function(npc)
  g.g:Fart(npc.Position, 80, npc, 1, 0)
end

-- Love Eye Baby
PostEntityKill.functions[249] = function(npc)
  if g.run.babyBool then
    return
  end
  g.run.babyBool = true

  -- Store the killed enemy
  g.run.babyNPC = {
    type    = npc.Type,
    variant = npc.Variant,
    subType = npc.SubType,
  }

  -- Respawn all of the existing enemies in the room
  for _, entity2 in ipairs(Isaac.GetRoomEntities()) do
    local npc2 = entity2:ToNPC()
    if npc2 ~= nil and
        npc2.Index ~= npc.Index then -- Don't respawn the entity that just died

      g.g:Spawn(npc.Type, npc.Variant, npc2.Position, npc2.Velocity, nil, npc.SubType, npc2.InitSeed)
      npc2:Remove()
    end
  end
end

-- Killer Baby
PostEntityKill.functions[291] = function(npc)
  g.run.babyCounters = g.run.babyCounters + 1
  g.p:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
  g.p:EvaluateItems()
end

-- Dino Baby
PostEntityKill.functions[376] = function(npc)
  -- Don't bother giving another egg if we already have a bunch
  local brains = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, -1, false, false) -- 3.59
  if #brains >= 6 then
    return
  end

  -- Spawn a new Bob's Brain familiar that we will reskin to look like an egg
  local brain = Isaac.Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, 0, -- 3.59
                            g.p.Position, g.zeroVector, nil)
  local brainSprite = brain:GetSprite()
  brainSprite:Load("gfx/003.059_bobs brain2.anm2", true)
  brainSprite:Play("Idle", true)
end

-- Blue Wrestler Baby
PostEntityKill.functions[388] = function(npc)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]

  -- Enemies spawn projectiles upon death
  -- Mark to fire some tears one frame at a time
  g.run.babyTears[#g.run.babyTears + 1] = {
    position = npc.Position,
    num = baby.num,
  }
end

-- Toast Baby
PostEntityKill.functions[390] = function(npc)
  -- Enemies leave a Red Candle fire upon death
  Isaac.Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, 0, -- 1000.51
              npc.Position, g.zeroVector, nil)
end

-- Buttface Baby
PostEntityKill.functions[451] = function(npc)
  Isaac.GridSpawn(GridEntityType.GRID_POOP, PoopVariant.POOP_BLACK, npc.Position, false) -- 14.5
end

-- Funny Baby
PostEntityKill.functions[491] = function(npc)
  Isaac.Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, 0, -- 4.5
              npc.Position, g.zeroVector, nil)
end

-- Rainbow Baby
PostEntityKill.functions[530] = function(npc)
  g.g:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, -- 5.50
            npc.Position, g.zeroVector, nil, 0, npc.InitSeed)
end

return PostEntityKill
