use axum::http::{header, HeaderValue, Method};

use axum::routing::{get_service, post, MethodRouter};
use axum::{Json, Router};

use std::path::PathBuf;

use std::time::Duration;

use tower_http::cors::{self, CorsLayer};
use tower_http::services::ServeDir;
use tower_http::set_header::SetResponseHeader;

use crate::vdy_sandbox::{ValidityDirInput, Sandbox};
use crate::output::ValidityOutput;
use crate::{
    vdy_sandbox::{ValidityExecResult, ValidityFileInput},
    Config,
};

async fn validity_exec_handler(Json(payload): Json<ValidityFileInput>) -> Json<ValidityExecResult> {
    let ath_file = payload.set_random_name();
    let name = ath_file.name().to_string();
    let mut sb = Sandbox::new(ath_file).await;
    let sb_file_path = sb.athfile_with_ext();

    sb.write_ath_module().await;
    if !sb_file_path.exists() {
        return Json(ValidityExecResult {
            err: true,
            message: format!(
                "Path {} does not exist",
                sb_file_path.as_os_str().to_string_lossy()
            ),
        });
    }

    let mut cmd = sb.generate_run_command();
    sb.execute(&mut cmd);

    eprintln!("CMD GENERATED IN EXEC HANDLER: {:#?}", cmd);
    let output = sb.wait_on_cmd(cmd).await;
    eprintln!("FINAL OUTPUT: {:#?}", output);

   // sb.shutdown().await;

    let mut res = ValidityExecResult {
        err: false,
        message: String::new(),
    };

    let output = ValidityOutput::new(output, name);

    res.message = output.inner();

    Json(res)
}

async fn validity_dir_exec_handler(Json(payload): Json<ValidityDirInput>) -> Json<ValidityExecResult> {
    println!("Payload: {:?}", payload);
    let ath_file = payload.ath_file_to_run();
    let name = ath_file.name.clone();
    let mut sb = Sandbox::new(ath_file).await;
    sb.files = Some(payload.clone());
    let sb_file_path = sb.athfile_with_ext();

    sb.write_ath_modules().await;
    for f in &payload.files {
        let path_f = sb.athfile_ext(&f);
        if !path_f.exists() {
            return Json(ValidityExecResult {
                err: true,
                message: format!(
                    "Path {} does not exist",
                    path_f.as_os_str().to_string_lossy()
                ),
            });
        } else {
            println!("Path exists: {:?}", path_f);
        }
    }
    if !sb_file_path.exists() {
        return Json(ValidityExecResult {
            err: true,
            message: format!(
                "Path {} does not exist",
                sb_file_path.as_os_str().to_string_lossy()
            ),
        });
    }

    let mut cmd = sb.multifile_run_command();
    sb.execute(&mut cmd);

    let output = sb.wait_on_cmd(cmd).await;

    sb.shutdown().await;

    let mut res = ValidityExecResult {
        err: false,
        message: String::new(),
    };

    let output = ValidityOutput::new(output, name);

    res.message = output.inner();

    Json(res)
}

fn static_file_service(root: impl AsRef<std::path::Path>, max_age: HeaderValue) -> MethodRouter {
    let files = ServeDir::new(root).precompressed_gzip();

    let with_caching = SetResponseHeader::if_not_present(files, header::CACHE_CONTROL, max_age);

    get_service(with_caching)
        .handle_error(|e| async move { format!("Unhandled internal error: {}", e) })
}
const ONE_HOUR: Duration = Duration::from_secs(60 * 60);
const CORS_CACHE_TIME_TO_LIVE: Duration = ONE_HOUR;

#[tokio::main]
pub(crate) async fn serve(cfg: Config) {
    let max_age = match std::env::var("ATH_CACHE_TTL") {
        Ok(v) => {
            v
        },
        Err(_) => {
            "3600".to_string()
        }
    };
    let max_age = HeaderValue::from_str(format!("public, max-age={max_age}").as_str()).unwrap();
    let root_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("frontend")
        .join("dist");
    let root_files = static_file_service(root_path, max_age);
    let app = Router::new()
        .fallback(root_files)
        .route("/validity", post(validity_exec_handler))
        .route("/api/validity", post(validity_exec_handler))
        .route("/validity/multi-file", post(validity_dir_exec_handler))
        .layer({
            CorsLayer::new()
                .allow_origin(cors::Any)
                .allow_headers([header::CONTENT_TYPE])
                .allow_methods([Method::GET, Method::POST])
                .allow_credentials(false)
                .max_age(CORS_CACHE_TIME_TO_LIVE)
        });

    axum::Server::bind(&cfg.addr())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
