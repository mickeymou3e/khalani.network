use axi_core_semantics::{
    bail,
    context::ExternalProc,
    interpreter::{InterResult, InterResultInner, Interpreter, Params},
    proposition::{Proposition, Term},
};
use axi_parser::{lex::lexer, parser::stmts_all};

#[test]
fn test_external_proc() {
    let mut int = Interpreter::new_with_builtins();

    // You can define an external procedure that performs deductions. For
    // example, this will have the same functionality as the builtin `both`.
    struct MyBoth;
    impl ExternalProc for MyBoth {
        fn run(&self, ctx: &Interpreter, params: Params) -> InterResult {
            let (left, right) = params.two_propositions()?;
            // You can access the assumption base through the interpreter context.
            if ctx.ab.contains(&left) && ctx.ab.contains(&right) {
                Ok(InterResultInner::Proved(
                    Proposition::And(left.inner, right.inner).into(),
                ))
            } else {
                todo!("error handling")
            }
        }
    }
    int.define_external_procedure("my_both", MyBoth);

    // You can also define procedures that returns a term. E.g. my_add adds two
    // natural numbers.
    struct MyAdd;
    impl ExternalProc for MyAdd {
        fn run(&self, _ctx: &Interpreter, params: Params) -> InterResult {
            let params_loc = params.loc();
            let (left, right) = params.two_terms()?;
            match (&*left, &*right) {
                (Term::BuiltinNat(left), Term::BuiltinNat(right)) => {
                    Ok(InterResultInner::Term(Term::BuiltinNat(left + right)))
                }
                _ => bail!(
                    params_loc,
                    "wrong type of parameters for my_add, expected two natural numbers"
                ),
            }
        }
    }
    int.define_external_procedure("my_add", MyAdd);

    let input = r#"
const a: Boolean;
const b: Boolean;

assume a {
    assume b {
        !my_both(a, b);
    }
}

!reflex(my_add(3, 4));
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
    Nothing,
    Proved(if(a, if(b, and(a, b)))),
    Proved(=[7, 7]),
]"#
    )
}
