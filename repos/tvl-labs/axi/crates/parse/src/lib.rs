#[cfg(feature = "test-parser")]
use lalrpop_util::lalrpop_mod;

pub mod lex;
pub mod parser;

#[cfg(feature = "test-parser")]
lalrpop_mod!(pub lalrpop_parser);
