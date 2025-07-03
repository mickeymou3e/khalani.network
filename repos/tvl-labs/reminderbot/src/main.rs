use dotenv::dotenv;
use reqwest;
use serde_json::json;
use std::env;
use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn main() {
    dotenv().ok();
    loop {
        if let Err(e) = send_discord_message().await {
            eprintln!("Failed to send message: {}", e);
        }
        // Wait for 24 hours before sending the next message.
        // sleep(Duration::from_secs(86400)).await;
        sleep(Duration::from_secs(5)).await;
    }
}

async fn send_discord_message() -> Result<(), reqwest::Error> {
    let webhook_url = env::var("DISCORD_WEB_HOOK").expect("DISCORD_WEB_HOOK must be set");
    let client = reqwest::Client::new();
    let message_payload = json!({
        "content": "@here Update your daily status on notion : https://www.notion.so/4e5c1dd9375c492d91d62ebd6e6df33f?v=0ffcd066be7a4e86a8daa0c3bccce925&pvs=4 "
    });

    client
        .post(webhook_url)
        .json(&message_payload)
        .send()
        .await?;

    println!("Message sent successfully.");
    Ok(())
}
