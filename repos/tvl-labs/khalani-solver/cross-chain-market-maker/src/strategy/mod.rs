mod grid;
#[cfg(test)]
mod tests;

use std::sync::Arc;
use std::vec;

use anyhow::Result;
use artemis_core::types::Strategy;
use async_trait::async_trait;
use ethers::types::{Address, U256};
use futures::lock::Mutex;
use intentbook_matchmaker::types::limit_order_intent::{
    LimitOrderIntent, LIMIT_ORDER_INTENT_PRICE_DECIMALS,
};
use solver_common::config::wallet::WalletSigner;
use solver_common::inventory::{amount::Amount, token::Token};
use solver_common::types::decimal::Decimal;
use solver_common::types::intent_id::IntentId;
use tracing::info;

use crate::event::TakeLimitOrderInfo;
use crate::state::{IntentState, LimitOrderIntentState};
use crate::strategy::grid::{Grid, BASE_PRICE};
use crate::types::LimitOrderData;
use crate::{action::Action, event::Event, state::manager::StateManager};

pub struct CCMMStrategy<S: StateManager> {
    ccmm_address: Address,
    signer: WalletSigner,

    state_manager: Arc<Mutex<S>>,
    base_token_balance: TokenBalance,
    quote_token_balance: TokenBalance,
    grid: Grid,
}

