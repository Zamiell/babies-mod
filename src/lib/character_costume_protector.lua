--Character Costume Protector by Sanio! (Sanio46 on Steam and Twitter)
--This local library has the goal of protecting the unique looks of custom characters that regularly
--interfere with how costumes look while allowing customization between different characters with ease.

--For any questions, contact Sanio or leave a comment under the workshop upload, preferably the latter.

local costumeProtector = {}
local game = Game()

local playerToProtect = {}
local playerCostume = {}
local playerSpritesheet = {}
local playerItemCostumeWhitelist = {}
local playerNullItemCostumeWhitelist = {}
local defaultItemWhitelist = {
	[CollectibleType.COLLECTIBLE_HOLY_MANTLE] = true,
	[CollectibleType.COLLECTIBLE_DADS_RING] = true,
}
local defaultNullItemWhitelist = {}
local CallbacksTable = {
	["MC_POST_COSTUME_RESET"] = {},
	["MC_POST_COSTUME_DEINIT"] = {},
	["MC_POST_COSTUME_INIT"] = {}
}

--List of player data for convenience and explanation--
--[[
	data.CCH_HasCostumeInitialized = Boolean. Used for initializing the player data adding them to the system in place.
	
	data.CCH_NumCollectibles = Int. Tracking player:GetCollectibleCount for a change to reset costume
	
	data.CCH_NumTemporaryEffects = Int. Tracking the length of player:GetEffects():GetEffectsList() for a change to reset costume.
	
	data.CCH_CustomFlightCostume = Boolean. Tracks when you suddenly gain/lose flight to reset costume.
	
	data.CCH_DelayCostumeReset = Boolean. For lots of various callbacks in this code, the costume is added after its callback. This is set to true
	and immediately resets your costume before returning to nil on the next frame.
	
	data.CCH_AstralProjectionDisabled = Boolean. As Astral Projection's temporary effect is not auto-removed when returning to your normal form,
	unlike Spirit Shackles, manual detection is needed. This is to stop adding Astral Projection's costume during a costume reset.
	True after getting hit in your ghost form or clearing a room. False upon losing the temporary effect.
	
	data.CCH_MineshaftEscape = Boolean. Set to true to reset your costume once upon confirming you're in the Mineshaft Escape Sequence dimension
	As of writing this, there's a bug where costumes can't be added inside the dimension anyway. Hopefully the code works as intended if it's fixed.
]]

---------------------
--  API FUNCTIONS  --
---------------------

local function initiateItemWhitelist(playerType)
	playerItemCostumeWhitelist[playerType] = {}
	for itemID, boolean in pairs(defaultItemWhitelist) do
		playerItemCostumeWhitelist[playerType][itemID] = boolean
	end
end

local function initiateNullItemWhitelist(playerType)
	playerNullItemCostumeWhitelist[playerType] = {}
	for nullItemID, boolean in pairs(defaultNullItemWhitelist) do
		playerNullItemCostumeWhitelist[playerType][nullItemID] = boolean
	end
end

function costumeProtector:AddPlayer(
playerType, spritesheetNormal, costumeFlight, spritesheetFlight, costumeExtra
)
	if playerType ~= nil
	and spritesheetNormal ~= nil then
		playerToProtect[playerType] = true
		playerCostume[playerType] = {}
		playerSpritesheet[playerType] = {spritesheetNormal}
		initiateItemWhitelist(playerType)
		initiateNullItemWhitelist(playerType)
		
		if costumeFlight or costumeExtra ~= nil then			
			if costumeFlight ~= nil then
				table.insert(playerCostume[playerType], costumeFlight)
			end
			if costumeExtra ~= nil then
				table.insert(playerCostume[playerType], costumeExtra)
			end
		end
		
		if spritesheetFlight ~= nil then
			table.insert(playerSpritesheet[playerType], spritesheetFlight)
		end
		
	end
end

