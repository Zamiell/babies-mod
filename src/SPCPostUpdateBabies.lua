local SPCPostUpdateBabies = {}

-- Includes
local SPCGlobals         = require("src/spcglobals")
local SPCPostRender      = require("src/spcpostrender")
local SPCPseudoRoomClear = require("src/spcpseudoroomclear")

-- Called from the MC_POST_UPDATE (1) callback
function SPCPostUpdateBabies:Main()
  -- Local variables
  local type = SPCGlobals.run.babyType
  if SPCPostUpdateBabies.functions[type] ~= nil then
    SPCPostUpdateBabies.functions[type]()
  end
end

-- The collection of functions for each baby effect
SPCPostUpdateBabies.functions = {}

-- Troll Baby
SPCPostUpdateBabies.functions[6] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 90 == 0 then -- 3 seconds
    -- Spawn a Troll Bomb (4.3)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_TROLL, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Wrath Baby
SPCPostUpdateBabies.functions[19] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ANARCHIST_COOKBOOK, false, false, false, false) -- 65
  end
end

-- Wrapped Baby
SPCPostUpdateBabies.functions[20] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 and -- If the explosions happen too fast, it looks buggy
     SPCGlobals.run.babyCounters > 0 then

    -- This should not cause any damage since the player will have invulnerability frames
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1
    player:UseActiveItem(CollectibleType.COLLECTIBLE_KAMIKAZE, false, false, false, false) -- 40
  end
end

-- Fighting Baby
SPCPostUpdateBabies.functions[23] = function()
  -- Local variables
  local game = Game()

  -- Broken machines drop pedestal items
  -- (there is no MC_POST_SLOT_UPDATE callback so we have to do this here)
  local entities = Isaac.FindByType(EntityType.ENTITY_SLOT, -1, -1, false, false) -- 6
  for i = 1, #entities do
    local entity = entities[i]
    local sprite = entity:GetSprite()
    local data = entity:GetData()
    if sprite:IsPlaying("Broken") and
       data.destroyed == nil then

      data.destroyed = true
      SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
      game:Spawn(EntityType.ENTITY_PICKUP, PickupVariant.PICKUP_COLLECTIBLE, -- 5.100
                 entity.Position, Vector(0, 0), nil, 0, SPCGlobals.run.randomSeed)
    end
  end
end

-- Black Baby
SPCPostUpdateBabies.functions[27] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Dark Baby
SPCPostUpdateBabies.functions[48] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 seconds
    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    if SPCGlobals.run.babyCounters == 2 then
      -- Put out the lights
      SPCGlobals.run.babySprite = Sprite()
      SPCGlobals.run.babySprite:Load("gfx/misc/black.anm2", true)
      SPCGlobals.run.babySprite:SetFrame("Default", 0)
    elseif SPCGlobals.run.babyCounters == 3 then
      -- Turn on the lights
      SPCGlobals.run.babyCounters = 0
      SPCGlobals.run.babySprite = nil
    end
  end
end

-- Bound Baby
SPCPostUpdateBabies.functions[58] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS, false, false, false, false) -- 357
  end
end

-- Butthole Baby
SPCPostUpdateBabies.functions[63] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a random poop
    SPCGlobals.run.randomSeed = SPCGlobals:IncrementRNG(SPCGlobals.run.randomSeed)
    math.randomseed(SPCGlobals.run.randomSeed)
    local poopVariant = math.random(0, 6)
    if poopVariant == PoopVariant.POOP_RED or -- 1
       poopVariant == PoopVariant.POOP_CORN then -- 2

      -- If the poop is this type, then it will instantly damage the player, so give them some invulnerability frames
      SPCGlobals.run.invulnerabilityFrame = gameFrameCount + 25
    end
    Isaac.GridSpawn(GridEntityType.GRID_POOP, poopVariant, player.Position, false) -- 14

    -- Playing ID 37 will randomly play one of the three farting sound effects
    sfx:Play(SoundEffect.SOUND_FART, 1, 0, false, 1) -- 37
  end
end

