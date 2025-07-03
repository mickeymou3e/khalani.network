use lalrpop_util::lalrpop_mod;
use std::rc::Rc;
pub mod ast;
pub mod lex;
use ast::*;
use lex::*;

lalrpop_mod!(pub parser);

pub use lalrpop_util::ParseError;
pub use lexi_matic::Error as LexicalError;

#[test]
fn test_basic_parse() {
    let input = "~";
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Const(Constant::PrimFunConstant(
            PrimFunc::NotFun
        ))))
    );
}

#[test]
fn test_func_parse() {
    let input = r#"
        (fn (a b) true)
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Fun {
            params: vec!["a".to_string(), "b".to_string()],
            body: Rc::new(Exp::Const(Constant::TrueConstant))
        }))
    );
}

#[test]
fn test_func_def_and_app() {
    let input = r#"
    ((fn (a b) true) c)
"#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::FunApp(
            Rc::new(Exp::Fun {
                params: vec!["a".to_string(), "b".to_string()],
                body: Rc::new(Exp::Const(Constant::TrueConstant))
            }),
            vec![Phrase::Exp(Rc::new(Exp::Ide("c".to_string())))]
        )))
    );
}

#[test]
fn test_method_def() {
    let input = r#" 
        (method (a b) (!both a b))
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Method {
            params: vec!["a".to_string(), "b".to_string()],
            body: Rc::new(Ded::MethodApp(
                Rc::new(Exp::Const(Constant::PrimMethodConstant(PrimMethod::Both))),
                vec![
                    Phrase::Exp(Rc::new(Exp::Ide("a".to_string()))),
                    Phrase::Exp(Rc::new(Exp::Ide("b".to_string())))
                ]
            ))
        }))
    );
}

#[test]
fn test_match_any_pat() {
    let input = r#"
        (match a
            ((_ true))
        )"#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Match {
            discriminant: Rc::new(Exp::Ide("a".to_string())),
            cases: vec![(
                Rc::new(Pattern::AnyPat),
                Rc::new(Exp::Const(Constant::TrueConstant))
            )]
        }))
    );
}

#[test]
fn test_match_many_pat() {
    let input = r#"
        (match a 
            (((~ b) true)
            (_ false)
            ((& c d) false)
            )
        )
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Match {
            discriminant: Rc::new(Exp::Ide("a".to_string())),
            cases: vec![
                (
                    Rc::new(Pattern::NegPat(Rc::new(Pattern::IdPat("b".to_string())))),
                    Rc::new(Exp::Const(Constant::TrueConstant))
                ),
                (
                    Rc::new(Pattern::AnyPat),
                    Rc::new(Exp::Const(Constant::FalseConstant))
                ),
                (
                    Rc::new(Pattern::ConjPat {
                        left: Rc::new(Pattern::IdPat("c".to_string())),
                        right: Rc::new(Pattern::IdPat("d".to_string()))
                    }),
                    Rc::new(Exp::Const(Constant::FalseConstant))
                )
            ]
        }))
    );
}

#[test]
fn test_let_binding_single() {
    let input = r#"
        (let ((a true)) a)
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Let(
            vec![(
                "a".to_string(),
                Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::TrueConstant))))
            ),],
            Rc::new(Exp::Ide("a".to_string()))
        )))
    );
}

#[test]
fn test_let_bindings_multiple() {
    let input = r#"
        (let ((a true) (b false)) a)
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Let(
            vec![
                (
                    "a".to_string(),
                    Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::TrueConstant))))
                ),
                (
                    "b".to_string(),
                    Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::FalseConstant))))
                ),
            ],
            Rc::new(Exp::Ide("a".to_string()))
        )))
    );
}