function costumeProtector:UpdatePlayer(
player, playerType, shouldUpdateWhitelist, spritesheetNormal, costumeFlight, spritesheetFlight, costumeExtra
)
	if playerType ~= nil
	and playerToProtect[playerType] == true then
	
		if shouldUpdateWhitelist then
			initiateItemWhitelist(playerType)
			initiateNullItemWhitelist(playerType)
		end
		
		if spritesheetNormal then
			playerSpritesheet[playerType][1] = spritesheetNormal
		end
		
		if costumeFlight ~= nil then
			playerCostume[playerType][1] = costumeFlight
		else
			playerCostume[playerType][1] = nil
		end
		
		if spritesheetFlight ~= nil then
			playerSpritesheet[playerType][2] = spritesheetFlight
		else
			playerSpritesheet[playerType][2] = nil
		end
		
		if costumeExtra ~= nil then
			playerCostume[playerType][2] = costumeExtra
		else
			playerCostume[playerType][2] = nil
		end
		
		costumeProtector:mainResetPlayerCostumes(player)
	
	end
end

function costumeProtector:ItemCostumeWhitelist(playerType, itemIDs)
	if playerType ~= nil
	and itemIDs ~= nil then
	
		for itemID = 1, #itemIDs do
			playerItemCostumeWhitelist[playerType][itemIDs[itemID]] = true
		end
	end
end

function costumeProtector:NullEffectWhitelist(playerType, nullItemIDs)
	if playerType ~= nil
	and nullItemIDs ~= nil then
	
		for nullItemID = 1, #nullItemIDs do
			playerNullItemCostumeWhitelist[playerType][nullItemIDs[nullItemID]] = true
		end
	end
end

-----------------
--  CALLBACKS  --
-----------------

--Callback logic provided by AgentCucco

function costumeProtector.AddCallback(callback, newFunction)
	if CallbacksTable[callback] then
		table.insert(CallbacksTable[callback], newFunction)
	else
		error("Bad Argument #1 in costumeProtector.AddCallback (Attempt to index a " .. type(callback) .. "value, field '" .. tostring(callback) .. "'")
	end
end

