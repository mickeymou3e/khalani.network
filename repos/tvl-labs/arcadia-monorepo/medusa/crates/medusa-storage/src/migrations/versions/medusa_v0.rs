use sea_orm_migration::prelude::*;
use sea_orm_migration::schema::*;
use sea_orm_migration::sea_query::Index;

const INTENT_AUTHOR_INDEX: &str = "idx-intent-author";
const SOLUTION_SOLUTION_SOLVER_INDEX: &str = "idx-solution-solver";
const INTENT_TTL_I64_ACTIVE_INDEX: &str = "idx-intent-ttl-i64-active";

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Nonce::Table)
                    .if_not_exists()
                    .col(binary(Nonce::Number).primary_key())
                    .to_owned(),
            )
            .await?;
        manager
            .create_table(
                Table::create()
                    .table(Intent::Table)
                    .if_not_exists()
                    // For sqlite it's integer primary key autoincrement. For postgres it's bigserial.
                    // Note that sqlite integer supports 64bit numbers.
                    .col(big_integer(Intent::Id).primary_key().auto_increment())
                    .col(binary(Intent::IntentId).unique_key())
                    .col(binary(Intent::Author))
                    .col(binary(Intent::Ttl))
                    .col(big_integer(Intent::TtlI64))
                    .col(binary(Intent::Nonce))
                    .col(binary(Intent::SrcMToken))
                    .col(binary(Intent::SrcAmount))
                    .col(binary(Intent::Outcome))
                    .col(binary_null(Intent::Signature))
                    .col(boolean(Intent::IsActive))
                    .col(tiny_integer(Intent::Status))
                    .col(tiny_integer_null(Intent::ErrorType))
                    .col(binary_null(Intent::SolutionHash))
                    .col(binary_null(Intent::TxHash))
                    .col(boolean(Intent::IsTxSuccess))
                    .col(big_integer(Intent::Timestamp))
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name(INTENT_TTL_I64_ACTIVE_INDEX)
                    .table(Intent::Table)
                    .col(Intent::TtlI64)
                    .and_where(Expr::col(Intent::IsActive).eq(true))
                    .to_owned(),
            )
            .await?;

        // Create index author in intent table
        manager
            .create_index(
                Index::create()
                    .name(INTENT_AUTHOR_INDEX)
                    .table(Intent::Table)
                    .col(Intent::Author)
                    .to_owned(),
            )
            .await?;

        // Create table intent_history
        manager
            .create_table(
                Table::create()
                    .table(IntentHistory::Table)
                    .if_not_exists()
                    .col(big_integer(IntentHistory::Id).primary_key())
                    .col(binary(IntentHistory::IntentHash).unique_key())
                    .col(big_integer_null(IntentHistory::PublishTimestamp))
                    .col(binary_null(IntentHistory::PublishTxHash))
                    .col(big_integer_null(IntentHistory::SolveTimestamp))
                    .col(binary_null(IntentHistory::SolveTxHash))
                    .col(big_integer_null(IntentHistory::RedeemTimestamp))
                    .col(binary_null(IntentHistory::RedeemTxHash))
                    .col(big_integer_null(IntentHistory::WithdrawTimestamp))
                    .col(binary_null(IntentHistory::WithdrawTxHash))
                    .col(big_integer_null(IntentHistory::WithdrawToSpokeTimestamp))
                    .col(big_integer_null(IntentHistory::CancelTimestamp))
                    .col(binary_null(IntentHistory::CancelTxHash))
                    .col(binary_null(IntentHistory::RemainingIntentId))
                    .col(big_integer_null(IntentHistory::ErrorTimestamp))
                    .col(binary_null(IntentHistory::ErrorTxHash))
                    .col(tiny_integer_null(IntentHistory::ErrorType))
                    .to_owned(),
            )
            .await?;

        // Create table solution
        manager
            .create_table(
                Table::create()
                    .table(Solution::Table)
                    .if_not_exists()
                    .col(big_integer(Solution::Id).primary_key().auto_increment())
                    .col(binary(Solution::SolutionHash).unique_key())
                    .col(binary(Solution::SolutionBytes))
                    .col(binary(Solution::Solver))
                    .col(binary(Solution::TxHash))
                    .col(boolean(Solution::IsTxSuccess))
                    .col(big_integer(Solution::Timestamp))
                    .to_owned(),
            )
            .await?;

        // Create index solver in solution table
        manager
            .create_index(
                Index::create()
                    .name(SOLUTION_SOLUTION_SOLVER_INDEX)
                    .table(Solution::Table)
                    .col(Solution::Solver)
                    .to_owned(),
            )
            .await?;

        // Create table refinement
        manager
            .create_table(
                Table::create()
                    .table(Refinement::Table)
                    .if_not_exists()
                    .col(binary(Refinement::IntentId).primary_key())
                    .col(binary_null(Refinement::Refinement))
                    .to_owned(),
            )
            .await?;

        // Create table solver
        manager
            .create_table(
                Table::create()
                    .table(Solver::Table)
                    .if_not_exists()
                    .col(binary(Solver::Address).primary_key())
                    .col(boolean(Solver::IsAuthorized))
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();

        // manager
        //     .drop_table(Table::drop().table(Post::Table).to_owned())
        //     .await
    }
}

#[derive(DeriveIden)]
enum Nonce {
    Table,
    Number,
}

#[allow(clippy::enum_variant_names)]
#[derive(DeriveIden)]
enum Intent {
    Table,
    Id,
    IntentId,
    Author,
    Ttl,
    TtlI64,
    Nonce,
    SrcMToken,
    SrcAmount,
    Outcome,
    Signature,
    IsActive,
    Status,
    ErrorType,
    SolutionHash,
    TxHash,
    IsTxSuccess,
    Timestamp,
}

#[derive(DeriveIden)]
enum IntentHistory {
    Table,
    Id,
    IntentHash,
    PublishTimestamp,
    PublishTxHash,
    SolveTimestamp,
    SolveTxHash,
    RedeemTimestamp,
    RedeemTxHash,
    WithdrawTimestamp,
    WithdrawTxHash,
    WithdrawToSpokeTimestamp,
    CancelTimestamp,
    CancelTxHash,
    RemainingIntentId,
    ErrorTimestamp,
    ErrorTxHash,
    ErrorType,
}

#[allow(clippy::enum_variant_names)]
#[derive(DeriveIden)]
enum Solution {
    Table,
    Id,
    SolutionHash,
    SolutionBytes,
    Solver,
    TxHash,
    IsTxSuccess,
    Timestamp,
}

#[allow(clippy::enum_variant_names)]
#[derive(DeriveIden)]
enum Refinement {
    Table,
    IntentId,
    Refinement,
}

#[derive(DeriveIden)]
enum Solver {
    Table,
    Address,
    IsAuthorized,
}
