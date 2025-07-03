mod client;
mod db;
mod error;
mod merkle;
mod run;
mod smt;
mod store;

#[tokio::main]
async fn main() {
    let db_path = "./store.db";
    let url = "https://rpc.khalani.network";
    let runner = run::Runner::new(db_path, url);
    runner.run().await.unwrap();
}
