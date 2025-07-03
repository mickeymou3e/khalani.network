use std::time::Duration;

use anyhow::Result;
use medusa_apm::{
    canceled_intent_counter, expired_intent_counter, failed_intent_counter,
    failed_solution_counter, intent_counter, solved_intent_counter, top_n_intent_authors,
    valid_solution_counter,
};
use medusa_types::{Address, IntentState};
use sea_orm::prelude::*;
use sea_orm::{DatabaseBackend, EntityTrait, Statement};

use crate::db::StorageService;
use crate::db::entities::{intent, solution};

impl StorageService {
    pub async fn get_intent_count(&self) -> Result<i64> {
        if self.db.get_database_backend() == DatabaseBackend::Postgres {
            // There are only a few statuses, so we can just sum them up to get
            // the total count.
            Ok(self
                .db
                .query_one(Statement::from_string(
                    self.db.get_database_backend(),
                    "SELECT sum(count)::BIGINT FROM intent_status_count",
                ))
                .await?
                .map_or(0, |r| r.try_get_by_index(0).unwrap()))
        } else {
            let count = intent::Entity::find().count(&self.db).await?;
            Ok(count as i64)
        }
    }

    pub async fn get_intent_status_count(&self, status: IntentState) -> Result<i64> {
        if self.db.get_database_backend() == DatabaseBackend::Postgres {
            Ok(self
                .db
                .query_one(Statement::from_sql_and_values(
                    self.db.get_database_backend(),
                    "SELECT count FROM intent_status_count WHERE status = $1",
                    [(status as i16).into()],
                ))
                .await?
                .map_or(0, |r| r.try_get_by_index(0).unwrap()))
        } else {
            let count = intent::Entity::find()
                .filter(intent::Column::Status.eq::<i16>(status.into()))
                .count(&self.db)
                .await?;
            Ok(count as i64)
        }
    }

    pub async fn get_valid_solution_count(&self) -> Result<i64> {
        if self.db.get_database_backend() == DatabaseBackend::Postgres {
            Ok(self
                .db
                .query_one(Statement::from_string(
                    self.db.get_database_backend(),
                    "SELECT count FROM solution_tx_success_count WHERE is_tx_success",
                ))
                .await?
                .map_or(0, |r| r.try_get_by_index(0).unwrap()))
        } else {
            let count = solution::Entity::find()
                .filter(solution::Column::IsTxSuccess.eq(true))
                .count(&self.db)
                .await?;
            Ok(count as i64)
        }
    }

    pub async fn get_failed_solution_count(&self) -> Result<i64> {
        if self.db.get_database_backend() == DatabaseBackend::Postgres {
            Ok(self
                .db
                .query_one(Statement::from_string(
                    self.db.get_database_backend(),
                    "SELECT count FROM solution_tx_success_count WHERE NOT is_tx_success",
                ))
                .await?
                .map_or(0, |r| r.try_get_by_index(0).unwrap()))
        } else {
            let count = solution::Entity::find()
                .filter(solution::Column::IsTxSuccess.eq(false))
                .count(&self.db)
                .await?;
            Ok(count as i64)
        }
    }

    pub async fn get_connected_solver_count(&self) -> Result<i64> {
        Ok(self.connected_solvers.len() as i64)
    }

    pub async fn get_intents_by_author_count(&self, limit: u64) -> Result<Vec<(Address, i64)>> {
        let result = if self.db.get_database_backend() == DatabaseBackend::Postgres {
            self.db
                .query_all(Statement::from_sql_and_values(
                    self.db.get_database_backend(),
                    "SELECT author, count FROM intent_author_count ORDER BY count DESC LIMIT $1",
                    [(limit as i64).into()],
                ))
                .await
        } else {
            self.db.query_all(Statement::from_sql_and_values(
                self.db.get_database_backend(),
                "SELECT author, count(*) FROM intent GROUP BY author ORDER BY count(*) DESC LIMIT ?",
                [(limit as i64).into()],
            )).await
        }?;
        Ok(map_address_count_rows(result))
    }

    pub async fn get_solutions_by_solver_count(&self, limit: u64) -> Result<Vec<(Address, i64)>> {
        let result = if self.db.get_database_backend() == DatabaseBackend::Postgres {
            self.db
                .query_all(Statement::from_sql_and_values(
                    self.db.get_database_backend(),
                    "SELECT solver, count FROM solution_solver_count ORDER BY count DESC LIMIT $1",
                    [(limit as i64).into()],
                ))
                .await
        } else {
            self.db.query_all(Statement::from_sql_and_values(
                self.db.get_database_backend(),
                "SELECT solver, count(*) FROM solution GROUP BY solver ORDER BY count(*) DESC LIMIT ?",
                [(limit as i64).into()],
            )).await
        }?;
        Ok(map_address_count_rows(result))
    }
}

fn map_address_count_rows(rows: impl IntoIterator<Item = QueryResult>) -> Vec<(Address, i64)> {
    rows.into_iter()
        .map(|r| {
            (
                Address::from_slice(&r.try_get_by_index::<Vec<u8>>(0).unwrap()),
                r.try_get_by_index::<i64>(1).unwrap(),
            )
        })
        .collect()
}

impl StorageService {
    pub fn spawn_update_metrics_task(
        self,
        refresh_interval: Duration,
    ) -> tokio::task::JoinHandle<()> {
        tokio::spawn(async move {
            loop {
                if let Err(e) = self.update_all_metrics().await {
                    tracing::error!("Error updating metrics: {}", e);
                }

                tokio::time::sleep(refresh_interval).await;
            }
        })
    }

    pub async fn update_all_metrics(&self) -> Result<()> {
        self.update_intent_counter().await?;
        self.update_solved_intent_counter().await?;
        self.update_failed_intent_counter().await?;
        self.update_canceled_intent_counter().await?;
        self.update_expired_intent_counter().await?;
        self.update_valid_solution_counter().await?;
        self.update_failed_solution_counter().await?;
        self.update_top_n_intent_authors().await?;
        Ok(())
    }

    async fn update_top_n_intent_authors(&self) -> Result<()> {
        let top_n = self.get_intents_by_author_count(10).await?;
        top_n_intent_authors(top_n.into_iter().map(|(a, c)| (a.to_string(), c)));
        Ok(())
    }

    async fn update_intent_counter(&self) -> Result<()> {
        let count = self.get_intent_count().await?;
        intent_counter().set(count);
        Ok(())
    }

    async fn update_solved_intent_counter(&self) -> Result<()> {
        let count = self.get_intent_status_count(IntentState::Solved).await?;
        solved_intent_counter().set(count);
        Ok(())
    }

    async fn update_failed_intent_counter(&self) -> Result<()> {
        let count = self.get_intent_status_count(IntentState::Error).await?;
        failed_intent_counter().set(count);
        Ok(())
    }

    async fn update_canceled_intent_counter(&self) -> Result<()> {
        let count = self.get_intent_status_count(IntentState::Cancelled).await?;
        canceled_intent_counter().set(count);
        Ok(())
    }

    async fn update_expired_intent_counter(&self) -> Result<()> {
        let count = self.get_intent_status_count(IntentState::Expired).await?;
        expired_intent_counter().set(count);
        Ok(())
    }

    async fn update_valid_solution_counter(&self) -> Result<()> {
        let count = self.get_valid_solution_count().await?;
        valid_solution_counter().set(count);
        Ok(())
    }

    async fn update_failed_solution_counter(&self) -> Result<()> {
        let count = self.get_failed_solution_count().await?;
        failed_solution_counter().set(count);
        Ok(())
    }
}
