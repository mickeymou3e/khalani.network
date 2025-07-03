use std::collections::{HashMap, HashSet};

use artemis_core::types::Strategy;

use ethers::signers::LocalWallet;
use intentbook_matchmaker::types::limit_order_intent::LIMIT_ORDER_INTENT_PRICE_DECIMALS;
use solver_common::config::chain::ChainId;
use solver_common::types::decimal::Decimal;

use crate::state::in_memory::InMemoryStateManager;

use super::*;

const CCMM_ADDRESS: Address = Address::repeat_byte(0);
const BASE_TOKEN_ADDRESS: Address = Address::repeat_byte(1);
const QUOTE_TOKEN_ADDRESS: Address = Address::repeat_byte(2);

struct TestHandle {
    state: Arc<Mutex<InMemoryStateManager>>,
    strategy: CCMMStrategy<InMemoryStateManager>,
}

impl TestHandle {
    async fn new(base_token_amount: u64, quote_token_amount: u64) -> Self {
        let state = Arc::new(Mutex::new(InMemoryStateManager::new()));
        let strategy = CCMMStrategy::new(
            CCMM_ADDRESS,
            LocalWallet::new(&mut rand::thread_rng()).into(),
            Arc::clone(&state),
            Token::new(
                ChainId::Khalani,
                BASE_TOKEN_ADDRESS,
                "BASE".to_string(),
                "BASE".to_string(),
                18,
            ),
            Decimal::from_base_units(base_token_amount.into(), LIMIT_ORDER_INTENT_PRICE_DECIMALS),
            Token::new(
                ChainId::Khalani,
                QUOTE_TOKEN_ADDRESS,
                "QUOTE".to_string(),
                "QUOTE".to_string(),
                18,
            ),
            Decimal::from_base_units(quote_token_amount.into(), LIMIT_ORDER_INTENT_PRICE_DECIMALS),
        );

        Self { state, strategy }
    }

    async fn process_event(&mut self, event: Event) -> Vec<Action> {
        self.strategy.process_event(event).await
    }

    async fn get_state(&self) -> HashMap<IntentId, IntentState> {
        self.state.lock().await.inner()
    }

    #[allow(dead_code)]
    fn get_grid(&self) -> (TokenBalance, TokenBalance, Grid) {
        let (base_token_balance, quote_token_balance) = self.strategy.get_balance();
        (
            base_token_balance,
            quote_token_balance,
            self.strategy.get_grid(),
        )
    }
}

#[tokio::test]
async fn test_strategy_bot() {
    let price_range = 95u64..=99;
    let mut test_handle = TestHandle::new(100, 100).await;

    // Test init
    let actions_0 = test_handle.process_event(Event::Init).await[0].place_orders();
    assert_eq!(actions_0.len(), 10);

    let mut tmp_set = HashSet::new();
    actions_0.iter().for_each(|act| {
        assert_eq!(
            act.volume,
            Decimal::from_base_units(20.into(), LIMIT_ORDER_INTENT_PRICE_DECIMALS)
        );
        assert!(price_range.contains(&act.price.as_u64()));
        tmp_set.insert((act.token.clone(), act.out_token.clone(), act.price));
    });
    assert_eq!(tmp_set.len(), 10);

    // Test orders confirmed
    let actions_1 = test_handle
        .process_event(Event::LimitOrderConfirm(
            actions_0.iter().map(|act| act.intent_id).collect(),
        ))
        .await;

    assert!(actions_1.is_empty());
    test_handle.get_state().await.iter().for_each(|(_, state)| {
        assert!(state.state.is_confirmed());
    });

    // Test orders full filled
    let actions_2 = test_handle
        .process_event(Event::TakeLimitOrders(vec![TakeLimitOrderInfo {
            intent_id: actions_0[4].intent_id,
            fill_volume: None,
        }]))
        .await;
    assert_eq!(actions_2.len(), 2);
    assert_eq!(actions_2[0].cancel_orders().len(), 4);
    actions_2[1]
        .place_orders()
        .iter()
        .enumerate()
        .for_each(|(i, order)| {
            if i < 5 {
                assert_eq!(
                    order.volume,
                    Decimal::from_base_units(16.into(), LIMIT_ORDER_INTENT_PRICE_DECIMALS)
                );
            } else {
                assert_eq!(
                    order.volume,
                    Decimal::from_base_units(4.into(), LIMIT_ORDER_INTENT_PRICE_DECIMALS)
                );
            }
        });

    // Test orders canceled and confirmed
    let actions_3 = test_handle
        .process_event(Event::CancelOrdersConfirm(actions_2[0].cancel_orders()))
        .await;
    assert!(actions_3.is_empty());
    let action_4 = test_handle
        .process_event(Event::LimitOrderConfirm(
            actions_2[1]
                .place_orders()
                .iter()
                .map(|act| act.intent_id)
                .collect(),
        ))
        .await;
    assert!(action_4.is_empty());
    println!("{:?}", test_handle.get_grid());

    // Test order partial filled
    let actions_5 = test_handle
        .process_event(Event::TakeLimitOrders(vec![TakeLimitOrderInfo {
            intent_id: actions_0[9].intent_id,
            fill_volume: Some(10.into()),
        }]))
        .await;
    assert_eq!(actions_5[0].cancel_orders().len(), 8);
}

#[allow(dead_code)]
fn print<T: std::fmt::Debug>(list: &[T]) {
    list.iter().for_each(|item| println!("{:?}", item));
}
