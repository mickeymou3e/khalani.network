import torch
import numpy as np

def Yuma1(W, S):
    rho = 10
    kappa = 0.5

    def normalize_max(W):
        W = (W.T / (W.max(dim=1).values +  1e-6)).T
        W = (W * 65535).int()
        return W

    def normalize_sum(W):
        W = (W.T / (W.sum(dim=1))).T
        W = W.nan_to_num(0)
        W = (W * 65535).int()
        return W

    W = normalize_sum(normalize_max(W))
    S = S / S.sum()
    T = (S.view(-1 , 1) * ( W > 0 )).sum(dim =  0)
    C = 1 / (1 + torch.exp(-(rho * (T - kappa))))
    R = (S.view(-1 , 1) * W).sum(dim=0)
    I = C * R 
    
    return {
        'weight': W,
        'stake': S,
        'trust': T,
        'consensus': C,
        'rank': R,
        'incentive': I/I.sum()
    }

def Yuma2(W, S, B_old=None, kappa=0.5, bond_penalty=1, bond_alpha=0.1, liquid_alpha = False, alpha_high = 0.9, alpha_low = 0.7, precision = 10000, override_consensus_high = None, override_consensus_low = None):
    # === Weight === 
    W = (W.T / (W.sum(dim=1) +  1e-6)).T
    
    # === Stake ===
    S = S / S.sum()

    # === Prerank ===
    P = (S.view(-1, 1) * W).sum(dim=0)

    # === Consensus ===
    C = torch.zeros(W.shape[1])

    for i, miner_weight in enumerate(W.T):
        c_high = 1
        c_low = 0
        
        while (c_high - c_low) > 1/precision:
            c_mid = (c_high + c_low) / 2

            _c_sum = (miner_weight > c_mid) * S
            if sum(_c_sum) > kappa:
                c_low = c_mid
            else:
                c_high = c_mid

        C[i] = c_high

    C = (C / C.sum() * 65535).int() / 65535

    # === Consensus cliped weight ===
    W_clipped = torch.min(W, C)

    # === Rank ===
    R = (S.view(-1, 1) * W_clipped).sum(dim=0)

    # === Incentive ===
    I = (R / R.sum()).nan_to_num(0)

    # === Trusts ===
    T = (R / P).nan_to_num(0)
    T_v = (W_clipped).sum(dim=1) / W.sum(dim=1)

    # === Bonds ===
    W_b = (1 - bond_penalty) * W + bond_penalty * W_clipped
    B = S.view(-1, 1) * W_b / (S.view(-1, 1) * W_b).sum(dim=0)
    B = B.nan_to_num(0)

    a = b = None
    if liquid_alpha:
        if override_consensus_high == None:
            consensus_high = C.quantile(0.75)
        else:
            consensus_high = override_consensus_high 
        
        if override_consensus_low == None:
            consensus_low = C.quantile(0.25)
        else:
            consensus_low = override_consensus_low 

        if consensus_high == consensus_low:
            consensus_high = C.quantile(0.99)
        a = (math.log(1/alpha_high - 1) - math.log(1/ alpha_low - 1) ) / (consensus_low - consensus_high) 
        b = math.log(1/ alpha_low - 1) + a * consensus_low 
        alpha = 1 / (1 + math.e **(-a *C + b)) # alpha to the old weight
        bond_alpha = 1 - torch.clip(alpha, alpha_low, alpha_high)

    if B_old != None:
        B_ema = bond_alpha * B + (1 - bond_alpha) * B_old
    else:
        B_ema = B

    # === Dividend ===
    D = (B_ema * I).sum(dim=1)
    D_normalized = D / D.sum()

    return {
        "weight": W,
        "stake": S,
        "server_prerank": P,
        "server_consensus_weight": C,
        "consensus_clipped_weight": W_clipped,
        "server_rank": R,
        "server_incentive": I,
        "server_trust": T,
        "validator_trust": T_v,
        "weight_for_bond": W_b,
        "validator_bond": B,
        "validator_ema_bond": B_ema,
        "validator_reward": D,
        "validator_reward_normalized": D_normalized,
        "bond_alpha": bond_alpha,
        "alpha_a": a,
        "alpha_b": b
    }