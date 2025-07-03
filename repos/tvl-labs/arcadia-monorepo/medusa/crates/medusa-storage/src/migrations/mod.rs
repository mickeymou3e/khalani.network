use sea_orm_migration::prelude::*;

use self::versions::*;

mod versions;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(medusa_v0::Migration),
            Box::new(v1_count_triggers::Migration),
        ]
    }
}
