use sea_orm::DbBackend;
use sea_orm_migration::prelude::*;

/// This migration creates tables and triggers to count the number of intents and solutions by author and status.
///
/// Note that this is postgres specific.
#[derive(DeriveMigrationName)]
pub struct Migration;

const UP: &str = r#"
-- Count by author table.
CREATE TABLE intent_author_count (
    author BYTEA PRIMARY KEY,
    count BIGINT NOT NULL
);

INSERT INTO intent_author_count
    SELECT author, COUNT(*) FROM intent GROUP BY author;

-- To sort by count.
CREATE INDEX ON intent_author_count (count);

-- Count by status table.
CREATE TABLE intent_status_count (
    status SMALLINT PRIMARY KEY,
    count BIGINT NOT NULL
);

INSERT INTO intent_status_count
    SELECT status, COUNT(*) FROM intent GROUP BY status;

-- Solution count by solver table
CREATE TABLE solution_solver_count (
    solver BYTEA PRIMARY KEY,
    count BIGINT NOT NULL
);

INSERT INTO solution_solver_count
    SELECT solver, COUNT(*) FROM solution GROUP BY solver;

-- Solution count by tx success table
CREATE TABLE solution_tx_success_count (
    is_tx_success BOOLEAN PRIMARY KEY,
    count BIGINT NOT NULL
);

INSERT INTO solution_tx_success_count
    SELECT is_tx_success, COUNT(*) FROM solution GROUP BY is_tx_success;

-- Update count on insert.
--
-- This is a statement level trigger using transition tables.
CREATE FUNCTION update_intent_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO intent_author_count (author, count)
    SELECT author, COUNT(*) FROM new_table GROUP BY author
    ON CONFLICT (author) DO UPDATE
    SET count = intent_author_count.count + EXCLUDED.count;

    INSERT INTO intent_status_count (status, count)
    SELECT status, COUNT(*) FROM new_table GROUP BY status
    ON CONFLICT (status) DO UPDATE
    SET count = intent_status_count.count + EXCLUDED.count;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intent_count_trigger
AFTER INSERT ON intent
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT
EXECUTE FUNCTION update_intent_count_on_insert();

-- Update count by status on update.
--
-- This is a statement level trigger using transition tables.
CREATE FUNCTION update_intent_status_count_on_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrease counts for old statuses
    UPDATE intent_status_count
    SET count = intent_status_count.count - subquery.count
    FROM (
        SELECT status, COUNT(*) as count
        FROM old_table
        GROUP BY status
    ) as subquery
    WHERE intent_status_count.status = subquery.status;

    -- Increase counts for new statuses
    INSERT INTO intent_status_count (status, count)
    SELECT status, COUNT(*) FROM new_table GROUP BY status
    ON CONFLICT (status) DO UPDATE
    SET count = intent_status_count.count + EXCLUDED.count;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intent_status_count_update_trigger
AFTER UPDATE ON intent
REFERENCING NEW TABLE AS new_table OLD TABLE AS old_table
FOR EACH STATEMENT
EXECUTE FUNCTION update_intent_status_count_on_update();

-- Solution count update on insert
CREATE FUNCTION update_solution_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO solution_solver_count (solver, count)
    SELECT solver, COUNT(*) FROM new_table GROUP BY solver
    ON CONFLICT (solver) DO UPDATE
    SET count = solution_solver_count.count + EXCLUDED.count;

    INSERT INTO solution_tx_success_count (is_tx_success, count)
    SELECT is_tx_success, COUNT(*) FROM new_table GROUP BY is_tx_success
    ON CONFLICT (is_tx_success) DO UPDATE
    SET count = solution_tx_success_count.count + EXCLUDED.count;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER solution_count_trigger
AFTER INSERT ON solution
REFERENCING NEW TABLE AS new_table
FOR EACH STATEMENT
EXECUTE FUNCTION update_solution_count_on_insert();
"#;

const DOWN: &str = r#"
DROP TRIGGER intent_count_trigger ON intent;
DROP TRIGGER intent_status_count_update_trigger ON intent;
DROP TRIGGER solution_count_trigger ON solution;
DROP FUNCTION update_intent_count_on_insert();
DROP FUNCTION update_intent_status_count_on_update();
DROP FUNCTION update_solution_count_on_insert();
DROP TABLE intent_author_count;
DROP TABLE intent_status_count;
DROP TABLE solution_solver_count;
DROP TABLE solution_tx_success_count;
"#;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        if manager.get_connection().get_database_backend() == DbBackend::Postgres {
            manager.get_connection().execute_unprepared(UP).await?;
        }
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        if manager.get_connection().get_database_backend() == DbBackend::Postgres {
            manager.get_connection().execute_unprepared(DOWN).await?;
        }
        Ok(())
    }
}
