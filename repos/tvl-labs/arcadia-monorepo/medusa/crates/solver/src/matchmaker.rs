use std::cmp::Ordering;
use std::collections::{BTreeMap, BTreeSet, BinaryHeap};
use std::convert::From;
use std::time::{SystemTime, UNIX_EPOCH};

pub use alloy::primitives::{Address, U256};
use medusa_types::{Outcome, Receipt, *};
type TokenType = Address;

fn current_timestamp() -> U256 {
    U256::from(
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs(),
    )
}
#[derive(PartialEq, Eq, PartialOrd, Ord, Debug, Clone)]
struct Supply {
    mtoken: TokenType,
    amt: U256,
    from: IntentId,
}

#[derive(PartialEq, Eq, PartialOrd, Ord, Debug, Clone)]
struct Demand {
    asks: BTreeMap<TokenType, U256>,
    match_rule: OutcomeAssetStructure,
    fill_rule: FillStructure,
    to: IntentId,
}

impl From<&Intent> for Supply {
    fn from(intent: &Intent) -> Self {
        Supply {
            mtoken: intent.src_m_token,
            amt: intent.src_amount,
            from: intent.intent_id(),
        }
    }
}

impl From<&Intent> for Demand {
    fn from(intent: &Intent) -> Self {
        if intent.outcome.fill_structure == FillStructure::PercentageFilled {
            panic!("Cannot construct user demand from liquidity intent")
        }
        let asks: BTreeMap<_, _> = intent
            .outcome
            .m_tokens
            .iter()
            .zip(intent.outcome.m_amounts.iter())
            .map(|(token, amt)| (*token, *amt))
            .collect();

        Demand {
            asks,
            match_rule: intent.outcome.outcome_asset_structure.clone(),
            fill_rule: intent.outcome.fill_structure.clone(),
            to: intent.intent_id(),
        }
    }
}

#[derive(PartialEq, Eq, PartialOrd, Ord, Debug, Clone)]
struct LiquidityIntent {
    asks: BTreeMap<TokenType, U256>,
    intent_id: IntentId,
    src_mtoken: TokenType,
    src_amt: U256,
    author: Address,
    ttl: U256,
    desired_outcome_tokens: Vec<TokenType>,
    desired_outcome_amounts: Vec<U256>,
    outcome_assest_structure: OutcomeAssetStructure,
    fill_structure: FillStructure,
}

impl From<&Intent> for LiquidityIntent {
    fn from(intent: &Intent) -> Self {
        if intent.outcome.fill_structure != FillStructure::PercentageFilled {
            panic!(
                "Cannot construct liquidity from an intent without FillStructure::PercentageFilled"
            )
        }
        let asks: BTreeMap<_, _> = intent
            .outcome
            .m_tokens
            .iter()
            .zip(intent.outcome.m_amounts.iter())
            .map(|(token, amt)| (*token, *amt))
            .collect();
        LiquidityIntent {
            asks,
            intent_id: intent.intent_id(),
            src_mtoken: intent.src_m_token,
            src_amt: intent.src_amount,
            author: intent.author,
            ttl: intent.ttl,
            desired_outcome_tokens: intent.outcome.m_tokens.clone(),
            desired_outcome_amounts: intent.outcome.m_amounts.clone(),
            outcome_assest_structure: intent.outcome.outcome_asset_structure.clone(),
            fill_structure: intent.outcome.fill_structure.clone(),
        }
    }
}

type ConvertAmt = U256;
type Percentage = U256;
type RoutingMultiEdge = BTreeSet<(IntentId, ConvertAmt, Percentage)>;
type RoutingGraph = BTreeMap<TokenType, BTreeMap<TokenType, RoutingMultiEdge>>;
#[derive(Debug, Clone, Copy)]
struct RoutingEdge {
    from: IntentId,
    to: IntentId,
    from_token: TokenType,
    to_token: TokenType,
    spend_amt: U256,
    convert_amt: U256,
}

