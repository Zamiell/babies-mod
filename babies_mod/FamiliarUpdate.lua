local FamiliarUpdate = {}

-- Includes
local g    = require("babies_mod/globals")
local Misc = require("babies_mod/misc")

-- ModCallbacks.MC_FAMILIAR_UPDATE (6)
function FamiliarUpdate:Main(familiar)
  -- Local variables
  local type = g.run.babyType
  local baby = g.babies[type]
  if baby == nil then
    return
  end

  if baby.name == "Lil' Baby" then -- 36
    -- Everything is tiny
    -- For some reason, familiars reset their SpriteScale on every frame, so we have to constantly set it back
    familiar.SpriteScale = Vector(0.5, 0.5)

  elseif baby.name == "Big Baby" then -- 37
    -- Everything is giant
    -- For some reason, familiars reset their SpriteScale on every frame, so we have to constantly set it back
    familiar.SpriteScale = Vector(2, 2)

  elseif baby.name == "Sucky Baby" and -- 48
         familiar.Variant == FamiliarVariant.SUCCUBUS then -- 96

    -- Keep it locked on the player to emulate a Succubus aura
    familiar.Position = g.p.Position

  elseif baby.name == "Gurdy Baby" and -- 82
         familiar.Variant == FamiliarVariant.LIL_GURDY then -- 87

    -- All of the familiars will stack on top of each other, so manually keep them spread apart
    local gurdies = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.LIL_GURDY, -1, false, false) -- 3.87
    for _, gurdy in ipairs(gurdies) do
      if familiar.Position:Distance(gurdy.Position) <= 1 and
         familiar.Index < gurdy.Index then -- Use the index as a priority of which familiar is forced to move away

          gurdy.Position = Misc:GetOffsetPosition(gurdy.Position, 7, gurdy.InitSeed)
      end
    end

  elseif baby.name == "Geek Baby" and -- 326
         familiar.Variant == FamiliarVariant.ROBO_BABY_2 then -- 53

    -- All of the familiars will stack on top of each other, so manually keep them spread apart
    local roboBabies = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ROBO_BABY_2, -- 3.53
                                        -1, false, false)
    for _, roboBaby in ipairs(roboBabies) do
      if familiar.Position:Distance(roboBaby.Position) <= 1 and
         familiar.Index < roboBaby.Index then -- Use the index as a priority of which Gurdy is forced to move away

          roboBaby.Position = Misc:GetOffsetPosition(roboBaby.Position, 7, roboBaby.InitSeed)
      end
    end

  elseif baby.name == "Dino Baby" and -- 376
         familiar.Variant == FamiliarVariant.BOBS_BRAIN and -- 59
         familiar.SubType == 1 then -- Bob's Brain familiars have a SubType of 1 after they explode

    familiar:Remove()

  elseif baby.name == "Pixie Baby" and -- 403
         familiar.Variant == FamiliarVariant.YO_LISTEN and -- 111
         familiar.FrameCount % 5 == 0 then

    -- Speed it up
    familiar.Velocity = familiar.Velocity * 2

  elseif baby.name == "Seraphim" and -- 538
         familiar.Variant == FamiliarVariant.CENSER then -- 89

    familiar.Position = g.p.Position
    local sprite = familiar:GetSprite()
    sprite:Load("gfx/003.089_censer_invisible.anm2", true)
    sprite:Play("Idle")

  elseif baby.name == "Graven Baby" and -- 453
         familiar.Variant == FamiliarVariant.BUMBO and -- 88
         familiar.FrameCount % 5 == 0 then

    -- Speed it up
    familiar.Velocity = familiar.Velocity * 2
  end
end

return FamiliarUpdate