#[test]
fn test_expressions_sequence_parser() {
    let input = r#"
       
        (let ((a true) (b false)) a);
        (match a 
            (((~ b) true)
            (_ false)
            ((& c d) false)
            )
        )
    
        
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Exp(Rc::new(Exp::Seq(vec![
            Rc::new(Exp::Let(
                vec![
                    (
                        "a".to_string(),
                        Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::TrueConstant))))
                    ),
                    (
                        "b".to_string(),
                        Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::FalseConstant))))
                    ),
                ],
                Rc::new(Exp::Ide("a".to_string()))
            )),
            Rc::new(Exp::Match {
                discriminant: Rc::new(Exp::Ide("a".to_string())),
                cases: vec![
                    (
                        Rc::new(Pattern::NegPat(Rc::new(Pattern::IdPat("b".to_string())))),
                        Rc::new(Exp::Const(Constant::TrueConstant))
                    ),
                    (
                        Rc::new(Pattern::AnyPat),
                        Rc::new(Exp::Const(Constant::FalseConstant))
                    ),
                    (
                        Rc::new(Pattern::ConjPat {
                            left: Rc::new(Pattern::IdPat("c".to_string())),
                            right: Rc::new(Pattern::IdPat("d".to_string()))
                        }),
                        Rc::new(Exp::Const(Constant::FalseConstant))
                    )
                ]
            })
        ])))
    );
}

#[test]
fn test_let_deduction() {
    let input = r#"
    (let ((a true) (b false)) (!left-either a b))
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();

    assert_eq!(
        res,
        Phrase::Ded(Rc::new(Ded::LetDed(
            vec![
                (
                    "a".to_string(),
                    Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::TrueConstant))))
                ),
                (
                    "b".to_string(),
                    Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::FalseConstant))))
                ),
            ],
            Rc::new(Ded::MethodApp(
                Rc::new(Exp::Const(Constant::PrimMethodConstant(
                    PrimMethod::LeftEither
                ))),
                vec![
                    Phrase::Exp(Rc::new(Exp::Ide("a".to_string()))),
                    Phrase::Exp(Rc::new(Exp::Ide("b".to_string())))
                ]
            ))
        )))
    );
}

#[test]
fn test_dmatch() {
    let input = r#"
    (dmatch a
        ((_ (!true-intro)))
    )
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Ded(Rc::new(Ded::MatchDed {
            discriminant: Rc::new(Exp::Ide("a".to_string())),
            cases: vec![(
                Rc::new(Pattern::AnyPat),
                Rc::new(Ded::MethodApp(
                    Rc::new(Exp::Const(Constant::PrimMethodConstant(
                        PrimMethod::TrueIntro
                    ))),
                    vec![]
                ))
            )]
        }))
    );
}

#[test]
fn test_ded_seq() {
    let input = r#"
    
        (let ((a true) (b false)) (!left-either a b));
        (dmatch b
            ((_ (!false-elim)))
        )
    
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .unwrap();
    assert_eq!(
        res,
        Phrase::Ded(Rc::new(Ded::SeqDed(vec![
            Rc::new(Ded::LetDed(
                vec![
                    (
                        "a".to_string(),
                        Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::TrueConstant))))
                    ),
                    (
                        "b".to_string(),
                        Rc::new(Phrase::Exp(Rc::new(Exp::Const(Constant::FalseConstant))))
                    ),
                ],
                Rc::new(Ded::MethodApp(
                    Rc::new(Exp::Const(Constant::PrimMethodConstant(
                        PrimMethod::LeftEither
                    ))),
                    vec![
                        Phrase::Exp(Rc::new(Exp::Ide("a".to_string()))),
                        Phrase::Exp(Rc::new(Exp::Ide("b".to_string())))
                    ]
                ))
            )),
            Rc::new(Ded::MatchDed {
                discriminant: Rc::new(Exp::Ide("b".to_string())),
                cases: vec![(
                    Rc::new(Pattern::AnyPat),
                    Rc::new(Ded::MethodApp(
                        Rc::new(Exp::Const(Constant::PrimMethodConstant(
                            PrimMethod::FalseElim
                        ))),
                        vec![]
                    ))
                )]
            })
        ])))
    );
}

#[test]
fn test_ded_seq_2() {
    let input = r#"
    
            

               
                
                    assume (and ?a ?b)
                        [
                           
                            (?a because-of (!left-and (and ?a ?b)));
                            (?b because-of (!right-and (and ?a ?b)));
                            ((and ?b ?a) due-to (!both ?a ?b))
                        ];
                    (!left-either (or ?c ?d))
                
                
            
      
    "#;
    let res = parser::FraseParser::new()
        .parse(&input, lexer(&input))
        .expect("error");
}



// #[test]
// fn test_ded_seq_2() {
//     let input = r#"
    
                
                
            
      
//     "#;
//     let res = parser::FraseParser::new()
//         .parse(&input, lexer(&input))
//         .expect("error");
// }