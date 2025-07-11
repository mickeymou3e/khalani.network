import { ethers } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { fp } from '@balancer-labs/v2-helpers/src/numbers';
import { MINUTE, currentTimestamp } from '@balancer-labs/v2-helpers/src/time';
import * as expectEvent from '@balancer-labs/v2-helpers/src/test/expectEvent';

import TokenList from '@balancer-labs/v2-helpers/src/models/tokens/TokenList';
import LiquidityBootstrappingPool from '@balancer-labs/v2-helpers/src/models/pools/weighted/LiquidityBootstrappingPool';
import { range } from 'lodash';
import { itBehavesAsWeightedPool } from './BaseWeightedPool.behavior';
import { WeightedPoolType } from '@balancer-labs/v2-helpers/src/models/pools/weighted/types';
import { sharedBeforeEach } from '@balancer-labs/v2-common/sharedBeforeEach';

describe('LiquidityBootstrappingPool', function () {
  let owner: SignerWithAddress, other: SignerWithAddress;

  before('setup signers', async () => {
    [, owner, other] = await ethers.getSigners();
  });

  const MAX_TOKENS = 4;

  let allTokens: TokenList, tokens: TokenList;

  // Add the weighted pool tests for the joins/exits, etc.

  context('for a 2 token pool', () => {
    itBehavesAsWeightedPool(2, WeightedPoolType.LIQUIDITY_BOOTSTRAPPING_POOL);
  });

  context('for a 3 token pool', () => {
    itBehavesAsWeightedPool(3, WeightedPoolType.LIQUIDITY_BOOTSTRAPPING_POOL);
  });

  context('for a 4 token pool', () => {
    itBehavesAsWeightedPool(4, WeightedPoolType.LIQUIDITY_BOOTSTRAPPING_POOL);
  });

  sharedBeforeEach('deploy tokens', async () => {
    allTokens = await TokenList.create(MAX_TOKENS + 1, { sorted: true });
    tokens = allTokens.subset(4);
    await tokens.mint({ to: [other], amount: fp(200) });
  });

  let sender: SignerWithAddress;
  let pool: LiquidityBootstrappingPool;
  const weights = [fp(0.3), fp(0.55), fp(0.1), fp(0.05)];
  const initialBalances = [fp(0.9), fp(1.8), fp(2.7), fp(3.6)];

  context('with invalid creation parameters', () => {
    const tooManyWeights = [fp(0.3), fp(0.25), fp(0.3), fp(0.1), fp(0.05)];

    it('fails with < 2 tokens', async () => {
      const params = {
        tokens: allTokens.subset(1),
        weights: [fp(0.3)],
      };
      await expect(LiquidityBootstrappingPool.create(params)).to.be.revertedWith('MIN_TOKENS');
    });

    it('fails with > 4 tokens', async () => {
      const params = {
        tokens: allTokens,
        weights: tooManyWeights,
      };
      await expect(LiquidityBootstrappingPool.create(params)).to.be.revertedWith('MAX_TOKENS');
    });

    it('fails with mismatched tokens/weights', async () => {
      const params = {
        tokens,
        weights: tooManyWeights,
      };
      await expect(LiquidityBootstrappingPool.create(params)).to.be.revertedWith('INPUT_LENGTH_MISMATCH');
    });
  });

  describe('weights and scaling factors', () => {
    for (const numTokens of range(2, MAX_TOKENS + 1)) {
      context(`with ${numTokens} tokens`, () => {
        let pool: LiquidityBootstrappingPool;
        let tokens: TokenList;

        sharedBeforeEach('deploy pool', async () => {
          tokens = allTokens.subset(numTokens);

          pool = await LiquidityBootstrappingPool.create({
            tokens,
            weights: weights.slice(0, numTokens),
          });
        });

        it('sets token weights', async () => {
          const normalizedWeights = await pool.getNormalizedWeights();

          for (let i = 0; i < numTokens; i++) {
            expect(normalizedWeights[i]).to.equalWithError(pool.normalizedWeights[i], 0.001);
          }
        });

        it('sets scaling factors', async () => {
          const poolScalingFactors = await pool.getScalingFactors();
          const tokenScalingFactors = tokens.map((token) => fp(10 ** (18 - token.decimals)));

          expect(poolScalingFactors).to.deep.equal(tokenScalingFactors);
        });
      });
    }
  });

  context('when deployed from factory', () => {
    sharedBeforeEach('deploy pool', async () => {
      const params = {
        tokens,
        weights,
        fromFactory: true,
      };
      pool = await LiquidityBootstrappingPool.create(params);
    });

    it('has no asset managers', async () => {
      await tokens.asyncEach(async (token) => {
        const { assetManager } = await pool.getTokenInfo(token);
        expect(assetManager).to.be.zeroAddress;
      });
    });
  });

  describe('with valid creation parameters', () => {
    context('when initialized with swaps disabled', () => {
      sharedBeforeEach('deploy pool', async () => {
        const params = {
          tokens,
          weights,
          swapEnabledOnStart: false,
        };
        pool = await LiquidityBootstrappingPool.create(params);
      });

      it('swaps show disabled on start', async () => {
        expect(await pool.instance.getSwapEnabled()).to.be.false;
      });

      it('swaps are blocked', async () => {
        await expect(pool.swapGivenIn({ in: 1, out: 0, amount: fp(0.1) })).to.be.revertedWith(
          'revert with reason "BAL#327"'
        );
      });
    });

    context('when initialized with swaps enabled', () => {
      sharedBeforeEach('deploy pool', async () => {
        const params = {
          tokens,
          weights,
          owner: owner.address,
          swapEnabledOnStart: true,
        };
        pool = await LiquidityBootstrappingPool.create(params);
      });

      it('swaps show enabled on start', async () => {
        expect(await pool.instance.getSwapEnabled()).to.be.true;
      });

      it('swaps are not blocked', async () => {
        await pool.init({ from: owner, initialBalances });

        await expect(pool.swapGivenIn({ in: 1, out: 0, amount: fp(0.1) })).to.not.be.reverted;
      });

      it('sets token weights', async () => {
        const normalizedWeights = await pool.getNormalizedWeights();

        // Not exactly equal due to weight compression
        expect(normalizedWeights).to.equalWithError(pool.normalizedWeights, 0.001);
      });

      it('stores the initial weights as a zero duration weight change', async () => {
        const { startTime, endTime, endWeights } = await pool.getGradualWeightUpdateParams();

        expect(startTime).to.equal(endTime);
        expect(endWeights).to.equalWithError(pool.normalizedWeights, 0.001);
      });

      describe('permissioned actions', () => {
        context('when the sender is the owner', () => {
          sharedBeforeEach('set sender to owner', async () => {
            sender = owner;
            await pool.init({ from: owner, initialBalances });
          });

          it('swaps can be enabled and disabled', async () => {
            await pool.setSwapEnabled(sender, false);
            expect(await pool.instance.getSwapEnabled()).to.be.false;

            await pool.setSwapEnabled(sender, true);
            expect(await pool.instance.getSwapEnabled()).to.be.true;
          });

          it('disabling swaps emits an event', async () => {
            const receipt = await pool.setSwapEnabled(sender, false);

            expectEvent.inReceipt(await receipt.wait(), 'SwapEnabledSet', {
              swapEnabled: false,
            });
          });

          it('enabling swaps emits an event', async () => {
            const receipt = await pool.setSwapEnabled(sender, true);

            expectEvent.inReceipt(await receipt.wait(), 'SwapEnabledSet', {
              swapEnabled: true,
            });
          });

          it('owner can join and receive BPT, then exit', async () => {
            const bptBeforeJoin = await pool.balanceOf(owner.address);
            await expect(pool.joinGivenIn({ from: owner, amountsIn: initialBalances })).to.not.be.reverted;

            const bptAfterJoin = await pool.balanceOf(owner.address);
            expect(bptAfterJoin).to.gt(bptBeforeJoin);

            await expect(pool.exitGivenOut({ from: owner, amountsOut: initialBalances })).to.not.be.reverted;
            const bptAfterExit = await pool.balanceOf(owner.address);
            expect(bptAfterExit).to.lt(bptAfterJoin);
          });

          describe('update weights gradually', () => {
            const UPDATE_DURATION = MINUTE * 60;

            context('with invalid parameters', () => {
              let now: BigNumber;

              sharedBeforeEach(async () => {
                now = await currentTimestamp();
              });

              it('fails if end weights are mismatched (too few)', async () => {
                await expect(pool.updateWeightsGradually(sender, now, now, weights.slice(0, 1))).to.be.revertedWith(
                  'revert with reason "BAL#103"'
                );
              });

              it('fails if the end weights are mismatched (too many)', async () => {
                await expect(pool.updateWeightsGradually(sender, now, now, [...weights, fp(0.5)])).to.be.revertedWith(
                  'revert with reason "BAL#103"'
                );
              });

              it('fails with an end weight below the minimum', async () => {
                const badWeights = [...weights];
                badWeights[2] = fp(0.005);

                await expect(
                  pool.updateWeightsGradually(sender, now.add(100), now.add(1000), badWeights)
                ).to.be.revertedWith('revert with reason "BAL#302"');
              });

              it('fails with invalid normalized end weights', async () => {
                const badWeights = Array(weights.length).fill(fp(0.6));

                await expect(
                  pool.updateWeightsGradually(sender, now.add(100), now.add(1000), badWeights)
                ).to.be.revertedWith('revert with reason "BAL#308"');
              });
            });

            context('with valid parameters (ongoing weight update)', () => {
              const endWeights = [fp(0.15), fp(0.25), fp(0.55), fp(0.05)];

              let now, startTime: BigNumber, endTime: BigNumber;
              const START_DELAY = MINUTE * 10;

              sharedBeforeEach('updateWeightsGradually', async () => {
                now = await currentTimestamp();
                startTime = now.add(START_DELAY);
                endTime = startTime.add(UPDATE_DURATION);

                await pool.updateWeightsGradually(owner, startTime, endTime, endWeights);
              });

              it('updating weights emits an event', async () => {
                const receipt = await pool.updateWeightsGradually(owner, startTime, endTime, endWeights);

                expectEvent.inReceipt(await receipt.wait(), 'GradualWeightUpdateScheduled', {
                  startTime: startTime,
                  endTime: endTime,
                  // weights don't exactly match because of the compression
                });
              });

              it('stores the params', async () => {
                const updateParams = await pool.getGradualWeightUpdateParams();

                expect(updateParams.startTime).to.equalWithError(startTime, 0.001);
                expect(updateParams.endTime).to.equalWithError(endTime, 0.001);
                expect(updateParams.endWeights).to.equalWithError(endWeights, 0.001);
              });
            });
          });
        });

        context('when the sender is not the owner', () => {
          it('non-owner cannot initialize the pool', async () => {
            await expect(pool.init({ from: other, initialBalances })).to.be.revertedWith(
              'revert with reason "BAL#328"'
            );
          });

          it('non-owners cannot join the pool', async () => {
            await expect(pool.joinGivenIn({ from: other, amountsIn: initialBalances })).to.be.revertedWith(
              'revert with reason "BAL#328"'
            );
          });

          it('non-owners cannot update weights', async () => {
            const now = await currentTimestamp();

            await expect(pool.updateWeightsGradually(other, now, now, weights)).to.be.revertedWith(
              'revert with reason "BAL#401"'
            );
          });
        });
      });
    });
  });
});
