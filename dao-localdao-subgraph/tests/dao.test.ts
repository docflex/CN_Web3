import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { VoteCast } from "../generated/schema"
import { VoteCast as VoteCastEvent } from "../generated/DAO/DAO"
import { handleVoteCast } from "../src/dao"
import { createVoteCastEvent } from "./dao-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let voter = Address.fromString("0x0000000000000000000000000000000000000001")
    let proposalId = BigInt.fromI32(234)
    let weight = BigInt.fromI32(234)
    let newVoteCastEvent = createVoteCastEvent(voter, proposalId, weight)
    handleVoteCast(newVoteCastEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("VoteCast created and stored", () => {
    assert.entityCount("VoteCast", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "voter",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "proposalId",
      "234"
    )
    assert.fieldEquals(
      "VoteCast",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "weight",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
