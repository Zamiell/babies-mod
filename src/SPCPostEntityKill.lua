local SPCPostEntityKill = {}

-- Includes
local SPCGlobals = require("src/spcglobals")

-- ModCallbacks.MC_POST_ENTITY_KILL (68)
function SPCPostEntityKill:Main(entity)
  -- Local variables
  local game = Game()
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

  if baby.name == "Killer Baby" then -- 291
    SPCGlobals.run.killerBabyCounter = SPCGlobals.run.killerBabyCounter + 1
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
  end
end

return SPCPostEntityKill
