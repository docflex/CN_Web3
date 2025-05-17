const { expect } = require("chai");

describe("Counter", function () {
    let counter;

    beforeEach(async function () {
        const Counter = await ethers.getContractFactory("Counter");
        counter = await Counter.deploy();
        await counter.waitForDeployment(); // ✅ correct method for Ethers v6
    });

    it("Should start at 0", async function () {
        expect(await counter.count()).to.equal(0);
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
