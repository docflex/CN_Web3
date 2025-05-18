Steps To Have Local Setup for Hardhat:

1. Have an IDE + Node Installed Locally. (LTS v22.14.0)

2. Run Command to Set Up a Node Project.

    - Creates the Node Project: `npm init -y`
    - Installs Hardhat: `npm i --save-dev hardhat`

3. Create a Hardhat Project: `npx hardhat`

    - Create a JS project (Enter)
    - Same Project Root (Enter)
    - GitIgnore (Enter)
    - Nomic Foundation Dep (Enter)

4. Writing Your Smart Contract inside the `contracts` folder:

    ```solidity
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        contract Counter {
            uint256 public count;

            function increment() public {
                count += 1;
            }

            function reset() public {
                count = 0;
            }
        }
    ```

5. Write the Following Test case in the `test` folder:

    ```javascript
    const { expect } = require("chai");

    describe("Counter", () => {
        let counter;

        beforeEach(async () => {
            const Counter = await ethers.getContractFactory("Counter");
            counter = await Counter.deploy();
            await counter.waitForDeployment();
        });

        it("Should start at 0", async () => {
            expect(await counter.count()).to.be.equal(0);
        });

        it("Should increment count", async function () {
            await counter.increment();
            expect(await counter.count()).to.equal(1);
        });

        it("Should reset count to 0", async function () {
            await counter.increment();
            await counter.reset();
            expect(await counter.count()).to.equal(0);
        });
    });
    ```

6. Run `npx hardhat test`. Then Install Dependencies. To do so, run:

    ```shell
        npm install --save-dev "@nomicfoundation/hardhat-chai-matchers@^2.0.0" "@nomicfoundation/hardhat-ethers@^3.0.0" "@nomicfoundation/hardhat-ignition-ethers@^0.15.0" "@nomicfoundation/hardhat-network-helpers@^1.0.0" "@nomicfoundation/hardhat-verify@^2.0.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "chai@^4.2.0" "ethers@^6.4.0" "hardhat-gas-reporter@^1.0.8" "solidity-coverage@^0.8.1" "ts-node@>=8.0.0" "typechain@^8.3.0" "typescript@>=4.5.0"

        npm install --save-dev "@nomicfoundation/hardhat-ignition@^0.15.11" "@nomicfoundation/ignition-core@^0.15.11"
    ```

    After all the Dependencies are Installed, please rerun:

    ```shell
        npx hardhat test
    ```

7. Since all the tests are running as expected, we can proceed with writing the Deployment Scripts:

    ```javascript
    const { ethers } = require("hardhat");

    async function main() {
        const Counter = await ethers.getContractFactory("Counter");
        const counter = await Counter.deploy();
        await counter.waitForDeployment();

        console.log(`Contract Successfully Deployed at Address: ${await counter.getAddress()}`);
    }

    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });

    ```

    Run the Deployment Script by Running the Following Command:

    ```shell
        npx hardhat run scripts/deploy.js --network hardhat
    ```

8. For you to Compile the Smart Contracts, Simply Run:

    ```shell
        npx hardhat compile
    ```

9. Next, to run a Localhost node with 20 Accounts with 1000 ETH Each for Development, Run:

    ```
        npx hardhat node
    ```

    Every task, like `testing` and `deploying` can be done locally by just affixing the `--network localhost`
