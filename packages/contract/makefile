-include .env

SCRIPT       := script/Deploy.s.sol:Deploy
LOCAL_RPC    := http://127.0.0.1:8545
ANVIL_SENDER := 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

.PHONY: build test anvil deploy-local deploy-testnet

build:
	forge build

test:
	forge test -vv

anvil:
	anvil

deploy-local:
	forge script $(SCRIPT) --rpc-url $(LOCAL_RPC) --account anvil-default --sender $(ANVIL_SENDER) --broadcast

deploy-testnet:
	forge script $(SCRIPT) --rpc-url $(TESTNET_RPC_URL) --account $(TESTNET_ACCOUNT) --sender $(TESTNET_DEPLOYER_ADDRESS) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)