impl<S> CCMMStrategy<S>
where
    S: StateManager + Sync + Send,
{
    /// Create a new CCMM strategy bot.
    pub fn new(
        ccmm_address: Address,
        signer: WalletSigner,
        state_manager: Arc<Mutex<S>>,
        base_token: Token,
        base_token_balance: Amount,
        quote_token: Token,
        quote_token_balance: Amount,
    ) -> Self {
        let mut strategy = Self {
            ccmm_address,
            signer,
            state_manager,
            base_token_balance: TokenBalance::new(base_token),
            quote_token_balance: TokenBalance::new(quote_token),
            grid: Grid::init(),
        };

        strategy.base_token_balance.balance = base_token_balance;
        strategy.quote_token_balance.balance = quote_token_balance;

        strategy
    }

    /// Create the limit order book when the limit orders are created and in pending state.
    /// The orders are in pending state and should not change the placed balance. The balance
    /// should be changed after the orders are confirmed.
    async fn create_order_state(&self, orders: Vec<LimitOrderIntent>) {
        let mut state_manager = self.state_manager.lock().await;

        orders.into_iter().for_each(|order| {
            let state = IntentState::new(order.clone());
            state_manager.create_order_state(state);
        });
    }

    /// Update the limit order intents after they are confirmed. In this process, it should change
    /// the balance of the base token or quote token.
    async fn update_after_confirmed(&mut self, ids: &[IntentId]) {
        let mut state_manager = self.state_manager.lock().await;

        for id in ids.iter() {
            let intent = state_manager.get_state(id).cloned().unwrap();
            let amount = intent.intent.volume;

            // Update after take an order:
            // If is ask, the inputToken is BaseToken and the output is QuoteToken
            // If is bid, the inputToken is QuoteToken and the outToken is BaseToken
            if self.is_bid(&intent.intent.token) {
                self.base_token_balance.placed_amount =
                    self.base_token_balance.placed_amount + amount;
                self.base_token_balance.balance = self.base_token_balance.balance - amount;
            } else {
                self.quote_token_balance.placed_amount =
                    self.quote_token_balance.placed_amount + amount;
                self.quote_token_balance.balance = self.quote_token_balance.balance - amount;
            }

            // Increase the corresponding grid level amount.
            let grid_index = self.grid_index(&intent.intent.token, intent.intent.price);
            self.grid.increase(grid_index, amount);

            state_manager.update_state_with(id, |state| {
                state.state = LimitOrderIntentState::Confirmed;
            });
        }
    }

    async fn update_after_taken(&mut self, infos: &[TakeLimitOrderInfo]) {
        let mut state_manager = self.state_manager.lock().await;

        for info in infos.iter() {
            let intent_state = state_manager.get_state(&info.intent_id).unwrap();
            let amount = if let Some(partial) = info.fill_volume {
                Decimal::from_base_units(partial, LIMIT_ORDER_INTENT_PRICE_DECIMALS)
            } else {
                intent_state.intent.volume
            };

            // Update after place an order:
            // If is ask, some placed quote token change to the base token balance.
            // If is bid, some placed base token change to the quote token balance.
            if self.is_bid(&intent_state.intent.token) {
                self.base_token_balance.placed_amount =
                    self.base_token_balance.placed_amount - amount;
                self.quote_token_balance.balance = self.quote_token_balance.balance + amount;
            } else {
                self.quote_token_balance.placed_amount =
                    self.quote_token_balance.placed_amount - amount;
                self.base_token_balance.balance = self.base_token_balance.balance + amount;
            }

            // Decrease the corresponding grid level amount.
            let grid_index = self.grid_index(&intent_state.intent.token, intent_state.intent.price);
            self.grid.decrease(grid_index, amount);

            state_manager.update_state_with(&info.intent_id, |state| {
                state.intent.volume = state.intent.volume - amount;
            });
        }
    }

    /// Cancel the orders and remove them from the state manager. Change the balance of the
    /// base token or quote token.
    async fn cancel_orders_state(&mut self, ids: &[IntentId]) {
        let mut state_manager = self.state_manager.lock().await;

        for id in ids.iter() {
            let intent_state = state_manager.remove(id).unwrap();
            let amount = intent_state.intent.volume;

            // Update after place an order:
            // If is ask, the inputToken is BaseToken and the output is QuoteToken
            // If is bid, the inputToken is QuoteToken and the outToken is BaseToken
            if self.is_bid(&intent_state.intent.token) {
                self.base_token_balance.placed_amount =
                    self.base_token_balance.placed_amount - amount;
                self.base_token_balance.balance = self.base_token_balance.balance + amount;
            } else {
                self.quote_token_balance.placed_amount =
                    self.quote_token_balance.placed_amount - amount;
                self.quote_token_balance.balance = self.quote_token_balance.balance + amount;
            }

            // Decrease the corresponding grid level amount.
            let grid_index = self.grid_index(&intent_state.intent.token, intent_state.intent.price);
            self.grid.decrease(grid_index, amount);

            state_manager.remove(id);
        }
    }

    /// Refresh the current limit order book with the embedded strategy and generate
    /// the new limit orders.
    async fn refresh(&self) -> Result<Vec<Action>> {
        let grid_levels_count = U256::from(5u64);
        let total_base_balance = self.base_token_balance.total();
        let total_quote_balance = self.quote_token_balance.total();
        let average_ask_amount = total_quote_balance / grid_levels_count;
        let average_bid_amount = total_base_balance / grid_levels_count;

        let ask_cancel_prices = self.grid.calculate_cancel_ask_prices(average_ask_amount);
        let bid_cancel_prices = self.grid.calculate_cancel_bid_prices(average_bid_amount);

        let grid_orders = self
            .grid
            .generate_inner_orders(average_ask_amount, average_bid_amount);

        let cancel_intents = self
            .generate_cancel_intents(ask_cancel_prices, bid_cancel_prices)
            .await;
        let place_intents = self.generate_place_intents(grid_orders).await?;

        self.create_order_state(place_intents.clone()).await;

        let mut actions = Vec::with_capacity(2);
        if !cancel_intents.is_empty() {
            actions.push(Action::CancelLimitOrders(cancel_intents));
        }
        if !place_intents.is_empty() {
            actions.push(Action::PlaceLimitOrders(place_intents));
        }

        Ok(actions)
    }

    async fn generate_cancel_intents(
        &self,
        ask_cancel_prices: Vec<U256>,
        bid_cancel_prices: Vec<U256>,
    ) -> Vec<IntentId> {
        let mut cancel_intents = Vec::with_capacity(10);
        let current_orders = self.get_current_orders().await;

        current_orders.iter().for_each(|order| {
            if (!self.is_bid(&order.intent.token))
                && ask_cancel_prices.contains(&order.intent.price)
            {
                cancel_intents.push(order.intent_id())
            }

            if self.is_bid(&order.intent.token) && bid_cancel_prices.contains(&order.intent.price) {
                cancel_intents.push(order.intent_id())
            }
        });

        cancel_intents
    }

    async fn generate_place_intents(
        &self,
        grid_orders: Vec<LimitOrderData>,
    ) -> Result<Vec<LimitOrderIntent>> {
        let mut place_intents = Vec::with_capacity(10);

        let ask_template = LimitOrderIntent {
            intent_id: Default::default(),
            author: self.ccmm_address,
            token: self.quote_token_balance.token.clone(),
            out_token: self.base_token_balance.token.clone(),
            volume: Amount::default(),
            price: U256::default(),
            signature: Default::default(),
        };

        let bid_template = LimitOrderIntent {
            intent_id: Default::default(),
            author: self.ccmm_address,
            token: self.base_token_balance.token.clone(),
            out_token: self.quote_token_balance.token.clone(),
            volume: Amount::default(),
            price: U256::default(),
            signature: Default::default(),
        };

        for order in grid_orders.iter() {
            if order.direction.is_bid() {
                let mut intent = bid_template.clone();
                intent.volume = order.amount;
                intent.price = order.price;
                place_intents.push(intent.sign(&self.signer).await?.update_intent_id());
            } else {
                let mut intent = ask_template.clone();
                intent.volume = order.amount;
                intent.price = order.price;
                place_intents.push(intent.sign(&self.signer).await?.update_intent_id());
            }
        }

        Ok(place_intents)
    }

    async fn get_current_orders(&self) -> Vec<IntentState> {
        let state_manager = self.state_manager.lock().await;
        state_manager.get_all_states()
    }

    fn is_bid(&self, token: &Token) -> bool {
        token == &self.base_token_balance.token
    }

    fn grid_index(&self, token: &Token, price: U256) -> usize {
        if self.is_bid(token) {
            return (price - BASE_PRICE).as_usize();
        }

        (price - BASE_PRICE).as_usize() + 5
    }

    #[cfg(test)]
    pub fn get_balance(&self) -> (TokenBalance, TokenBalance) {
        (
            self.base_token_balance.clone(),
            self.quote_token_balance.clone(),
        )
    }

    #[cfg(test)]
    pub fn get_grid(&self) -> Grid {
        self.grid.clone()
    }
}

