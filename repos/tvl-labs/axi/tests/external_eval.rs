use axi_core_semantics::{interpreter::Interpreter, proposition::Term};
use axi_parser::{lex::lexer, parser::stmts_all};

#[test]
fn test_external_eval() {
    let mut int = Interpreter::new_with_builtins();

    fn my_hash_eval(params: &[Term]) -> Result<Term, &'static str> {
        match &params[0] {
            Term::BuiltinBytes(_) => Ok(Term::BuiltinBytes(vec![0, 1, 2, 3])),
            _ => Err("can only evaluate my_hash with builtin bytes"),
        }
    }
    int.define_external_eval("my_hash", my_hash_eval);

    let input = r#"
function my_hash(bs: Bytes) -> Bytes;

!prove_by_eval(my_hash(0x001122) = 0x00010203);
"#;
    let statements = stmts_all(lexer(input)).unwrap();
    let mut results = Vec::new();
    for s in statements {
        results.push(int.interpret_top(s).unwrap());
    }
    assert_eq!(
        format!("{:#?}", results),
        r#"[
    Nothing,
    Proved(=[my_hash[0x001122]):Bytes, 0x00010203]),
]"#
    );
}