type Path = Vec<RoutingEdge>;

impl Ord for RoutingEdge {
    fn cmp(&self, other: &Self) -> Ordering {
        self.convert_amt.cmp(&other.convert_amt)
    }
}
impl PartialOrd for RoutingEdge {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
impl PartialEq for RoutingEdge {
    fn eq(&self, other: &Self) -> bool {
        self.convert_amt == other.convert_amt
    }
}
impl Eq for RoutingEdge {}

#[derive(PartialEq, Eq, PartialOrd, Ord, Debug, Clone)]
pub struct LiquidityMatcher {
    liquidity_routing_graph: RoutingGraph,
    liquidities: BTreeMap<IntentId, LiquidityIntent>,
    liquidities_on_hold: BTreeSet<IntentId>,
}

impl LiquidityMatcher {
    pub fn new() -> Self {
        LiquidityMatcher {
            liquidity_routing_graph: BTreeMap::new(),
            liquidities: BTreeMap::new(),
            liquidities_on_hold: BTreeSet::new(),
        }
    }

    // fn from_intent(intent: &Intent) -> Self {
    //     if intent.outcome.fill_structure != FillStructure::PercentageFilled {
    //         panic!("can only initialize with lp intent");
    //     }
    //     let liquidity = LiquidityIntent::from(intent);
    //     let mut graph = BTreeMap::new();

    //     graph.insert(liquidity.src_mtoken, BTreeMap::new());
    //     for (token, percentage) in liquidity.asks.iter() {
    //         graph.insert(*token, BTreeMap::new());
    //         graph.get_mut(token).unwrap().insert(
    //             liquidity.src_mtoken,
    //             BTreeSet::from([(liquidity.intent_id, liquidity.src_amt, *percentage)]),
    //         );
    //     }
    //     LiquidityMatcher {
    //         liquidity_routing_graph: graph,
    //         liquidities: BTreeMap::from([(liquidity.intent_id, liquidity)]),
    //         liquidities_on_hold: BTreeSet::new(),
    //     }
    // }

    fn add_liquidity(&mut self, liquidity: LiquidityIntent) {
        let graph = &mut self.liquidity_routing_graph;

        for (dest_token, percentage) in liquidity.asks.iter() {
            let routing = graph.entry(*dest_token).or_default();
            routing.entry(liquidity.src_mtoken).or_default().insert((
                liquidity.intent_id,
                liquidity.src_amt,
                *percentage,
            ));
        }
        self.liquidities.insert(liquidity.intent_id, liquidity);
    }