#[async_trait]
impl<S> Strategy<Event, Action> for CCMMStrategy<S>
where
    S: StateManager + Sync + Send,
{
    async fn sync_state(&mut self) -> Result<()> {
        info!("Syncing state");

        Ok(())
    }

    async fn process_event(&mut self, event: Event) -> Vec<Action> {
        match event {
            // This is the first event when the strategy bot is started.
            Event::Init => self.refresh().await.unwrap(),

            // In this case, the limit orders are placed in smart contract successfully.
            // So only create the order state and do not need to generate new actions.
            Event::LimitOrderConfirm(ids) => {
                self.update_after_confirmed(&ids).await;
                vec![]
            }

            Event::TakeLimitOrders(infos) => {
                self.update_after_taken(&infos).await;
                self.refresh().await.unwrap()
            }

            // In this case, some orders are canceled. So only remove the order state.
            Event::CancelOrdersConfirm(ids) => {
                self.cancel_orders_state(&ids).await;
                vec![]
            }
        }
    }
}

#[derive(Clone, Debug)]
pub struct TokenBalance {
    pub token: Token,
    pub placed_amount: Amount,
    pub balance: Amount,
}

impl TokenBalance {
    pub fn new(token: Token) -> Self {
        Self {
            token,
            placed_amount: Amount::default(),
            balance: Amount::default(),
        }
    }

    pub fn total(&self) -> Amount {
        self.placed_amount + self.balance
    }
}