-- Mustache Baby
SPCPostUpdateBabies.functions[66] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  -- Using the boomerang removes the charge on the current active item for some reason,
  -- so we have to restore it on the next frame
  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
    player:SetActiveCharge(SPCGlobals.run.babyCounters)
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
    sfx:Stop(SoundEffect.SOUND_BEEP) -- 171
    SPCGlobals.run.babyCounters = 0
  end
end

-- Bloodsucker Baby
SPCPostUpdateBabies.functions[87] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- This does not work if we put it in the MC_POST_NEW_LEVEL callback for some reason
  if player.SpriteScale.X > 0.5 or
     player.SpriteScale.Y > 0.5 then

    player.SpriteScale = Vector(0.5, 0.5)
  end
end

-- Nerd Baby
SPCPostUpdateBabies.functions[90] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Frown Baby
SPCPostUpdateBabies.functions[96] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEST_FRIEND, false, false, false, false) -- 136
  end
end

-- Pubic Baby
SPCPostUpdateBabies.functions[110] = function()
  -- Local variables
  local game = Game()
  local level = game:GetLevel()
  local rooms = level:GetRooms()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Don't do anything if we already full cleared the floor
  if SPCGlobals.run.babyBool then
    return
  end

  -- The doors are not open because the room is not yet cleared
  if roomClear == false then
    return
  end

  -- Check to see if the floor is full cleared
  local allCleared = true
  for i = 0, rooms.Size - 1 do -- This is 0 indexed
    local roomDesc = rooms:Get(i)
    local roomData = roomDesc.Data
    local roomType2 = roomData.Type
    if roomType2 == RoomType.ROOM_DEFAULT and -- 1
       roomDesc.Clear == false then

      allCleared = false
      break
    end
  end
  if allCleared then
    SPCGlobals.run.babyBool = true
    return
  end

  -- Keep the boss room door closed
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil and
       door:IsRoomType(RoomType.ROOM_BOSS) then -- 5

      door:Bar()
    end
  end
end

-- Eyemouth Baby
SPCPostUpdateBabies.functions[111] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTearInfo.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTearInfo.frame then

    SPCGlobals.run.babyTearInfo.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTearInfo.velocity, false, true, false)
  end
end

-- Hopeless Baby
SPCPostUpdateBabies.functions[125] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local keys = player:GetNumKeys()

  -- Keys are hearts
  if keys == 0 then
    player:Kill()
  end
end

-- Mohawk Baby
SPCPostUpdateBabies.functions[138] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local bombs = player:GetNumBombs()

  -- Bombs are hearts
  if bombs == 0 then
    player:Kill()
  end
end

-- Rotten Meat Baby
SPCPostUpdateBabies.functions[139] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BUTTER_BEAN, false, false, false, false) -- 294
  end
end

-- Awaken Baby
SPCPostUpdateBabies.functions[155] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_TELEKINESIS, false, false, false, false) -- 522
  end
end

-- Puff Baby
SPCPostUpdateBabies.functions[156] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MEGA_BEAN, false, false, false, false) -- 351
  end
end

-- Pretty Baby
SPCPostUpdateBabies.functions[158] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTER_MANUAL, false, false, false, false) -- 123
    sfx:Stop(SoundEffect.SOUND_SATAN_GROW) -- 241
  end
end

-- Digital Baby
SPCPostUpdateBabies.functions[162] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local seeds = game:GetSeeds()

  if SPCGlobals.run.babyBool == false and
     roomFrameCount <= 1 then

    SPCGlobals.run.babyBool = true

    -- This baby grants SeedEffect.SEED_OLD_TV (8)
    -- However, applying this in the MC_POST_NEW_LEVEL callback can cause game crashes
    -- Instead, we manually apply it in the MC_POST_UPDATE callback
    seeds:AddSeedEffect(SeedEffect.SEED_OLD_TV) -- 8
  end
end

-- Bawl Baby
SPCPostUpdateBabies.functions[231] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 then
    SPCGlobals.run.babyBool = true
    player:UseActiveItem(CollectibleType.COLLECTIBLE_ISAACS_TEARS, false, false, false, false) -- 323
    SPCGlobals.run.babyBool = false
  end