function costumeProtector:afterCostumeInit(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_INIT"]) do
		callback(player)
	end
end

function costumeProtector:afterCostumeReset(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_RESET"]) do
		callback(player)
	end
end

function costumeProtector:afterCostumeDeinit(player)
	for _, callback in ipairs(CallbacksTable["MC_POST_COSTUME_DEINIT"]) do
		callback(player)
	end
end

-----------------------
--  BASIC FUNCTIONS  --
-----------------------

local nullEffectsBlacklist = {}

--Specifically if these items are whitelisted are they added back if their effects are active
local collectiblesEffectsOnlyAddOnEffect = {
	[CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON] = true,
	[CollectibleType.COLLECTIBLE_MOMS_BRA] = true,
	[CollectibleType.COLLECTIBLE_EMPTY_VESSEL] = true,
	[CollectibleType.COLLECTIBLE_RAZOR_BLADE] = true,
	[CollectibleType.COLLECTIBLE_THE_NAIL] = true,
	[CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN] = true,
	[CollectibleType.COLLECTIBLE_GAMEKID] = true,
	[CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP] = true,
	[CollectibleType.COLLECTIBLE_DELIRIOUS] = true,
}

local activesToDelayCostumeReset = {
	[CollectibleType.COLLECTIBLE_RAZOR_BLADE] = true,
	[CollectibleType.COLLECTIBLE_MOMS_BRA] = true,
	[CollectibleType.COLLECTIBLE_THE_NAIL] = true,
	[CollectibleType.COLLECTIBLE_MY_LITTLE_UNICORN] = true,
	[CollectibleType.COLLECTIBLE_GAMEKID] = true,
	[CollectibleType.COLLECTIBLE_SHOOP_DA_WHOOP] = true,
	[CollectibleType.COLLECTIBLE_PONY] = true,
	[CollectibleType.COLLECTIBLE_WHITE_PONY] = true,
	[CollectibleType.COLLECTIBLE_D4] = true,
	[CollectibleType.COLLECTIBLE_D100] = true,
	[CollectibleType.COLLECTIBLE_DELIRIOUS] = true,
	
}

local playerFormToNullItemID = {
	[PlayerForm.PLAYERFORM_GUPPY] = NullItemID.ID_GUPPY,
	[PlayerForm.PLAYERFORM_LORD_OF_THE_FLIES] = NullItemID.ID_LORD_OF_THE_FLIES,
	[PlayerForm.PLAYERFORM_MUSHROOM] = NullItemID.ID_MUSHROOM,
	[PlayerForm.PLAYERFORM_ANGEL] = NullItemID.ID_ANGEL,
	[PlayerForm.PLAYERFORM_BOB] = NullItemID.ID_BOB,
	[PlayerForm.PLAYERFORM_DRUGS] = NullItemID.ID_DRUGS,
	[PlayerForm.PLAYERFORM_MOM] = NullItemID.ID_MOM,
	[PlayerForm.PLAYERFORM_BABY] = NullItemID.ID_BABY,
	[PlayerForm.PLAYERFORM_EVIL_ANGEL] = NullItemID.ID_EVIL_ANGEL,
	[PlayerForm.PLAYERFORM_POOP] = NullItemID.ID_POOP,
	[PlayerForm.PLAYERFORM_BOOK_WORM] = NullItemID.ID_BOOK_WORM,
	[PlayerForm.PLAYERFORM_ADULTHOOD] = NullItemID.ID_ADULTHOOD,
	[PlayerForm.PLAYERFORM_SPIDERBABY] = NullItemID.ID_SPIDERBABY,
}

if REPENTANCE then
	defaultNullItemWhitelist = {
		[NullItemID.ID_MARS] = true,
		[NullItemID.ID_TOOTH_AND_NAIL] = true,
		[NullItemID.ID_ESAU_JR] = true,
		[NullItemID.ID_SPIRIT_SHACKLES_SOUL] = true,
		[NullItemID.ID_SPIRIT_SHACKLES_DISABLED] = true,
		[NullItemID.ID_LOST_CURSE] = true
	}
	
	defaultItemWhitelist[CollectibleType.COLLECTIBLE_SPIRIT_SHACKLES] = true
	defaultItemWhitelist[CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION] = true
	
	nullEffectsBlacklist = {
		[NullItemID.ID_HUGE_GROWTH] = true,
		[NullItemID.ID_ERA_WALK] = true,
		[NullItemID.ID_HOLY_CARD] = true,
		[NullItemID.ID_SPIN_TO_WIN] = true,
		[NullItemID.ID_INTRUDER] = true,
		[NullItemID.ID_REVERSE_HIGH_PRIESTESS] = true,
		[NullItemID.ID_REVERSE_STRENGTH] = true,
		[NullItemID.ID_REVERSE_TEMPERANCE] = true,
		[NullItemID.ID_EXTRA_BIG_FAN] = true,
		[NullItemID.ID_DARK_ARTS] = true,
		[NullItemID.ID_LAZARUS_SOUL_REVIVE] = true,
		[NullItemID.ID_SOUL_MAGDALENE] = true,
		[NullItemID.ID_SOUL_BLUEBABY] = true,
		[NullItemID.ID_MIRROR_DEATH] = true,
		[NullItemID.ID_SOUL_FORGOTTEN] = true,
		[NullItemID.ID_SOUL_JACOB] = true,
	}
	
	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_LARYNX] = true
	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_TOOTH_AND_NAIL] = true
	collectiblesEffectsOnlyAddOnEffect[CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION] = true
	
	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_LARYNX] = true
	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_SULFUR] = true
	activesToDelayCostumeReset[CollectibleType.COLLECTIBLE_LEMEGETON] = true	
end

local function onSpiritShacklesGhost(player)
	local playerType = player:GetPlayerType()

	player:ClearCostumes()
	if playerCostume[playerType][2] ~= nil then
		local costumeExtra = playerCostume[playerType][2]
		player:AddNullCostume(costumeExtra)
	end
end

function costumeProtector:AddCustomNullCostume(player, nullID)
	if nullID ~= -1 then
		player:AddNullCostume(nullID)
	else
		error("Custom Costume Protector Error: attempt to add costume returns nil")
	end
end

function costumeProtector:CanAddCollectibleCostume(player, itemID)
	if (player:HasCollectible(itemID) or player:GetEffects():HasCollectibleEffect(itemID)) 
	and not collectiblesEffectsOnlyAddOnEffect[itemID]
	then
		return true
	else
		return false
	end
