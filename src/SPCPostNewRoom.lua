local SPCPostNewRoom = {}

-- Includes
local SPCGlobals    = require("src/spcglobals")
local SPCPostRender = require("src/spcpostrender")

-- ModCallbacks.MC_POST_NEW_ROOM (19)
function SPCPostNewRoom:Main()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local level = game:GetLevel()
  local stage = level:GetStage()
  local stageType = level:GetStageType()

  Isaac.DebugString("MC_POST_NEW_ROOM (SPC)")

  -- Make sure the callbacks run in the right order
  -- (naturally, PostNewRoom gets called before the PostNewLevel and PostGameStarted callbacks)
  if gameFrameCount == 0 or
     (SPCGlobals.run.currentFloor ~= stage or
      SPCGlobals.run.currentFloorType ~= stageType) then

    return
  end

  SPCPostNewRoom:NewRoom()
end

function SPCPostNewRoom:NewRoom()
  -- Local variabbles
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local roomSeed = room:GetSpawnSeed()

  Isaac.DebugString("MC_POST_NEW_ROOM2 (SPC)")

  -- Reset room variables
  SPCGlobals.run.roomClear = roomClear
  SPCGlobals.run.roomRNG = roomSeed
  SPCGlobals.run.sisterMaggyCounter = 0

  -- Do nothing if we are not a baby
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]
  if baby == nil then
    return
  end

  -- Reset the player's sprite, just in case it got messed up
  SPCPostRender:SetPlayerSprite()

  -- Stop drawing the baby intro text once the player goes into a new room
  if SPCGlobals.run.drawIntro then
    SPCGlobals.run.drawIntro = false
  end

  SPCPostNewRoom:ApplyTemporaryEffects()
end

function SPCPostNewRoom:ApplyTemporaryEffects()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local effects = player:GetEffects()
  local type = SPCGlobals.run.babyType
  local baby = SPCGlobals.babies[type]

  -- Apply baby-specific temporary effects
  if baby.name == "Cy-Baby" then -- 16
    -- Spawn a laser ring around the player
    local laser = player:FireTechXLaser(player.Position, Vector(0,0), 66):ToLaser() -- The third argument is the radius
    -- (we copy the radius from Samael's Tech X ability)
    if laser.Variant ~= 2 then
      laser.Variant = 2
      laser.SpriteScale = Vector(0.5, 1)
    end
    laser.TearFlags = laser.TearFlags | TearFlags.TEAR_CONTINUUM -- 1 << 36
    laser.CollisionDamage = laser.CollisionDamage * 0.66
    local data = laser:GetData()
    data.ring = true

  elseif baby.name == "Belial Baby" then -- 51
    effects:AddCollectibleEffect(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, false) -- 34

  elseif baby.name == "Butterfly Baby 2" then -- 332
    player.GridCollisionClass = 0

  elseif baby.name == "Gamer Baby" then -- 492
    player:UsePill(PillEffect.PILLEFFECT_RETRO_VISION, PillColor.PILL_NULL) -- 37, 0
    player:StopExtraAnimation()

  elseif baby.name == "Psychic Baby" then -- 504
    -- Get Abel
    local entities = Isaac.FindByType(EntityType.ENTITY_FAMILIAR, FamiliarVariant.ABEL, -1, false, false) -- 5.8

    -- Disable the vanilla shooting behavior
    entities[1]:ToFamiliar().FireCooldown = 1000000

  elseif baby.name == "Silly Baby" then -- 516
    player:UsePill(PillEffect.PILLEFFECT_IM_EXCITED, PillColor.PILL_NULL) -- 42, 0
    player:StopExtraAnimation()

  elseif baby.name == "Brother Bobby" then -- 522
    local godheadTear = player:FireTear(player.Position, Vector(0, 0), false, true, false)
    godheadTear.TearFlags = TearFlags.TEAR_GLOW -- 1 << 32
    godheadTear.SubType = 1
    local sprite = godheadTear:GetSprite()
    sprite:Load("gfx/tear_blank.anm2", true)
    sprite:Play("RegularTear6")
  end
end

return SPCPostNewRoom