end

-- Medusa Baby
SPCPostUpdateBabies.functions[250] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local bombs = player:GetNumBombs()
  local keys = player:GetNumKeys()

  -- Coins convert to bombs and keys
  if bombs == 0 and
     player:GetNumCoins() > 0 then

    player:AddCoins(-1)
    player:AddBombs(1)
  end
  if keys == 0 and
    player:GetNumCoins() > 0 then

    player:AddCoins(-1)
    player:AddKeys(1)
  end
end

-- Cloud Baby
SPCPostUpdateBabies.functions[256] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local baby = SPCGlobals.babies[256]

  if gameFrameCount % baby.num == 0 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_VENTRICLE_RAZOR, false, false, false, false) -- 396
  end
end

-- Raccoon Baby
SPCPostUpdateBabies.functions[263] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Reroll all of the rocks in the room
  -- (this does not work if we do it in the MC_POST_NEW_ROOM callback or on the 0th frame)
  if roomFrameCount == 1 and
     room:IsFirstVisit() then

    player:UseActiveItem(CollectibleType.COLLECTIBLE_D12, false, false, false, false) -- 386
  end
end

-- Porcupine Baby
SPCPostUpdateBabies.functions[270] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_WAIT_WHAT, false, false, false, false) -- 484
  end
end

-- Heart Baby
SPCPostUpdateBabies.functions[290] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)
  local sfx = SFXManager()

  if gameFrameCount % 150 == 0 then -- 5 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DULL_RAZOR, false, false, false, false) -- 486
    sfx:Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) -- 55
  end
end

-- Rider Baby
SPCPostUpdateBabies.functions[295] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local sfx = SFXManager()

  if activeItem == CollectibleType.COLLECTIBLE_PONY and -- 130
     player:NeedsCharge() then

    -- Keep the pony fully charged
    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Pizza Baby
SPCPostUpdateBabies.functions[303] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
    SPCGlobals.run.babyFrame = gameFrameCount + SPCGlobals.babies[303].delay
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BROWN_NUGGET, false, false, false, false) -- 504
    if SPCGlobals.run.babyCounters == 19 then -- One is already spawned with the initial trigger
      SPCGlobals.run.babyCounters = 0
      SPCGlobals.run.babyFrame = 0
    end
  end
end

-- Hotdog Baby
SPCPostUpdateBabies.functions[304] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 3 == 0 then
    player:UseActiveItem(CollectibleType.COLLECTIBLE_BEAN, false, false, false, false) -- 111
  end
end

-- Corrupted Baby
SPCPostUpdateBabies.functions[307] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  -- Taking items/pickups causes damage (1/2)
  if player:IsItemQueueEmpty() == false then
    player:TakeDamage(1, 0, EntityRef(player), 0)
  end
end

-- Exploding Baby
SPCPostUpdateBabies.functions[320] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  -- Check to see if we need to reset the cooldown
  -- (after we used the Kamikaze! effect upon touching an obstacle)
  if SPCGlobals.run.babyFrame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyFrame then

    SPCGlobals.run.babyFrame = 0
  end
end

-- Hero Baby
SPCPostUpdateBabies.functions[336] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyBool then
    SPCGlobals.run.babyBool = false
    player:AddCacheFlags(CacheFlag.CACHE_DAMAGE) -- 1
    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

-- Vomit Baby
SPCPostUpdateBabies.functions[341] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  -- Moving when the timer reaches 0 causes damage
  local remainingTime = SPCGlobals.run.babyCounters - gameFrameCount
  if remainingTime <= 0 then
    SPCGlobals.run.babyCounters = gameFrameCount + SPCGlobals.babies[341].time -- Reset the timer

    if player.Velocity.X > 0.2 or
       player.Velocity.X < -0.2 or
       player.Velocity.Y > 0.2 or
       player.Velocity.Y < -0.2 then

      player:TakeDamage(1, 0, EntityRef(player), 0)
    end
  end
end

