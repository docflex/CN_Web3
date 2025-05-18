const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SubscriptionManager", function () {
    let SubscriptionManager, subscriptionManager;
    let owner, user1, user2;
    const fee = ethers.parseEther("0.01");

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
        subscriptionManager = await SubscriptionManager.deploy(fee);
        await subscriptionManager.waitForDeployment();
    });

    it("Should deploy with correct owner and fee", async function () {
        expect(await subscriptionManager.owner()).to.equal(owner.address);
        expect(await subscriptionManager.subscriptionFee()).to.equal(fee);
    });

    describe("Subscription", function () {
        it("Should allow user to subscribe with correct fee", async function () {
            const tx = await subscriptionManager.connect(user1).subscribe({ value: fee });
            await expect(tx).to.emit(subscriptionManager, "Subscribed");

            const expiry = await subscriptionManager.subscribers(user1.address);
            expect(expiry).to.be.gt(0);
        });

        it("Should reject subscription with wrong fee", async function () {
            await expect(
                subscriptionManager
                    .connect(user1)
                    .subscribe({ value: ethers.parseEther("0.005") })
            ).to.be.revertedWith("Incorrect Amount");
        });

        it("Should show user as active after subscription", async function () {
            await subscriptionManager.connect(user1).subscribe({ value: fee });
            const isActive = await subscriptionManager.isActiveSubscriber(user1.address);
            expect(isActive).to.be.true;
        });

        it("Should show user as inactive if never subscribed", async function () {
            const isActive = await subscriptionManager.isActiveSubscriber(user2.address);
            expect(isActive).to.be.false;
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            await subscriptionManager.connect(user1).subscribe({ value: fee });
            await subscriptionManager.connect(user2).subscribe({ value: fee });
        });

        it("Should allow only owner to withdraw", async function () {
            const balanceBefore = await ethers.provider.getBalance(owner.address);
            const tx = await subscriptionManager.connect(owner).withdraw();
            const receipt = await tx.wait();
            const gasUsed =
                ethers.getBigInt(receipt.gasUsed) * ethers.getBigInt(receipt.gasPrice);

            const balanceAfter = await ethers.provider.getBalance(owner.address);
            const diff = balanceAfter - balanceBefore + gasUsed;

            expect(diff).to.be.closeTo(
                fee * BigInt(2),
                ethers.getBigInt(ethers.parseEther("0.001"))
            );
        });

        it("Should reject withdrawals from non-owner", async function () {
            await expect(
                subscriptionManager.connect(user1).withdraw()
            ).to.be.revertedWith("Not The Owner");
        });

        it("Should revert if contract has no funds", async function () {
            // Withdraw all first
            await subscriptionManager.connect(owner).withdraw();
            await expect(
                subscriptionManager.connect(owner).withdraw()
            ).to.be.revertedWith("Nothing to Withdraw");
        });
    });

    describe("Edge Cases", function () {
        it("Should overwrite expiry when re-subscribed", async function () {
            await subscriptionManager.connect(user1).subscribe({ value: fee });
            const firstExpiry = await subscriptionManager.subscribers(user1.address);

            // Move time forward 1 day (simulate re-subscribe before expiry)
            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
            await ethers.provider.send("evm_mine");

            await subscriptionManager.connect(user1).subscribe({ value: fee });
            const secondExpiry = await subscriptionManager.subscribers(user1.address);
            expect(secondExpiry).to.be.gt(firstExpiry);
        });

        it("Should allow multiple users to subscribe independently", async function () {
            await subscriptionManager.connect(user1).subscribe({ value: fee });
            await subscriptionManager.connect(user2).subscribe({ value: fee });

            const expiry1 = await subscriptionManager.subscribers(user1.address);
            const expiry2 = await subscriptionManager.subscribers(user2.address);

            expect(expiry1).to.be.gt(0);
            expect(expiry2).to.be.gt(0);
            expect(expiry1).to.not.equal(expiry2);
        });
    });
});
