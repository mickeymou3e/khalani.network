use tracing::level_filters::LevelFilter;
use tracing_subscriber::fmt::Subscriber;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::EnvFilter;

pub fn configure_logs() {
    let env_filter = EnvFilter::builder()
        .with_default_directive(LevelFilter::DEBUG.into())
        .from_env_lossy();

    Subscriber::builder()
        .with_env_filter(env_filter)
        .finish()
        .init();
}