end

local function ReaddAllCostumes(player)
	local playerType = player:GetPlayerType()
	local playerEffects = player:GetEffects()
	
	--Item Costumes
	if playerItemCostumeWhitelist[playerType] then
			for itemID, _ in pairs(playerItemCostumeWhitelist[playerType]) do
				local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)
				if costumeProtector:CanAddCollectibleCostume(player, itemID) then
					player:AddCostume(itemCostume, false)
				end
			end
		end
	
	--Item Costumes Only On Effect
	for itemID, boolean in pairs(collectiblesEffectsOnlyAddOnEffect) do
		if playerEffects:HasCollectibleEffect(itemID) then
			if playerItemCostumeWhitelist[playerType][itemID] == true then
				local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)
				if itemID ~= CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION then
					player:AddCostume(itemCostume)
				elseif not player:GetData().CCH_AstralProjectionDisabled then
					player:AddCostume(itemCostume)
				end
			end
		end
	end
	
	--Null Costumes
	for nullItemID = 1, NullItemID.NUM_NULLITEMS do
		if playerEffects:HasNullEffect(nullItemID) then
			if playerNullItemCostumeWhitelist[playerType][nullItemID] == true
			and not nullEffectsBlacklist[nullItemID] then
				if REPENTANCE and nullItemID == NullItemID.ID_SPIRIT_SHACKLES_SOUL then
					onSpiritShacklesGhost(player)
				end
				player:AddNullCostume(nullItemID)
			end
		end
	end
	
	--Transformations
	for playerForm, nullItemID in pairs(playerFormToNullItemID) do
		if player:HasPlayerForm(playerForm)
		and playerNullItemCostumeWhitelist[playerType][nullItemID] == true
		then
			player:AddNullCostume(nullItemID)
		end
	end
end

local function AddItemSpecificCostumes(player)
	local playerType = player:GetPlayerType()
	local playerEffects = player:GetEffects()
	local holyMantleCostume = Isaac.GetItemConfig():GetCollectible(CollectibleType.COLLECTIBLE_HOLY_MANTLE)
	
	--Holy Card
	if REPENTANCE and playerEffects:HasNullEffect(NullItemID.ID_HOLY_CARD) then
		player:AddCostume(holyMantleCostume, false)
	end
	
	--Empty Vessel
	if playerEffects:HasCollectibleEffect(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
	and playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_EMPTY_VESSEL] == true then
		player:AddNullCostume(NullItemID.ID_EMPTY_VESSEL)
	end
end

local function updatePlayerSpritesheet(player)
	local playerType = player:GetPlayerType()
	local sprite = player:GetSprite()
	local spritesheetPath = playerSpritesheet[playerType][1]

	if player.CanFly and playerSpritesheet[playerType][2] ~= nil then
		spritesheetPath = playerSpritesheet[playerType][2]
	end
	
	sprite:ReplaceSpritesheet(12, spritesheetPath)
	sprite:ReplaceSpritesheet(4, spritesheetPath)
	sprite:ReplaceSpritesheet(2, spritesheetPath)
	sprite:ReplaceSpritesheet(1, spritesheetPath)
	sprite:LoadGraphics()
end

