local SPCPostEntityKill = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_ENTITY_KILL (68)
function SPCPostEntityKill:Main(entity)
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- We only care if an actual enemy dies
  local npc = entity:ToNPC()
  if npc == nil then
    return
  end

  if baby.name == "Black Baby" then -- 27
    -- We don't want to clear the room too fast after an enemy dies
    SPCGlobals.run.roomClearDelayFrame = gameFrameCount + 1

  elseif baby.name == "Brown Baby" then -- 38
    -- Spawns a poop per enemy killed
    Isaac.GridSpawn(GridEntityType.GRID_POOP, PoopVariant.POOP_NORMAL, npc.Position, false) -- 14.0

  elseif baby.name == "Whore Baby" then -- 43
    -- All enemies explode
    Isaac.DebugString("Explode NPC: " .. tostring(npc.Type) .. "." .. tostring(npc.Variant) .. "." ..
                      tostring(npc.SubType) .. ", boss: " .. tostring(npc:IsBoss()))
    Isaac.Explode(npc.Position, nil, 50) -- 49 deals 1 half heart of damage
    Isaac.DebugString("After explode.")

  elseif baby.name == "Zombie Baby" and -- 61
         npc:IsBoss() == false and
         npc.Type ~= EntityType.ENTITY_MOVABLE_TNT and -- 292
         npc:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) == false then-- 1 << 29

    local friend = game:Spawn(npc.Type, npc.Variant, npc.Position, Vector(0, 0), nil, npc.SubType, npc.InitSeed)
    friend:AddEntityFlags(EntityFlag.FLAG_CHARM) -- 1 << 8
    friend:AddEntityFlags(EntityFlag.FLAG_FRIENDLY) -- 1 << 29
    friend:AddEntityFlags(EntityFlag.FLAG_PERSISTENT) -- 1 << 37

    -- Fade the entity so that it is easier to see everything
    -- (this is also reapplied on every frame because enemies can be unfaded occasionally)
    local color = friend:GetColor()
    local fadeAmount = 0.25
    local newColor = Color(color.R, color.G, color.B, fadeAmount, color.RO, color.GO, color.BO)
    friend:SetColor(newColor, 0, 0, true, true)

  elseif baby.name == "Nerd Baby" then -- 90
    -- We don't want to clear the room too fast after an enemy dies
    SPCGlobals.run.roomClearDelayFrame = gameFrameCount + 1

  elseif baby.name == "Turd Baby" then -- 92
    game:Fart(npc.Position, 80, npc, 1, 0)

  elseif baby.name == "Love Eye Baby" and -- 249
         SPCGlobals.run.babyBool == false then

    SPCGlobals.run.babyBool = true

    -- Store the killed enemy
    SPCGlobals.run.babyNPC = {
      type    = npc.Type,
      variant = npc.Variant,
      subType = npc.SubType,
    }

    -- Respawn all of the existing enemies in the room
    for i, entity2 in pairs(Isaac.GetRoomEntities()) do
      local npc2 = entity2:ToNPC()
      if npc2 ~= nil and
         npc2.Index ~= npc.Index then -- Don't respawn the entity that just died

        game:Spawn(npc.Type, npc.Variant, npc2.Position, npc2.Velocity, nil, npc.SubType, npc2.InitSeed)
        npc2:Remove()
      end
    end

  elseif baby.name == "Killer Baby" then -- 291
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:EvaluateItems()

  elseif baby.name == "Dino Baby" then -- 376
    -- Don't bother giving another egg if we already have a bunch
    local numBrains = 0
    for i, entity2 in pairs(Isaac.GetRoomEntities()) do
      if entity2.Type == EntityType.ENTITY_FAMILIAR and -- 3
         entity2.Variant == FamiliarVariant.BOBS_BRAIN and -- 59
         entity2.SubType ~= 1 then -- It has a SubType of 1 after it explodes
         -- (don't count Bob's Brains that are already exploded since they will be removed on the next frame)

        numBrains = numBrains + 1
      end
    end
    if numBrains >= 6 then
      return
    end

    -- Spawn a new Bob's Brain familiar that we will reskin to look like an egg
    local brain = game:Spawn(EntityType.ENTITY_FAMILIAR, FamiliarVariant.BOBS_BRAIN, -- 3.59
                  player.Position, Vector(0, 0), nil, 0, 0)
    local brainSprite = brain:GetSprite()
    brainSprite:Load("gfx/003.059_bobs brain2.anm2", true)
    brainSprite:Play("Idle", true)

  elseif baby.name == "Blue Wrestler Baby" then -- 388
    -- Enemies spawn projectiles upon death
    -- Mark to fire some tears one frame at a time
    SPCGlobals.run.babyTears[#SPCGlobals.run.babyTears + 1] = {
      position = npc.Position,
      num = baby.num,
    }

  elseif baby.name == "Toast Baby" then -- 390
    -- Enemies leave a Red Candle fire upon death
    game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.HOT_BOMB_FIRE, -- 1000.51
               npc.Position, Vector(0, 0), nil, 0, 0)

  elseif baby.name == "Buttface Baby" then -- 451
    Isaac.GridSpawn(GridEntityType.GRID_POOP, PoopVariant.POOP_BLACK, npc.Position, false) -- 14.5

  elseif baby.name == "Funny Baby" then -- 491
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, -- 4.5
               npc.Position, Vector(0, 0), nil, 0, 0)

  elseif baby.name == "Rainbow Baby" then -- 530
    game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_CHEST, -- 5.50
               npc.Position, Vector(0, 0), nil, 0, npc.InitSeed)
  end
end

return SPCPostEntityKill
