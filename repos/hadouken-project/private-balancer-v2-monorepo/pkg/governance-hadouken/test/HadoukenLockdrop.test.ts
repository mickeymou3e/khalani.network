import { ethers } from 'hardhat';
import { BigNumber, Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

import { time } from '@nomicfoundation/hardhat-network-helpers';
import { deploy } from '@balancer-labs/v2-helpers/src/contract';
import { expect } from 'chai';
import Token from '@balancer-labs/v2-helpers/src/models/tokens/Token';

const TIMESTAMP_DAY_OFFSET = 28;
const DUST = BigNumber.from(10).pow(9);
const AVAILABLE_LIQUIDITY = BigNumber.from(10).pow(18).mul(30);

function getTimestampAfterDays(daysAfter: number): number {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() + daysAfter + TIMESTAMP_DAY_OFFSET);
  return Math.round(dateFrom.getTime() / 1000);
}

enum LockLength {
  TwoWeeks,
  OneMonth,
  FourMonths,
  OneYear,
}

const MOCK_PRICE = BigNumber.from('1000000000000000000');

describe('HadoukenLockdrop', () => {
  let lockdrop: Contract;

  let dropToken: Token;
  let husdToken: Token;
  let triCryptoToken: Token;
  let weth: Token;
  let admin: SignerWithAddress, user: SignerWithAddress;
  const phaseOneStartTime = getTimestampAfterDays(1);

  before('setup signers', async () => {
    [admin, user] = await ethers.getSigners();
  });

  sharedBeforeEach('deploy hadouken lockdrop', async () => {
    husdToken = await Token.create({ symbol: 'HUSD' });
    triCryptoToken = await Token.create({ symbol: '3CRY' });
    dropToken = await Token.create({ symbol: 'HDK' });
    weth = await Token.create({ symbol: 'WETH' });
    lockdrop = await deploy('HadoukenLockdrop', {
      args: [
        phaseOneStartTime,
        husdToken.address,
        triCryptoToken.address,
        dropToken.address,
        weth.address,
        ethers.constants.AddressZero,
      ],
    });
  });

  describe('Phase 1', () => {
    it('Allows to lock tokens', async () => {
      const initBalance = 1000;
      const lockAmount = 500;
      await husdToken.mint(user, initBalance);
      const approvehusdToken = await husdToken.approve(lockdrop.address, lockAmount, { from: user });
      await approvehusdToken.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(2));

      await lockdrop.connect(user).lock(husdToken.address, lockAmount, LockLength.OneMonth);

      const userBalanceAfterLock = await husdToken.balanceOf(user.address);
      expect(Number(userBalanceAfterLock.toString())).to.be.eql(initBalance - lockAmount);
    });

    it('Forbids locking tokens after 4 days', async () => {
      const initBalance = 1000;
      const lockAmount = 500;
      await husdToken.mint(user, initBalance);
      const approvehusdToken = await husdToken.approve(lockdrop.address, lockAmount, { from: user });
      await approvehusdToken.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));

      await expect(lockdrop.connect(user).lock(husdToken.address, lockAmount, LockLength.OneMonth)).to.be.revertedWith(
        'phase one has ended'
      );
    });

    it('Forbids locking tokens before phase starts', async () => {
      const initBalance = 1000;
      const lockAmount = 500;
      await husdToken.mint(user, initBalance);
      const approvehusdToken = await husdToken.approve(lockdrop.address, lockAmount, { from: user });
      await approvehusdToken.wait();

      await expect(lockdrop.connect(user).lock(husdToken.address, lockAmount, LockLength.OneMonth)).to.be.revertedWith(
        'phase one has not started'
      );
    });

    it('Can finalize phase after 4 days', async () => {
      const totalWeight = 100;
      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropToken = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropToken.wait();

      const sixDaysBlockTimestamp = getTimestampAfterDays(6);
      await lockdrop.finalizePhaseOne(AVAILABLE_LIQUIDITY, totalWeight, sixDaysBlockTimestamp, MOCK_PRICE, MOCK_PRICE);
      const phaseTwoStartTime = await lockdrop.PHASE_TWO_START_TIME();

      await expect(Number(phaseTwoStartTime.toString())).to.be.eql(sixDaysBlockTimestamp);
    });

    it('Forbids finalizing phase before end time', async () => {
      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropToken = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropToken.wait();
      const totalWeight = 100;

      await time.setNextBlockTimestamp(getTimestampAfterDays(2));
      const sixDaysBlockTimestamp = getTimestampAfterDays(6);

      await expect(
        lockdrop.finalizePhaseOne(AVAILABLE_LIQUIDITY, totalWeight, sixDaysBlockTimestamp, MOCK_PRICE, MOCK_PRICE)
      ).to.be.revertedWith('phase one has not ended');
    });
  });

  describe('Phase 2', () => {
    it('Forbids users to claim drop tokens twice', async () => {
      const totalWeight = 150;
      const initBalance = 1000;
      const lockAmount = 500;
      await husdToken.mint(user, initBalance);
      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropToken = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropToken.wait();
      const approvehusdToken = await husdToken.approve(lockdrop.address, lockAmount, { from: user });
      await approvehusdToken.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(2));
      await lockdrop.connect(user).lock(husdToken.address, lockAmount, LockLength.TwoWeeks); // 500 * 0,2 * 1,5 = 150 weight

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(7));

      const lockId = 0;
      await lockdrop.connect(user).claimHDKTokens(lockId);
      const userDropTokenBalance = await dropToken.balanceOf(user.address);

      expect(userDropTokenBalance.toString()).to.be.eql(AVAILABLE_LIQUIDITY.toString());
      await expect(lockdrop.connect(user).claimHDKTokens(lockId)).to.be.revertedWith('no drop tokens to claim');
    });
    it('Allows to deposit value tokens during phase', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await weth.mint(user, initBalance);
      const approveWeth = await weth.approve(lockdrop.address, depositAmount, { from: user });
      await approveWeth.wait();
      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropToken = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropToken.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(7));
      await lockdrop.connect(user).depositPhaseTwo(0, depositAmount);

      const userBalanceAfterLock = await lockdrop.depositedPriceToken(user.address);
      expect(Number(userBalanceAfterLock.toString())).to.be.eql(depositAmount);
    });

    it('Allows to deposit drop tokens during phase', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await dropToken.mint(user, initBalance);
      const approveDropToken = await dropToken.approve(lockdrop.address, depositAmount, { from: user });
      await approveDropToken.wait();

      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(7));
      await lockdrop.connect(user).depositPhaseTwo(depositAmount, 0);

      const userBalanceAfterLock = await lockdrop.depositedHDK(user.address);
      expect(Number(userBalanceAfterLock.toString())).to.be.eql(depositAmount);
    });

    it('Forbids locking value tokens before phase starts', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await husdToken.mint(user, initBalance);
      const approvehusdToken = await husdToken.approve(lockdrop.address, depositAmount, { from: user });
      await approvehusdToken.wait();

      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(7),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(6));

      await expect(lockdrop.connect(user).depositPhaseTwo(0, depositAmount)).to.be.revertedWith(
        'phase two has not started'
      );
    });

    it('Forbids locking drop tokens before phase starts', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await dropToken.mint(user, initBalance);
      const approveDropToken = await dropToken.approve(lockdrop.address, depositAmount, { from: user });
      await approveDropToken.wait();

      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(7),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(6));

      await expect(lockdrop.connect(user).depositPhaseTwo(depositAmount, 0)).to.be.revertedWith(
        'phase two has not started'
      );
    });

    it('Forbids locking value tokens after phase starts', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await husdToken.mint(user, initBalance);
      const approvehusdToken = await husdToken.approve(lockdrop.address, depositAmount, { from: user });
      await approvehusdToken.wait();

      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(10));

      await expect(lockdrop.connect(user).depositPhaseTwo(0, depositAmount)).to.be.revertedWith('phase two has ended');
    });

    it('Forbids locking drop tokens after phase starts', async () => {
      const totalWeight = 100;
      const initBalance = 1000;
      const depositAmount = 500;
      await dropToken.mint(user, initBalance);
      const approveDropToken = await dropToken.approve(lockdrop.address, depositAmount, { from: user });
      await approveDropToken.wait();

      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(10));

      await expect(lockdrop.connect(user).depositPhaseTwo(depositAmount, 0)).to.be.revertedWith('phase two has ended');
    });

    it('Correctly calculates weight of locked tokens', async () => {
      const totalWeight = 150;
      const initBalance = 1000;
      const lockAmount = 500;
      await husdToken.mint(user, initBalance);
      await dropToken.mint(admin, AVAILABLE_LIQUIDITY.add(DUST));
      const approvehusdToken = await husdToken.approve(lockdrop.address, lockAmount, { from: user });
      await approvehusdToken.wait();

      const lockId = 0;
      await time.setNextBlockTimestamp(getTimestampAfterDays(2));
      await lockdrop.connect(user).lock(husdToken.address, lockAmount, LockLength.TwoWeeks); // 500 * 0,2 * 1,5 = 150 weight

      await time.setNextBlockTimestamp(getTimestampAfterDays(5));
      const approveDropTokenFinalize = await dropToken.approve(lockdrop.address, AVAILABLE_LIQUIDITY.add(DUST), {
        from: admin,
      });
      await approveDropTokenFinalize.wait();
      await lockdrop.finalizePhaseOne(
        AVAILABLE_LIQUIDITY,
        totalWeight,
        getTimestampAfterDays(6),
        MOCK_PRICE,
        MOCK_PRICE
      );

      await time.setNextBlockTimestamp(getTimestampAfterDays(7));
      const userCommitment = await lockdrop.phaseOneCommitments(lockId);

      expect(Number(userCommitment.weight.toString())).to.be.eql(totalWeight);
    });
  });
});