local function tryAddFlightCostume(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()	

	if player.CanFly == true 
	and playerCostume[playerType][1] ~= nil then
		local costumeFlight = playerCostume[playerType][1]
		player:AddNullCostume(costumeFlight)
	end
end

function costumeProtector:mainResetPlayerCostumes(player)
	local playerType = player:GetPlayerType()
	
	if (REPENTANCE and playerToProtect[playerType] == true and not player:IsCoopGhost()) or (not REPENTANCE and playerToProtect[playerType] == true) then
	
		player:ClearCostumes()
		updatePlayerSpritesheet(player)
		
		if playerCostume[playerType][1] ~= nil then
			tryAddFlightCostume(player)
		end
		
		if playerCostume[playerType][2] ~= nil then
			local costumeExtra = playerCostume[playerType][2]
			costumeProtector:AddCustomNullCostume(player, costumeExtra)
		end
		
		ReaddAllCostumes(player)
		AddItemSpecificCostumes(player)
		costumeProtector:afterCostumeReset(player)
	end
end

function costumeProtector:removePlayerCostumes(player)
	local data = player:GetData()
	local playerEffects = player:GetEffects()
	
	--Removing character's costumes
	for playerType, _ in pairs(data.CCH_HasCostumeInitialized) do
		local basePath = playerCostume[playerType]
		player:TryRemoveNullCostume(basePath[1])
		if basePath[2] ~= nil then
			player:TryRemoveNullCostume(basePath[2])
		end
	end
	
	--Item Costumes
	for itemID = 1, CollectibleType.NUM_COLLECTIBLES do
		local itemCostume = Isaac.GetItemConfig():GetCollectible(itemID)
		if costumeProtector:CanAddCollectibleCostume(player, itemID) then
			player:AddCostume(itemCostume, false)
		end
	end

	--Item Costumes Only On Effect
	for itemID, boolean in pairs(collectiblesEffectsOnlyAddOnEffect) do
		if playerEffects:HasCollectibleEffect(itemID) then
			player:AddCostume(itemCostume)
		end
	end
	
	--Null Costumes
	for nullItemID = 1, NullItemID.NUM_NULLITEMS do
		if playerEffects:HasNullEffect(nullItemID) then
			if not nullEffectsBlacklist[nullItemID] then
				player:AddNullCostume(nullItemID)
			end
		end
	end
	
	--Transformations
	for playerForm, nullItemID in pairs(playerFormToNullItemID) do
		if player:HasPlayerForm(playerForm) then
			player:AddNullCostume(nullItemID)
		end
	end
end

function costumeProtector:initPlayerCostume(player)
  local data = player:GetData()
  local playerType = player:GetPlayerType()
	
	if (not REPENTANCE and playerToProtect[playerType] == true) or (REPENTANCE and playerToProtect[playerType] == true and not player:IsCoopGhost()) then
		
		if not data.CCH_HasCostumeInitialized then
			
			costumeProtector:mainResetPlayerCostumes(player)
			data.CCH_NumCollectibles = player:GetCollectibleCount()
			data.CCH_NumTemporaryEffects = player:GetEffects():GetEffectsList():__len()
			data.CCH_QueueCostumeRemove = {}
			data.CCH_HasCostumeInitialized = {
				[playerType] = true
			}
			costumeProtector:afterCostumeInit(player)
			
		end
	end
end

function costumeProtector:deinitPlayerCostume(player)
	local data = player:GetData()
	local playerType = player:GetPlayerType()
	
	if not playerToProtect[playerType] --PlayerType isn't in local protection system
	and data.CCH_HasCostumeInitialized --Has the protection data
	and not data.CCH_HasCostumeInitialized[playerType] --For those given protection outside of this mod
	then
		--costumeProtector:removePlayerCostumes(player)
		data.CCH_NumCollectibles = nil
		data.CCH_NumTemporaryEffects = nil
		data.CCH_CustomFlightCostume = nil
		data.CCH_HasCostumeInitialized = nil
		costumeProtector:afterCostumeDeinit(player)
	end
end

local function dontResetOnHemoptysis(player)
	local effects = player:GetEffects()
	local playerType = player:GetPlayerType()
	local hemo = CollectibleType.COLLECTIBLE_HEMOPTYSIS
	
	if effects:HasCollectibleEffect(hemo)
	and playerItemCostumeWhitelist[playerType]
	and playerItemCostumeWhitelist[playerType][hemo] ~= nil then
		return true
	else
		return false
	end
end

function costumeProtector:miscCostumeResets(player)
	local data = player:GetData()
		
	if data.CCH_NumCollectibles
	and data.CCH_NumCollectibles ~= player:GetCollectibleCount()
	then
		data.CCH_NumCollectibles = player:GetCollectibleCount()
		costumeProtector:mainResetPlayerCostumes(player)
	end
	
	if data.CCH_NumTemporaryEffects
	and data.CCH_NumTemporaryEffects ~= player:GetEffects():GetEffectsList():__len()
	and dontResetOnHemoptysis(player)
	then
		data.CCH_NumTemporaryEffects = player:GetEffects():GetEffectsList():__len()
		costumeProtector:mainResetPlayerCostumes(player)
	end
	
	if player.CanFly and not data.CCH_CustomFlightCostume then
		costumeProtector:mainResetPlayerCostumes(player)
		data.CCH_CustomFlightCostume = true
	elseif not player.CanFly and data.CCH_CustomFlightCostume then
		costumeProtector:mainResetPlayerCostumes(player)
		data.CCH_CustomFlightCostume = false
	end
end

----------------------------------------------
--  RESETTING COSTUME ON SPECIFIC TRIGGERS  --
----------------------------------------------

--Code provided by piber20
local function ABPlusUseItemPlayer()
	local player
	for i = 0, Game():GetNumPlayers() - 1 do

		local thisPlayer = Isaac.GetPlayer(i)

		--check the player's input
		if Input.IsActionTriggered(ButtonAction.ACTION_ITEM, thisPlayer.ControllerIndex) or Input.IsActionTriggered(ButtonAction.ACTION_PILLCARD, thisPlayer.ControllerIndex) and thisPlayer:GetActiveItem() == itemID then
		
			player = thisPlayer
			break
			
		end
		
	end

	if player then return player end
end

function costumeProtector:resetCostumeOnItem(
  itemID, rng, player, useFlags, activeSlot, customVarData
)
	local player = player or ABPlusUseItemPlayer()
	if player then
		local playerType = player:GetPlayerType()
		local data = player:GetData()
		local playerHasUsedItem = activesToDelayCostumeReset[itemID] == true

		if data.CCH_HasCostumeInitialized and playerHasUsedItem then
			if playerItemCostumeWhitelist[playerType] and not playerItemCostumeWhitelist[playerType][itemID] then
				data.CCH_DelayCostumeReset = true
			end
		end
	end
	return false
end

-----------------------------
--  SMALLER MISC TRIGGERS  --
-----------------------------

local function InsideAltDimension()
local level = game:GetLevel()
local currentIndex = level:GetCurrentRoomIndex()
	return GetPtrHash(level:GetRoomByIdx(currentIndex)) == GetPtrHash(level:GetRoomByIdx(currentIndex, 1))
end

--Currently doesn't function due to hard-coded garbage!
function costumeProtector:onMinesEscape(player)
	local data = player:GetData()
	
	if InsideAltDimension() then
		if not data.CCH_MineshaftEscape then
			costumeProtector:mainResetPlayerCostumes(player)
			data.CCH_MineshaftEscape = true
		end
	elseif data.CCH_MineshaftEscape then
		data.CCH_MineshaftEscape = nil
	end
end

function costumeProtector:stopNewRoomCostumes(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	
	if player:HasCollectible(CollectibleType.COLLECTIBLE_TAURUS)
	and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_TAURUS] then
		table.insert(data.CCH_QueueCostumeRemove, CollectibleType.COLLECTIBLE_TAURUS)
		data.CCH_DelayTaurusCostumeReset = true
	end
	
	if player:HasCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)
	and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON] then
		if player:GetHearts() <= 1 then
			table.insert(data.CCH_QueueCostumeRemove, CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON)
		end
	end

	if player:HasCollectible(CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
	and not playerItemCostumeWhitelist[playerType][CollectibleType.COLLECTIBLE_EMPTY_VESSEL] then
		if player:GetHearts() == 0 then
			table.insert(data.CCH_QueueCostumeRemove, CollectibleType.COLLECTIBLE_EMPTY_VESSEL)
		end
	end
end

function costumeProtector:stopTaurusCostumeOnInvincibility(player)
	local effects = player:GetEffects()
	local data = player:GetData()

	if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_TAURUS)
	and player.MoveSpeed >= 2.0
	and data.CCH_DelayTaurusCostumeReset then
		table.insert(data.CCH_QueueCostumeRemove, CollectibleType.COLLECTIBLE_TAURUS)
		data.CCH_DelayTaurusCostumeReset = false
	end
