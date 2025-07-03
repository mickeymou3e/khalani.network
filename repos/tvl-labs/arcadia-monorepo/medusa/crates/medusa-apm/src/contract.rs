use lazy_static::lazy_static;
use prometheus::{IntGauge, IntGaugeVec, register_int_gauge, register_int_gauge_vec};

pub const AUTHORIZED_SOLVER_GAUGE_NAME: &str = "authorized_solver";
pub const INTENT_COUNTER_NAME: &str = "intent";
pub const SOLVED_INTENT_COUNTER_NAME: &str = "solved_intent";
pub const FAILED_INTENT_COUNTER_NAME: &str = "failed_intent";
pub const CANCELED_INTENT_COUNTER_NAME: &str = "canceled_intent";
pub const EXPIRED_INTENT_COUNTER_NAME: &str = "expired_intent";
pub const VALID_SOLUTION_COUNTER_NAME: &str = "valid_solution";
pub const FAILED_SOLUTION_COUNTER_NAME: &str = "failed_solution";
pub const M_TOKEN_BALANCE_GAUGE_NAME: &str = "m_token_balance";
pub const TOP_N_INTENT_AUTHORS_GAUGE_NAME: &str = "top_n_intent_authors";

lazy_static! {
    pub static ref AUTHORIZED_SOLVER_GAUGE: IntGauge =
        register_int_gauge!(AUTHORIZED_SOLVER_GAUGE_NAME, "Count of authorized solvers").unwrap();
    pub static ref INTENT_COUNTER: IntGauge =
        register_int_gauge!(INTENT_COUNTER_NAME, "Count of intent").unwrap();
    pub static ref SOLVED_INTENT_COUNTER: IntGauge =
        register_int_gauge!(SOLVED_INTENT_COUNTER_NAME, "Count of solved intent").unwrap();
    pub static ref FAILED_INTENT_COUNTER: IntGauge =
        register_int_gauge!(FAILED_INTENT_COUNTER_NAME, "Count of failed intent").unwrap();
    pub static ref CANCELED_INTENT_COUNTER: IntGauge =
        register_int_gauge!(CANCELED_INTENT_COUNTER_NAME, "Count of canceled intent").unwrap();
    pub static ref EXPIRED_INTENT_COUNTER: IntGauge =
        register_int_gauge!(EXPIRED_INTENT_COUNTER_NAME, "Count of expired intent").unwrap();
    pub static ref VALID_SOLUTION_COUNTER: IntGauge =
        register_int_gauge!(VALID_SOLUTION_COUNTER_NAME, "Count of valid solution").unwrap();
    pub static ref FAILED_SOLUTION_COUNTER: IntGauge =
        register_int_gauge!(FAILED_SOLUTION_COUNTER_NAME, "Count of failed solution").unwrap();
    pub static ref M_TOKEN_BALANCE_GAUGE: IntGaugeVec = register_int_gauge_vec!(
        M_TOKEN_BALANCE_GAUGE_NAME,
        "Each m_token balance",
        &["token_address"]
    )
    .unwrap();
    pub static ref TOP_N_INTENT_AUTHORS_GAUGE: IntGaugeVec = register_int_gauge_vec!(
        TOP_N_INTENT_AUTHORS_GAUGE_NAME,
        "Top N intent authors",
        &["author"]
    )
    .unwrap();
}

pub fn authorized_solver_gauge() -> &'static IntGauge {
    &AUTHORIZED_SOLVER_GAUGE
}

pub fn intent_counter() -> &'static IntGauge {
    &INTENT_COUNTER
}

pub fn solved_intent_counter() -> &'static IntGauge {
    &SOLVED_INTENT_COUNTER
}

pub fn failed_intent_counter() -> &'static IntGauge {
    &FAILED_INTENT_COUNTER
}

pub fn canceled_intent_counter() -> &'static IntGauge {
    &CANCELED_INTENT_COUNTER
}

pub fn expired_intent_counter() -> &'static IntGauge {
    &EXPIRED_INTENT_COUNTER
}

pub fn valid_solution_counter() -> &'static IntGauge {
    &VALID_SOLUTION_COUNTER
}

pub fn failed_solution_counter() -> &'static IntGauge {
    &FAILED_SOLUTION_COUNTER
}

pub fn m_token_set_balance(token_address: &str, balance: i64) {
    let gauge = &M_TOKEN_BALANCE_GAUGE;
    gauge.with_label_values(&[token_address]).set(balance);
}

pub fn top_n_intent_authors(input: impl IntoIterator<Item = (String, i64)>) {
    let gauge = &TOP_N_INTENT_AUTHORS_GAUGE;
    for (author, count) in input {
        gauge.with_label_values(&[&author]).set(count);
    }
}
