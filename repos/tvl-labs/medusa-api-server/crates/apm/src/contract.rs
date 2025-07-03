use lazy_static::lazy_static;
use prometheus::{register_int_gauge, register_int_gauge_vec, IntGauge, IntGaugeVec};

pub const CONNECTED_SOLVER_GAUGE_NAME: &str = "connected_solver";
pub const OPEN_INTENT_GAUGE_NAME: &str = "open_intent";
pub const SOLVED_INTENT_GAUGE_NAME: &str = "solved_intent";
pub const FAILED_INTENT_GAUGE_NAME: &str = "failed_intent";
pub const CANCELED_INTENT_GAUGE_NAME: &str = "canceled_intent";
pub const EXPIRED_INTENT_GAUGE_NAME: &str = "expired_intent";
pub const VALID_SOLUTION_GAUGE_NAME: &str = "valid_solution";
pub const FAILED_SOLUTION_GAUGE_NAME: &str = "failed_solution";
pub const M_TOKEN_BALANCE_GAUGE_NAME: &str = "m_token_balance";

lazy_static! {
    pub static ref CONNECTED_SOLVER_GAUGE: IntGauge =
        register_int_gauge!(CONNECTED_SOLVER_GAUGE_NAME, "Count of connected solver").unwrap();
    pub static ref OPEN_INTENT_GAUGE: IntGauge =
        register_int_gauge!(OPEN_INTENT_GAUGE_NAME, "Count of open intent").unwrap();
    pub static ref SOLVED_INTENT_GAUGE: IntGauge =
        register_int_gauge!(SOLVED_INTENT_GAUGE_NAME, "Count of solved intent").unwrap();
    pub static ref FAILED_INTENT_GAUGE: IntGauge =
        register_int_gauge!(FAILED_INTENT_GAUGE_NAME, "Count of failed intent").unwrap();
    pub static ref CANCELED_INTENT_GAUGE: IntGauge =
        register_int_gauge!(CANCELED_INTENT_GAUGE_NAME, "Count of canceled intent").unwrap();
    pub static ref EXPIRED_INTENT_GAUGE: IntGauge =
        register_int_gauge!(EXPIRED_INTENT_GAUGE_NAME, "Count of expired intent").unwrap();
    pub static ref VALID_SOLUTION_GAUGE: IntGauge =
        register_int_gauge!(VALID_SOLUTION_GAUGE_NAME, "Count of valid solution").unwrap();
    pub static ref FAILED_SOLUTION_GAUGE: IntGauge =
        register_int_gauge!(FAILED_SOLUTION_GAUGE_NAME, "Count of failed solution").unwrap();
    pub static ref M_TOKEN_BALANCE_GAUGE: IntGaugeVec = register_int_gauge_vec!(
        M_TOKEN_BALANCE_GAUGE_NAME,
        "Each m_token balance",
        &["token_address"]
    )
    .unwrap();
}

pub fn connected_solver_gauge() -> &'static IntGauge {
    &CONNECTED_SOLVER_GAUGE
}

pub fn open_intent_gauge() -> &'static IntGauge {
    &OPEN_INTENT_GAUGE
}

pub fn solved_intent_gauge() -> &'static IntGauge {
    &SOLVED_INTENT_GAUGE
}

pub fn failed_intent_gauge() -> &'static IntGauge {
    &FAILED_INTENT_GAUGE
}

pub fn canceled_intent_gauge() -> &'static IntGauge {
    &CANCELED_INTENT_GAUGE
}

pub fn expired_intent_gauge() -> &'static IntGauge {
    &EXPIRED_INTENT_GAUGE
}

pub fn valid_solution_gauge() -> &'static IntGauge {
    &VALID_SOLUTION_GAUGE
}

pub fn failed_solution_gauge() -> &'static IntGauge {
    &FAILED_SOLUTION_GAUGE
}

pub fn m_token_balance_gauge() -> &'static IntGaugeVec {
    &M_TOKEN_BALANCE_GAUGE
}

pub fn m_token_set_balance(token_address: &str, balance: i64) {
    let gauge = m_token_balance_gauge();
    gauge.with_label_values(&[token_address]).set(balance);
}