-- Fourtone Baby
SPCPostUpdateBabies.functions[348] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local activeItem = player:GetActiveItem()
  local sfx = SFXManager()

  if activeItem == CollectibleType.COLLECTIBLE_CANDLE and -- 164
     player:NeedsCharge() then

    -- Keep the Candle always fully charged
    player:FullCharge()
    sfx:Stop(SoundEffect.SOUND_BATTERYCHARGE) -- 170
  end
end

-- Grayscale Baby
SPCPostUpdateBabies.functions[349] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 300 == 0 then -- 10 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_DELIRIOUS, false, false, false, false) -- 510
    SPCPostRender:SetPlayerSprite()
  end
end

-- Mouse Baby
SPCPostUpdateBabies.functions[351] = function()
  SPCPseudoRoomClear:PostUpdate()
end

-- Pink Princess Baby
SPCPostUpdateBabies.functions[374] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  if gameFrameCount % 120 == 0 then -- 4 second
    -- Spawn a random stomp
    game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.MOM_FOOT_STOMP, -- 1000.29
               Isaac.GetRandomPosition(), Vector(0, 0), nil, 0, 0)
  end
end

-- Blue Pig Baby
SPCPostUpdateBabies.functions[382] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 then -- 5 seconds
    -- Spawn a Mega Troll Bomb (4.5)
    game:Spawn(EntityType.ENTITY_BOMBDROP, BombVariant.BOMB_SUPERTROLL, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Imp Baby
SPCPostUpdateBabies.functions[386] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local baby = SPCGlobals.babies[386]

  -- If we rotate the knives on every frame, then it spins too fast
  if gameFrameCount < SPCGlobals.run.babyFrame then
    return
  end

  SPCGlobals.run.babyFrame = SPCGlobals.run.babyFrame + baby.num

  -- Rotate through the four directions
  SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
  if SPCGlobals.run.babyCounters >= 8 then
    SPCGlobals.run.babyCounters = 4
  end
end

-- Blue Wrestler Baby
SPCPostUpdateBabies.functions[388] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)

  for i = 1, #SPCGlobals.run.shootTears do
    local tear = SPCGlobals.run.shootTears[i]
    local velocity = player.Position - tear.position
    velocity = velocity:Normalized() * 13
    game:Spawn(EntityType.ENTITY_PROJECTILE, ProjectileVariant.PROJECTILE_NORMAL, -- 9.0
               tear.position, velocity, nil, 0, 0)
    tear.num = tear.num - 1
    if tear.num == 0 then
      -- The dead enemy has shot all of its tears, so we remove the tracking element for it
      table.remove(SPCGlobals.run.shootTears, i)
    end
  end
end

-- Red Wrestler Baby
SPCPostUpdateBabies.functions[389] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local pill1 = player:GetPill(0)
  local pill2 = player:GetPill(1)

  if pill1 ~= PillColor.PILL_NULL or -- 0
     pill2 ~= PillColor.PILL_NULL then -- 0

    SPCGlobals.run.babyBool = true
  end
end

-- Plague Baby
SPCPostUpdateBabies.functions[396] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 5 == 0 then -- Every 5 frames
    -- Drip green creep
    local creep = game:Spawn(EntityType.ENTITY_EFFECT, EffectVariant.PLAYER_CREEP_GREEN, -- 53
                             player.Position, Vector(0, 0), player, 0, 0)
    creep:ToEffect().Timeout = 240
  end
end

-- Corgi Baby
SPCPostUpdateBabies.functions[401] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 45 == 0 then -- 1.5 seconds
    -- Spawn a Fly (13.0)
    game:Spawn(EntityType.ENTITY_FLY, 0, player.Position, Vector(0, 0), nil, 0, 0)
  end
end

-- Magic Cat Baby
SPCPostUpdateBabies.functions[428] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 30 == 0 then -- 1 second
    player:UseActiveItem(CollectibleType.COLLECTIBLE_KIDNEY_BEAN, false, false, false, false) -- 421
  end
end