    fn find_best_path(
        &self,
        supply: &Supply,
        demand: &Demand,
    ) -> Option<(Vec<TokenType>, Vec<U256>, Path)> {
        let mut best_path = Vec::new();
        match demand.match_rule {
            OutcomeAssetStructure::AnySingle => {
                let mut max_route: BTreeMap<TokenType, (IntentId, U256)> = BTreeMap::new();
                let mut queue = BinaryHeap::new();
                let mut prev = BTreeMap::new();
                queue.push(RoutingEdge {
                    from: supply.from,
                    to: supply.from,
                    spend_amt: supply.amt,
                    convert_amt: supply.amt,
                    from_token: supply.mtoken,
                    to_token: supply.mtoken,
                });
                while !queue.is_empty() {
                    let item = queue.pop().unwrap();
                    max_route
                        .entry(item.to_token)
                        .and_modify(|(intent, amt)| {
                            if item.convert_amt > *amt {
                                *intent = item.to;
                                *amt = item.convert_amt
                            }
                        })
                        .or_insert((item.to, item.convert_amt));
                    prev.insert(item.to, item);
                    if demand
                        .asks
                        .keys()
                        .all(|token| max_route.contains_key(token))
                    {
                        break;
                    }
                    if let Some(neighborhood) = self.liquidity_routing_graph.get(&item.to_token) {
                        for token in neighborhood.keys() {
                            if !max_route.contains_key(token) {
                                for (intent_id, amt, percentage) in neighborhood.get(token).unwrap()
                                {
                                    if self.liquidities_on_hold.contains(intent_id) {
                                        continue;
                                    }
                                    let convert_amt = item.convert_amt
                                        * U256::from(1000_000000000000000000_u128)
                                        / (U256::from(1000_000000000000000000_u128) + percentage);
                                    if convert_amt <= *amt {
                                        queue.push(RoutingEdge {
                                            from: item.to,
                                            to: *intent_id,
                                            spend_amt: item.convert_amt,
                                            convert_amt,
                                            from_token: item.to_token,
                                            to_token: *token,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                let mut tokens = Vec::new();
                let mut amts = Vec::new();

                for token in demand.asks.keys() {
                    if let Some((_, amt)) = max_route.get(token) {
                        tokens.push(*token);
                        amts.push(*amt);
                    }
                }
                if tokens.is_empty() {
                    return None; // cannot solve
                }

                let best_single_token = tokens
                    .iter()
                    .zip(amts.iter())
                    .max_by_key(|pair| pair.1)
                    .unwrap()
                    .0;

                let mut backtrace_intent = max_route.get(best_single_token).unwrap().0;
                while backtrace_intent != supply.from {
                    let edge = prev.get(&backtrace_intent).unwrap();
                    best_path.push(*edge);
                    backtrace_intent = edge.from;
                }
                best_path.reverse();
                Some((tokens, amts, best_path))
            }
            _ => todo!(),
        }
    }

    pub fn refine_intent(&self, intent: &Intent) -> Option<Intent> {
        if intent.outcome.fill_structure != FillStructure::Exact {
            panic!("Only support generating refinement for FillStructure::Exact")
        }
        let supply = Supply::from(intent);
        let demand = Demand::from(intent);
        if let Some((tokens, amts, _)) = self.find_best_path(&supply, &demand) {
            return Some(Intent {
                author: intent.author,
                ttl: intent.ttl,
                nonce: intent.nonce,
                src_m_token: intent.src_m_token,
                src_amount: intent.src_amount,
                outcome: Outcome {
                    m_tokens: tokens.clone(),
                    m_amounts: amts.clone(),
                    outcome_asset_structure: intent.outcome.outcome_asset_structure.clone(),
                    fill_structure: intent.outcome.fill_structure.clone(),
                },
            });
        }
        None
    }

    pub fn try_match(&mut self, intent: &Intent) -> Option<Solution> {
        match intent.outcome.fill_structure {
            FillStructure::Exact => {
                let supply = Supply::from(intent);
                let demand = Demand::from(intent);
                if let Some((tokens, amts, path)) = self.find_best_path(&supply, &demand) {
                    let (best_token, best_amt) = tokens
                        .iter()
                        .zip(amts.iter())
                        .max_by_key(|item| item.1)
                        .unwrap();
                    if !demand.asks.iter().any(|(_, amt)| amt == best_amt) {
                        return None;
                    }
                    let mut intent_ids = vec![intent.intent_id()];
                    let mut receipt_outputs = Vec::new();
                    let mut intent_outputs = Vec::new();
                    let mut spend_graph = Vec::new();
                    let mut fill_graph = Vec::new();
                    for edge in path.iter() {
                        if !intent_ids.contains(&edge.from) {
                            intent_ids.push(edge.from);
                        }
                        if !intent_ids.contains(&edge.to) {
                            intent_ids.push(edge.to);
                        }
                    }
                    let find_id_idx = |vec: &Vec<IntentId>, id: IntentId| {
                        vec.iter().position(|&x| x == id).unwrap() as u64
                    };
                    for edge in path.iter() {
                        let liquidity_used = self.liquidities.get(&edge.to).unwrap();
                        receipt_outputs.push(Receipt {
                            m_token: edge.from_token,
                            m_token_amount: edge.spend_amt,
                            owner: liquidity_used.author,
                            intent_hash: edge.from,
                        });
                        // let mut m_tokens = Vec::new();
                        // let mut m_amounts = Vec::new();
                        // for (token, amt) in liquidity_used.asks.iter() {
                        //     m_tokens.push(*token);
                        //     m_amounts.push(*amt);
                        // }
                        if liquidity_used.src_amt > edge.convert_amt {
                            intent_outputs.push(Intent {
                                author: liquidity_used.author,
                                ttl: liquidity_used.ttl,
                                nonce: U256::MAX - current_timestamp(),
                                src_m_token: liquidity_used.src_mtoken,
                                src_amount: liquidity_used.src_amt - edge.convert_amt,
                                outcome: Outcome {
                                    m_tokens: liquidity_used.desired_outcome_tokens.clone(),
                                    m_amounts: liquidity_used.desired_outcome_amounts.clone(),
                                    outcome_asset_structure: liquidity_used
                                        .outcome_assest_structure
                                        .clone(),
                                    fill_structure: liquidity_used.fill_structure.clone(),
                                },
                            });
                            spend_graph.push(MoveRecord {
                                src_idx: find_id_idx(&intent_ids, edge.to),
                                output_idx: OutputIdx {
                                    out_type: OutType::Intent,
                                    out_idx: (intent_outputs.len() - 1) as u64,
                                },
                                qty: liquidity_used.src_amt - edge.convert_amt,
                            });
                            fill_graph.push(FillRecord {
                                in_idx: find_id_idx(&intent_ids, edge.to),
                                out_idx: (intent_outputs.len() - 1) as u64,
                                out_type: OutType::Intent,
                            });
                        }

                        spend_graph.push(MoveRecord {
                            src_idx: find_id_idx(&intent_ids, edge.from),
                            output_idx: OutputIdx {
                                out_type: OutType::Receipt,
                                out_idx: (receipt_outputs.len() - 1) as u64,
                            },
                            qty: edge.spend_amt,
                        });
                        fill_graph.push(FillRecord {
                            in_idx: find_id_idx(&intent_ids, edge.to),
                            out_idx: (receipt_outputs.len() - 1) as u64,
                            out_type: OutType::Receipt,
                        });
                    }
                    // assert_eq!(*intent_ids.first().unwrap(), intent.intent_id());
                    receipt_outputs.push(Receipt {
                        m_token: *best_token,
                        m_token_amount: *best_amt,
                        owner: intent.author,
                        intent_hash: *intent_ids.last().unwrap(),
                    });

                    spend_graph.push(MoveRecord {
                        src_idx: (intent_ids.len() - 1) as u64,
                        output_idx: OutputIdx {
                            out_type: OutType::Receipt,
                            out_idx: (receipt_outputs.len() - 1) as u64,
                        },
                        qty: *best_amt,
                    });

                    fill_graph.push(FillRecord {
                        in_idx: 0,
                        out_idx: (receipt_outputs.len() - 1) as u64,
                        out_type: OutType::Receipt,
                    });

                    return Some(Solution {
                        intent_ids,
                        intent_outputs,
                        receipt_outputs,
                        spend_graph,
                        fill_graph,
                    });
                } else {
                    return None;
                }
            }
            FillStructure::PercentageFilled => {
                self.add_liquidity(LiquidityIntent::from(intent));
            }
            _ => {
                todo!()
            }
        }
        None
    }
    pub fn contains_intent(&self, intent_id: &IntentId) -> bool {
        self.liquidities.contains_key(intent_id)
    }

    pub fn put_on_hold(&mut self, id: &IntentId) {
        if !self.contains_intent(id) {
        } else {
            self.liquidities_on_hold.insert(*id);
        }
    }

    pub fn check_on_hold(&self, id: &IntentId) -> bool {
        self.liquidities_on_hold.contains(id)
    }

    pub fn reopen_intent(&mut self, id: &IntentId) {
        if !self.contains_intent(id) {
        } else {
            self.liquidities_on_hold.remove(id);
        }
    }

    pub fn remove_intent(&mut self, intent_id: &IntentId) {
        self.liquidities.remove(intent_id);
        self.liquidities_on_hold.remove(intent_id);
        for (_, neighborhood) in self.liquidity_routing_graph.iter_mut() {
            for (_, edges) in neighborhood.iter_mut() {
                edges.retain(|x| x.0 != *intent_id);
            }
            neighborhood.retain(|_, edges| !edges.is_empty());
        }
        self.liquidity_routing_graph
            .retain(|_, neighborhood| !neighborhood.is_empty());
    }
}

pub type Matchmaker = LiquidityMatcher;

#[cfg(test)]
mod tests {
    use super::*;

    fn easy_create_intent(
        src_mtoken: u8,
        src_amt: u128,
        target_tokens: &[u8],
        target_amts: &[u128],
        fill_rule: FillStructure,
    ) -> Intent {
        Intent {
            src_m_token: Address::left_padding_from(&[src_mtoken]),
            src_amount: U256::from(src_amt),
            author: Address::left_padding_from(&[src_mtoken]),
            ttl: U256::from(0),
            nonce: U256::from(0),
            outcome: Outcome {
                m_tokens: target_tokens
                    .iter()
                    .map(|x| Address::left_padding_from(&[*x]))
                    .collect(),
                m_amounts: target_amts.iter().map(|x| U256::from(*x)).collect(),
                outcome_asset_structure: OutcomeAssetStructure::AnySingle,
                fill_structure: fill_rule,
            },
        }
    }
    #[test]
    fn test_partial_sol() {
        let lp1_intent = easy_create_intent(
            1,
            1000_000000000000000000_u128,
            &[2, 3],
            &[10_000000000000000000_u128, 15_000000000000000000_u128],
            FillStructure::PercentageFilled,
        );
        let lp1 = LiquidityIntent::from(&lp1_intent);
        let mut ps = LiquidityMatcher::new();
        ps.add_liquidity(lp1);
        let lp2_intent = easy_create_intent(
            2,
            1000_000000000000000000_u128,
            &[3],
            &[10_000000000000000000_u128],
            FillStructure::PercentageFilled,
        );
        ps.add_liquidity(LiquidityIntent::from(&lp2_intent));
        // println!("{:#?}", ps);

        let intent = easy_create_intent(
            3,
            20_000000000000000000_u128,
            &[1],
            &[100_000000000000000000_u128],
            FillStructure::Exact,
        );
        let refinement = ps.refine_intent(&intent).unwrap();
        let intent = refinement.clone();
        let sol = ps.try_match(&refinement).unwrap();
        println!("intent {:#?}", intent);
        println!("sol {:#?}", sol);
        let id = sol.intent_ids[0];
        let ids = sol.intent_ids.clone();
        let receipts = sol.receipt_outputs.clone();
        let fillers: Vec<FillRecord> = sol
            .fill_graph
            .iter()
            .filter(|x| ids[x.in_idx as usize] == id)
            .cloned()
            .collect();
        println!("filler {:#?}", fillers);

        assert_eq!(fillers.len(), 1);
        let fillrec = fillers[0].clone();
        assert_eq!(fillrec.out_type, OutType::Receipt);
        assert_eq!(
            intent.outcome.m_tokens[0],
            receipts[fillrec.out_idx as usize].m_token
        );
        assert_eq!(
            intent.outcome.m_amounts[0],
            receipts[fillrec.out_idx as usize].m_token_amount
        );
        assert_eq!(intent.author, receipts[fillrec.out_idx as usize].owner);
    }
}
