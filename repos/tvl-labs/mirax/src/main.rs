use mirax_cli::MiraxCli;
use mirax_version::MiraxVersion;
use mirax_version::Version;

fn main() {
    let crate_version = Version::parse(clap::crate_version!()).unwrap();
    let version = MiraxVersion::new(crate_version, option_env!("MIRAX_COMMIT_ID"));

    log::info!("Mirax version: {}", version);

    if let Err(e) = MiraxCli::init(version).start() {
        eprintln!("Error {e}");
        std::process::exit(1);
    }
}