-- Mutated Fish Baby
SPCPostUpdateBabies.functions[449] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if gameFrameCount % 210 == 0 then -- 7 seconds
    player:UseActiveItem(CollectibleType.COLLECTIBLE_SPRINKLER, false, false, false, false) -- 516
  end
end

-- Scoreboard Baby
SPCPostUpdateBabies.functions[474] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyCounters ~= 0 then
    local remainingTime = SPCGlobals.run.babyCounters - gameFrameCount
    if remainingTime <= 0 then
      SPCGlobals.run.babyCounters = 0
      player:Kill()
    end
  end
end

-- Cool Orange Baby
SPCPostUpdateBabies.functions[485] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()

  if gameFrameCount % 30 == 0 then -- 1 second
    -- Spawn a random rocket target
    local target = game:Spawn(EntityType.ENTITY_EFFECT, Isaac.GetEntityVariantByName("FetusBossTarget"), -- 1000
                              Isaac.GetRandomPosition(), Vector(0, 0), nil, 0, 0)
    local sprite = target:GetSprite()
    sprite:Play("Blink", true)
    -- Target and rocket behavior are handled in the MC_POST_EFFECT_UPDATE callback
  end
end

-- Mern Baby
SPCPostUpdateBabies.functions[500] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local player = game:GetPlayer(0)

  if SPCGlobals.run.babyTearInfo.frame ~= 0 and
     gameFrameCount >= SPCGlobals.run.babyTearInfo.frame then

    SPCGlobals.run.babyTearInfo.frame = 0
    player:FireTear(player.Position, SPCGlobals.run.babyTearInfo.velocity, false, true, false)
  end
end

-- Sausage Lover Baby
SPCPostUpdateBabies.functions[508] = function()
  -- Local variables
  local game = Game()
  local gameFrameCount = game:GetFrameCount()
  local room = game:GetRoom()
  local roomClear = room:IsClear()
  local player = game:GetPlayer(0)

  if gameFrameCount % 150 == 0 and -- 5 seconds
     roomClear == false then -- Monstro is unavoidable if he targets you

    player:UseActiveItem(CollectibleType.COLLECTIBLE_MONSTROS_TOOTH, false, false, false, false) -- 86
  end
end

-- Baggy Cap Baby
SPCPostUpdateBabies.functions[519] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomClear = room:IsClear()

  -- Check all of the doors
  if roomClear then
    return
  end

  -- Check to see if a door opened before the room was clear
  for i = 0, 7 do
    local door = room:GetDoor(i)
    if door ~= nil and
       door:IsOpen() then

      door:Close(true)
    end
  end
end

-- Twitchy Baby
SPCPostUpdateBabies.functions[511] = function()
  -- Local variables
  local game = Game()
  local player = game:GetPlayer(0)
  local gameFrameCount = game:GetFrameCount()
  local baby = SPCGlobals.babies[511]

  if gameFrameCount >= SPCGlobals.run.babyFrame then
    SPCGlobals.run.babyFrame = SPCGlobals.run.babyFrame + baby.num
    if SPCGlobals.run.babyBool then
      -- Tear rate is increasing
      SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters + 1
      if SPCGlobals.run.babyCounters == baby.max then
        SPCGlobals.run.babyBool = false
      end
    else
      -- Tear rate is decreasing
      SPCGlobals.run.babyCounters = SPCGlobals.run.babyCounters - 1
      if SPCGlobals.run.babyCounters == baby.min then
        SPCGlobals.run.babyBool = true
      end
    end

    player:AddCacheFlags(CacheFlag.CACHE_FIREDELAY) -- 2
    player:EvaluateItems()
  end
end

-- Invisible Baby
SPCPostUpdateBabies.functions[541] = function()
  -- Local variables
  local game = Game()
  local room = game:GetRoom()
  local roomFrameCount = room:GetFrameCount()
  local player = game:GetPlayer(0)

  if roomFrameCount == 1 then
    -- The sprite is a blank PNG, but we also want to remove the shadow
    -- Doing this in the MC_POST_NEW_ROOM callback (or on frame 0) won't work
    player.Visible = false
  end
end

return SPCPostUpdateBabies
