use std::path::Path;

use assert_cmd::Command;

// Test all programs in `programs` and assert status/stdout/stderr.
#[test]
fn test_programs() {
    std::env::set_current_dir(concat!(env!("CARGO_MANIFEST_DIR"), "/tests/programs")).unwrap();
    for f in std::fs::read_dir(".").unwrap() {
        let f = f.unwrap();
        if f.file_type().unwrap().is_file() {
            println!("Testing {:?}", f.file_name());
            let outputs = Path::new("outputs");
            let status = outputs.join(Path::new(&f.file_name()).with_extension("status"));
            let stdout = outputs.join(Path::new(&f.file_name()).with_extension("stdout"));
            let stderr = outputs.join(Path::new(&f.file_name()).with_extension("stderr"));
            let status: i32 = std::fs::read_to_string(status)
                .unwrap_or_else(|_e| "0".into())
                .parse()
                .unwrap();
            let stdout = std::fs::read(stdout).unwrap_or_default();
            let stderr = std::fs::read(stderr).unwrap_or_default();
            Command::cargo_bin("axi-lang")
                .unwrap()
                .arg(f.file_name())
                .env("NO_COLOR", "1")
                .assert()
                .code(status)
                .stdout(stdout)
                .stderr(stderr);
        }
    }
}

#[cfg(feature = "test-parser")]
#[test]
fn test_parser() {
    use axi_parser::{lalrpop_parser::StmtsParser, lex::lexer, parser::stmts_all};

    std::env::set_current_dir(concat!(env!("CARGO_MANIFEST_DIR"), "/tests/programs")).unwrap();
    for f in std::fs::read_dir(".").unwrap() {
        let f = f.unwrap();

        if f.file_type().unwrap().is_file() || f.file_type().unwrap().is_symlink() {
            println!("Testing {:?}", f.file_name());
            let pgm = std::fs::read_to_string(f.path()).unwrap();
            let ast = stmts_all(lexer(&pgm)).unwrap();
            let ast1 = StmtsParser::new().parse(&pgm, lexer(&pgm)).unwrap();
            assert_eq!(ast, ast1);
        }
    }
}

#[test]
#[ignore]
fn update() {
    std::env::set_current_dir(concat!(env!("CARGO_MANIFEST_DIR"), "/tests/programs")).unwrap();
    let outputs = Path::new("outputs");
    std::fs::remove_dir_all(outputs).unwrap();
    std::fs::create_dir(outputs).unwrap();
    for f in std::fs::read_dir(".").unwrap() {
        let f = f.unwrap();
        let ft = f.file_type().unwrap();
        if ft.is_file() || ft.is_symlink() {
            println!("Updating {:?}", f.file_name());
            let status = outputs.join(Path::new(&f.file_name()).with_extension("status"));
            let stdout = outputs.join(Path::new(&f.file_name()).with_extension("stdout"));
            let stderr = outputs.join(Path::new(&f.file_name()).with_extension("stderr"));

            let output = Command::cargo_bin("axi-lang")
                .unwrap()
                .arg(f.file_name())
                .env_remove("RUST_BACKTRACE")
                .env("NO_COLOR", "1")
                .output()
                .unwrap();

            if !output.status.success() {
                std::fs::write(status, output.status.code().unwrap().to_string()).unwrap();
            }
            if !output.stdout.is_empty() {
                std::fs::write(stdout, output.stdout).unwrap();
            }
            if !output.stderr.is_empty() {
                std::fs::write(stderr, output.stderr).unwrap();
            }
        }
    }
}
