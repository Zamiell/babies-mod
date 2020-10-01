local FamiliarUpdate = {}

-- Includes
local g = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_FAMILIAR_UPDATE (6)
function FamiliarUpdate:Main(familiar)
  -- Local variables
  local babyType = g.run.babyType
  local baby = g.babies[babyType]
  if baby == nil then
    return
  end

  local babyFunc = FamiliarUpdate.functions[babyType]
  if babyFunc ~= nil then
    return babyFunc(familiar)
  end
end

-- The collection of functions for each baby
FamiliarUpdate.functions = {}

-- Lil' Baby
FamiliarUpdate.functions[36] = function(familiar)
  -- Everything is tiny
  -- For some reason, familiars reset their SpriteScale on every frame,
  -- so we have to constantly set it back
  familiar.SpriteScale = Vector(0.5, 0.5)
end

-- Big Baby
FamiliarUpdate.functions[37] = function(familiar)
  -- Everything is giant
  -- For some reason, familiars reset their SpriteScale on every frame,
  -- so we have to constantly set it back
  familiar.SpriteScale = Vector(2, 2)
end

-- Sucky Baby
FamiliarUpdate.functions[47] = function(familiar)
  -- Keep it locked on the player to emulate a Succubus aura
  if familiar.Variant == FamiliarVariant.SUCCUBUS then -- 96
    familiar.Position = g.p.Position
  end
end

-- Gurdy Baby
FamiliarUpdate.functions[82] = function(familiar)
  -- All of the Gurdies will stack on top of each other, so manually keep them spread apart
  if familiar.Variant == FamiliarVariant.LIL_GURDY then -- 87
    local lilGurdies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR, -- 3
      FamiliarVariant.LIL_GURDY, -- 87
      -1,
      false,
      false
    )
    for _, lilGurdy in ipairs(lilGurdies) do
      if (
        familiar.Position:Distance(lilGurdy.Position) <= 1
        -- Use the index as a priority of which familiar is forced to move away
        and familiar.Index < lilGurdy.Index
      ) then
          lilGurdy.Position = Misc:GetOffsetPosition(lilGurdy.Position, 7, lilGurdy.InitSeed)
      end
    end
  end
end

-- Geek Baby
FamiliarUpdate.functions[326] = function(familiar)
  -- All of the babies will stack on top of each other, so manually keep them spread apart
  if familiar.Variant == FamiliarVariant.ROBO_BABY_2 then -- 53
    local roboBabies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR, -- 3
      FamiliarVariant.ROBO_BABY_2, -- 53
      -1,
      false,
      false
    )
    for _, roboBaby in ipairs(roboBabies) do
      if (
        familiar.Position:Distance(roboBaby.Position) <= 1
        -- Use the index as a priority of which Gurdy is forced to move away
        and familiar.Index < roboBaby.Index
      ) then
          roboBaby.Position = Misc:GetOffsetPosition(roboBaby.Position, 7, roboBaby.InitSeed)
      end
    end
  end
end

-- Dino Baby
FamiliarUpdate.functions[376] = function(familiar)
  if (
    familiar.Variant == FamiliarVariant.BOBS_BRAIN -- 59
    and familiar.SubType == 1 -- Bob's Brain familiars have a SubType of 1 after they explode
  ) then
    familiar:Remove()
  end
end

-- Pixie Baby
FamiliarUpdate.functions[403] = function(familiar)
  -- Speed it up
  if (
    familiar.Variant == FamiliarVariant.YO_LISTEN -- 111
    and familiar.FrameCount % 5 == 0
  ) then
    familiar.Velocity = familiar.Velocity * 2
  end
end

-- Graven Baby
FamiliarUpdate.functions[453] = function(familiar)
  -- Speed it up
  if (
    familiar.Variant == FamiliarVariant.BUMBO -- 88
    and familiar.FrameCount % 5 == 0
  ) then
    familiar.Velocity = familiar.Velocity * 2
  end
end

-- Seraphim
FamiliarUpdate.functions[538] = function(familiar)
  if familiar.Variant == FamiliarVariant.CENSER then -- 89
    familiar.Position = g.p.Position
    local sprite = familiar:GetSprite()
    sprite:Load("gfx/003.089_censer_invisible.anm2", true)
    sprite:Play("Idle")
  end
end

return FamiliarUpdate
