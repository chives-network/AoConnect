-- Options Trading App v5

-- Global Variables and Setup
Trades = {}
Winners = {}


local json = require("json")
 
_0RBIT = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ"
 
BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/new%20york?unitGroup=us&include=current&key=EUEQ4LDRZAS7HY2ZSJTVV76JD&contentType=json"
 
CurrentData = CurrentData or {}



NOW = NOW or nil  
-- Function to initialize the app
function initializeApp()
    Trades = {}
    Winners = {}
    
    -- Initialize with a dummy trade to prevent Trades list from returning zero
    local dummyTrade = {
        tradeId = "12345",
        timeCreated = NOW,
        location = "initial",
        amount = 0,
        contractExpiry = NOW + 86400, -- expires in one day
        contractType = "Call",
        assetPrice = 0,
        status = "open"
    }
    Trades["dummy"] = dummyTrade

    print("Options Trading App initialized.")
end



-- Function to create a new trade
function createTrade(tradeId, timeCreated, location, amount, contractType, assetPrice)
    local contractExpiry = timeCreated + 86400  -- Set contract expiry exactly one day from timeCreated
    local newTrade = {
        tradeId = tradeId,
        timeCreated = NOW,
        location = location,
        amount = amount,
        contractExpiry = contractExpiry,
        contractType = contractType,
        assetPrice = assetPrice,
        status = "open"
    }
    Trades[tradeId] = newTrade
    print("New trade created: " .. tradeId)
end

-- Function to check contract expiry and close positions
function checkContractExpiry(location, currentAssetPrice)
    local currentTime = os.time()
    for tradeId, trade in pairs(Trades) do
        if trade.location == location and currentTime >= trade.contractExpiry then
            print("Contract expired for trade: " .. tradeId)
            trade.status = "closed"
            if isWinner(trade, currentAssetPrice) then
                table.insert(Winners, trade)
            end
        end
    end
end

-- Function to determine if a trade is a winner
function isWinner(trade, currentAssetPrice)
    if trade.contractType == "Call" and currentAssetPrice > trade.assetPrice then
        return true
    elseif trade.contractType == "Put" and currentAssetPrice < trade.assetPrice then
        return true
    else
        return false
    end
end

-- Function to send rewards to winners
function sendRewards()
    for _, winner in ipairs(Winners) do
        local payout = winner.amount * 0.7
        print("Sending reward: " .. payout .. " to trade: " .. winner.tradeId)
        -- Placeholder for reward sending logic
    end
    -- Clear winners list after sending rewards
    Winners = {}
end

-- Handler to process trade requests
function handleTradeRequest(msg)
    local tradeId = msg.TradeId
    local timeCreated = os.time()
    local location = msg.Location
    local amount = msg.Amount
    local contractType = msg.ContractType
    local assetPrice = msg.AssetPrice

    createTrade(tradeId, timeCreated, location, amount, contractType, assetPrice)
end

-- Initialization
initializeApp()

-- Handlers
Handlers.add("TradeRequest", Handlers.utils.hasMatchingTag("Action", "TradeRequest"), handleTradeRequest)

-- Periodic check for contract expiry and sending rewards
function onTick(location, currentAssetPrice)
    checkContractExpiry(location, currentAssetPrice)
    sendRewards()
end

Handlers.add(
    "Get-Request",
    Handlers.utils.hasMatchingTag("Action", "Sponsored-Get-Request-Current"),
    function(msg)
        Send({
            Target = _0RBIT,
            Action = "Get-Real-Data",
            Url = BASE_URL
        })
        print(Colors.green .. "You have sent a GET Request to the 0rbit process.")
    end
)

Handlers.add(
    "Receive-Data",
    Handlers.utils.hasMatchingTag("Action", "Receive-Response"),
    function(msg)
        local res = json.decode(msg.Data)
        CurrentData = res
        print(Colors.green .. "You have received the data from the 0rbit process.")
    end
)