end

--Missing No. doesn't use D4's run-reroll effect for some dumb reason!
function costumeProtector:resetOnMissingNoNewFloor(player)
	if player:HasCollectible(CollectibleType.COLLECTIBLE_MISSING_NO) then
		costumeProtector:MainResetPlayerCostumes(player)
	end
end

function costumeProtector:modelingClay(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	local itemID = player:GetModelingClayEffect()
	
	if data.CCH_CheckForModelingClay then
		if player:HasTrinket(TrinketType.TRINKET_MODELING_CLAY)
		and itemID ~= 0
		and playerItemCostumeWhitelist[playerType][itemID] == nil
		then
			table.insert(data.CCH_QueueCostumeRemove, itemID)
		end
		data.CCH_CheckForModelingClay = false
	end
end

local roomIsClear = true

function costumeProtector:astralProjectionOnClear(player)
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	local room = game:GetRoom()
	
	if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION) then
		if roomIsClear == false and room:IsClear() == true and not data.CCH_AstralProjectionDisabled then
			data.CCH_DelayCostumeReset = true
			data.CCH_AstralProjectionDisabled = true
		end
	else
		if data.CCH_AstralProjectionDisabled then
			data.CCH_AstralProjectionDisabled = nil
		end
	end
	roomIsClear = room:IsClear()
