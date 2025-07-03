use std::{
    env::VarError, os::unix::process::ExitStatusExt, path::PathBuf, process::Stdio, str::FromStr,
    sync::OnceLock, time::Duration,
};

use anyhow::{Context, Result, bail};
use axi_playground_api::json::JsonContext;
use axum::{
    BoxError, Json, Router,
    error_handling::HandleErrorLayer,
    extract::Path,
    http::{HeaderName, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
};
use mirax_types::Transaction;
use serde::{Deserialize, Serialize};
use tokio::{io::AsyncWriteExt, net::TcpListener};
use tower::{ServiceBuilder, limit::ConcurrencyLimitLayer, timeout::TimeoutLayer};
use tower_http::cors::{AllowOrigin, CorsLayer};

#[derive(Deserialize, Serialize)]
struct VerifyRequest {
    context: JsonContext,
    transaction: Transaction,
}

#[derive(Deserialize, Serialize)]
struct RunResult {
    ok: bool,
    status: Option<i32>,
    signal: Option<i32>,
    stdout: String,
    stderr: String,
}

static MIRAX_VERIFY: OnceLock<PathBuf> = OnceLock::new();

async fn verify(Json(request): Json<VerifyRequest>) -> Result<Json<RunResult>, AppError> {
    let mut child =
        tokio::process::Command::new(MIRAX_VERIFY.get().context("MIRAX_VERIFY not set")?)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true)
            .spawn()
            .context("spawn mirax-verify")?;

    child
        .stdin
        .as_mut()
        .unwrap()
        .write_all(
            serde_json::to_string(&request)
                .context("serialize request")?
                .as_bytes(),
        )
        .await
        .context("write to mirax-verification")?;

    let output = child
        .wait_with_output()
        .await
        .context("wait for mirax-verification")?;

    let stdout = String::from_utf8(output.stdout).context("convert stdout to string")?;
    let stderr = String::from_utf8(output.stderr).context("convert stderr to string")?;

    Ok(Json(RunResult {
        ok: output.status.success(),
        status: output.status.code(),
        signal: output.status.signal(),
        stdout,
        stderr,
    }))
}

static AXI_LANG: OnceLock<PathBuf> = OnceLock::new();

async fn run_axi(
    Path(file_name): Path<String>,
    request: String,
) -> Result<Json<RunResult>, AppError> {
    let temp_dir = tempfile::TempDir::with_prefix("run-axi").context("create temp dir")?;
    std::fs::write(temp_dir.path().join(&file_name), request).context("write input file")?;

    let output = tokio::process::Command::new(AXI_LANG.get().context("AXI_LANG not set")?)
        .current_dir(temp_dir.path())
        .arg(&file_name)
        .kill_on_drop(true)
        .output()
        .await
        .context("run axi-lang")?;

    let stdout = String::from_utf8(output.stdout).context("convert stdout to string")?;
    let stderr = String::from_utf8(output.stderr).context("convert stderr to string")?;

    Ok(Json(RunResult {
        ok: output.status.success(),
        status: output.status.code(),
        signal: output.status.signal(),
        stdout,
        stderr,
    }))
}

async fn mirax_hash(Json(data): Json<mirax_types::Bytes>) -> Json<mirax_types::H256> {
    use mirax_hasher::{Blake3Hasher, Digest};

    Json(Blake3Hasher::digest(data))
}

async fn script_hash(Json(script): Json<mirax_types::Script>) -> Json<mirax_types::H256> {
    Json(script.calc_hash())
}

#[tokio::main]
async fn main() -> Result<()> {
    let current_exe = std::env::current_exe().context("get current exe")?;
    let current_exe_dir = current_exe.parent().context("get current exe dir")?;
    let current_exe_dir_mirax_verify = current_exe_dir.join("mirax-verify");
    let current_exe_dir_axi_lang = current_exe_dir.join("axi-lang");
    let mirax_verify_path = if current_exe_dir_mirax_verify.exists() {
        current_exe_dir_mirax_verify
    } else {
        "mirax-verify".into()
    };
    let axi_lang_path = if current_exe_dir_axi_lang.exists() {
        current_exe_dir_axi_lang
    } else {
        "axi-lang".into()
    };
    println!("Using mirax-verify: {}", mirax_verify_path.display());
    println!("Using axi-lang: {}", axi_lang_path.display());
    MIRAX_VERIFY.set(mirax_verify_path).unwrap();
    AXI_LANG.set(axi_lang_path).unwrap();

    let port = read_and_parse_env_var("PORT")?.unwrap_or(3000_u16);
    let timeout = read_and_parse_env_var("TIMEOUT")?.unwrap_or(15);
    let concurrency = read_and_parse_env_var("CONCURRENCY_LIMIT")?.unwrap_or(4);

    let common_middleware = ServiceBuilder::new()
        .layer(
            CorsLayer::new()
                .allow_origin(AllowOrigin::mirror_request())
                .allow_methods([Method::POST])
                .allow_headers([HeaderName::from_static("content-type")])
                .max_age(Duration::from_secs(3600)),
        )
        .layer(HandleErrorLayer::new(|_: BoxError| async {
            StatusCode::REQUEST_TIMEOUT
        }))
        .layer(TimeoutLayer::new(Duration::from_secs(timeout)));
    let server = Router::new()
        .route("/run-axi/{file_name}", post(run_axi))
        .route("/verify", post(verify))
        .layer(ConcurrencyLimitLayer::new(concurrency));
    let server = Router::new()
        .route("/utils/mirax-hash", post(mirax_hash))
        .route("/utils/script-hash", post(script_hash))
        .merge(server)
        .layer(common_middleware);

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .context(format!("bind to port {}", port))?;

    println!("Server listening on port {}", port);

    // Start the server with graceful shutdown
    axum::serve(listener, server)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    println!("Server shutdown complete");
    Ok(())
}

struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        eprintln!("{:#}", self.0);
        (StatusCode::INTERNAL_SERVER_ERROR, format!("{:#}", self.0)).into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        AppError(err.into())
    }
}

fn read_and_parse_env_var<T>(name: &str) -> Result<Option<T>>
where
    T: FromStr,
    <T as FromStr>::Err: std::error::Error + Send + Sync + 'static,
{
    match std::env::var(name) {
        Ok(l) => {
            Ok(Some(l.parse().with_context(|| {
                format!("parse environment variable {name}")
            })?))
        }
        Err(VarError::NotPresent) => Ok(None),
        Err(e) => bail!("read environment variable {name}: {e}"),
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("Failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("Shutdown signal received, starting graceful shutdown");
}
