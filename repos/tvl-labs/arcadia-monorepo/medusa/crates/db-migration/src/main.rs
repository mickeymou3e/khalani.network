#[cfg(feature = "from-kv")]
mod from_kv;

#[tokio::main]
async fn main() {
    #[cfg(feature = "from-kv")]
    {
        let matches = clap::Command::new("db-migration-from-kv")
            .arg(clap::Arg::new("rdb_url").required(true))
            .arg(clap::Arg::new("kv_path").required(true))
            .get_matches();
        let rdb_url = matches.get_one::<String>("rdb_url").unwrap();
        let kv_path = matches.get_one::<String>("kv_path").unwrap();
        from_kv::DbHandle::new(rdb_url, kv_path)
            .await
            .run()
            .await
            .unwrap();
    }

    #[cfg(not(feature = "from-kv"))]
    sea_orm_migration::cli::run_cli(medusa_storage::migrations::Migrator).await;
}
