use std::{collections::HashSet, sync::Arc, time::Duration};

use apm::{
    canceled_intent_gauge, connected_solver_gauge, expired_intent_gauge, failed_intent_gauge,
    failed_solution_gauge, m_token_set_balance, open_intent_gauge, solved_intent_gauge,
    valid_solution_gauge, CANCELED_INTENT_GAUGE_NAME, CONNECTED_SOLVER_GAUGE_NAME,
    EXPIRED_INTENT_GAUGE_NAME, FAILED_INTENT_GAUGE_NAME, FAILED_SOLUTION_GAUGE_NAME,
    METRICS_BUFFER, M_TOKEN_BALANCE_GAUGE_NAME, OPEN_INTENT_GAUGE_NAME, SOLVED_INTENT_GAUGE_NAME,
    VALID_SOLUTION_GAUGE_NAME,
};
use prometheus::proto::MetricFamily;
use protobuf::Message;
use tokio::time::sleep;

use crate::storage::InnerStore;

const MINUTE: Duration = Duration::from_secs(60);

pub async fn run_metrics_wal(db: Arc<InnerStore>) {
    let mut metrics_set = HashSet::new();
    metrics_set.insert(CONNECTED_SOLVER_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(OPEN_INTENT_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(SOLVED_INTENT_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(FAILED_INTENT_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(CANCELED_INTENT_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(EXPIRED_INTENT_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(VALID_SOLUTION_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(FAILED_SOLUTION_GAUGE_NAME.as_bytes().to_vec());
    metrics_set.insert(M_TOKEN_BALANCE_GAUGE_NAME.as_bytes().to_vec());

    tokio::spawn(async move {
        loop {
            let records = {
                let mut buf = METRICS_BUFFER.write();
                buf.drain(..).collect::<Vec<_>>()
            };

            for record in records.into_iter() {
                let name = record.get_name().as_bytes().to_vec();

                if !metrics_set.contains(&name) {
                    continue;
                }

                let raw = record.write_to_bytes().unwrap();
                db.db.add_metrics(&name, &raw).unwrap();
            }

            sleep(MINUTE).await;
        }
    });
}

pub fn recover_metrics(db: Arc<InnerStore>) {
    for result in db.db.metrics_iter_from_start() {
        let (name, raw_record) = result.unwrap();
        let name = String::from_utf8(name.to_vec()).unwrap();
        let record = MetricFamily::parse_from_bytes(&raw_record).unwrap();

        match name.as_str() {
            CONNECTED_SOLVER_GAUGE_NAME => {
                connected_solver_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            OPEN_INTENT_GAUGE_NAME => {
                open_intent_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            SOLVED_INTENT_GAUGE_NAME => {
                solved_intent_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            FAILED_INTENT_GAUGE_NAME => {
                failed_intent_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            CANCELED_INTENT_GAUGE_NAME => {
                canceled_intent_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            EXPIRED_INTENT_GAUGE_NAME => {
                expired_intent_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            VALID_SOLUTION_GAUGE_NAME => {
                valid_solution_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            FAILED_SOLUTION_GAUGE_NAME => {
                failed_solution_gauge().set(record.get_metric()[0].get_gauge().get_value() as i64);
            }
            M_TOKEN_BALANCE_GAUGE_NAME => {
                for m in record.get_metric() {
                    let token_address = m.get_label()[0].get_value();
                    m_token_set_balance(token_address, m.get_gauge().get_value() as i64);
                }
            }
            _ => {}
        }
    }
}