end

function costumeProtector:astralProjectionOnHit(ent, amount, flags, source, countdown)
	local player = ent:ToPlayer()
	local playerType = player:GetPlayerType()
	local data = player:GetData()
	
	if playerToProtect[playerType] == true then
		if player:GetEffects():HasCollectibleEffect(CollectibleType.COLLECTIBLE_ASTRAL_PROJECTION) then
			data.CCH_DelayCostumeReset = true
			data.CCH_AstralProjectionDisabled = true
		end
	end
end

--When any of the above functions trigger and add player data "CCH_DelayCostumeReset[playerType]", reset the costume here
--Its not reset inside the functions themselves as the costumes are added AFTER the callbacks are triggered
function costumeProtector:delayInCostumeReset(player)
	local data = player:GetData()

	if data.CCH_DelayCostumeReset and data.CCH_DelayCostumeReset then
		costumeProtector:MainResetPlayerCostumes(player)
		data.CCH_DelayCostumeReset = nil
	end
	
	if data.CCH_QueueCostumeRemove and data.CCH_QueueCostumeRemove[1] ~= nil then
		while #data.CCH_QueueCostumeRemove > 0 do
			local itemCostume = Isaac.GetItemConfig():GetCollectible(data.CCH_QueueCostumeRemove[1])
			player:RemoveCostume(itemCostume)
			table.remove(data.CCH_QueueCostumeRemove, 1)
		end
	end
end

----------------------------
--  INITIATING CALLBACKS  --
----------------------------

function costumeProtector:init(mod)
	mod:AddCallback(ModCallbacks.MC_POST_PEFFECT_UPDATE, function(_, player)
		local playerType = player:GetPlayerType()
		
		costumeProtector:deinitPlayerCostume(player)
		
		if playerToProtect[playerType] == true then
			costumeProtector:miscCostumeResets(player)
			costumeProtector:delayInCostumeReset(player)
			costumeProtector:stopTaurusCostumeOnInvincibility(player)
			if REPENTANCE then
				costumeProtector:astralProjectionOnClear(player)
			end
		end
	end)

	mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, function()
		for i = 0, game:GetNumPlayers() - 1 do
			local player = Isaac.GetPlayer(i)
			local playerType = player:GetPlayerType()
			
			if playerToProtect[playerType] == true then
				costumeProtector:stopNewRoomCostumes(player)
				if REPENTANCE then
					costumeProtector:modelingClay(player)
					costumeProtector:onMinesEscape(player)
				end
			end
		end
	end)
	
	mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, function()
		for i = 0, game:GetNumPlayers() - 1 do
			local player = Isaac.GetPlayer(i)
			local playerType = player:GetPlayerType()
			
			if playerToProtect[playerType] == true then
				costumeProtector:resetOnMissingNoNewFloor(player)
			end
		end
	end)

	mod:AddCallback(ModCallbacks.MC_USE_ITEM, costumeProtector.resetCostumeOnItem)
	if REPENTANCE then
		mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, costumeProtector.astralProjectionOnHit, EntityType.ENTITY_PLAYER)
	end
end

return costumeProtector