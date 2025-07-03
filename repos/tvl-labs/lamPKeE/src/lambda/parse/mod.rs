mod lambda;
use crate::ast::{PhiLambdaDeduction, PhiLambdaExpr, PhiLambdaPhrase as Phrase};
use crate::util::*;
use crate::{
    phi::{
        constant::{PureConstantsParser, PurePhiConstants},
        keyword::{PureKeywordsParser, PurePhiKeywords},
    },
    ConstantToken, KeywordToken, Parseable,
};
use crate::{Constant, ConstantType, PhraseToken as PhiToken};
pub use lambda::*;

use std::error::Error;
use std::iter::Peekable;
use std::marker::PhantomData;

#[derive(Debug)]
pub enum ParseError {
    LexerError((String, usize)),
    ParseConstantError(String),
}

impl std::fmt::Display for ParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ParseError::LexerError(s) => {
                write!(f, "Unexpected token {} found at {}", s.0, s.1)
            }
            ParseError::ParseConstantError(s) => {
                write!(f, "Encountered error while parsing constant {}", s)
            }
        }
    }
}

impl Error for ParseError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}

#[derive(Default)]
pub struct Parser<
    C: ConstantToken,
    K: KeywordToken,
    CP: Parseable<PhiToken<C, K>, T>,
    KP: Parseable<PhiToken<C, K>, T>,
    T: Constant,
> {
    token: PhantomData<PhiToken<C, K>>,
    constant_parser: PhantomData<CP>,
    keyword_parser: PhantomData<KP>,
    c: PhantomData<T>,
}

impl<C, K, CP, KP, T> Parser<C, K, CP, KP, T>
where
    C: ConstantToken + Clone,
    K: KeywordToken + Clone,
    CP: Parseable<PhiToken<C, K>, T>,
    KP: Parseable<PhiToken<C, K>, T>,
    T: Constant + std::fmt::Debug,
{
    pub fn tokenize(input: &str) -> Result<Vec<PhiToken<C, K>>, ParseError> {
        let mut chars = input.chars().enumerate().peekable();
        let mut tokens = vec![];
        while let Some((idx, car)) = chars.next() {
            match car {
                '\\' => {
                    let mut identifier = String::new();
                    for (_i, c) in &mut chars {
                        if c == '.' {
                            break;
                        } else if c.is_whitespace() {
                        } else if c.is_alphabetic() {
                            identifier.push(c);
                        } else {
                            panic!("Invalid character after lambda")
                        }
                    }
                    tokens.push(PhiToken::Lambda(identifier));
                }
                ')' => tokens.push(PhiToken::RParen),
                '(' => tokens.push(PhiToken::LParen),
                _ => match C::tokenize(&input[idx..]) {
                    Some((t, len)) => {
                        let mut i = 0;
                        while i < len {
                            chars.next();
                            i += 1;
                        }
                        tokens.push(PhiToken::Const(t));
                    }
                    None => match K::tokenize(&input[idx..]) {
                        Some((t, len)) => {
                            let mut i = 1;
                            while i < len {
                                chars.next();
                                i += 1;
                            }
                            tokens.push(PhiToken::Kwd(t));
                        }
                        None => {
                            if car.is_whitespace() {
                            } else if car.is_alphabetic() {
                                let mut var_name = car.to_string();
                                while let Some(&(_, c)) = chars.peek() {
                                    if c.is_whitespace() || c == '(' || c == ')' {
                                        break;
                                    } else {
                                        var_name.push(c);
                                        chars.next();
                                    }
                                }
                                tokens.push(PhiToken::Var(var_name));
                            } else {
                                return Err(ParseError::LexerError((car.to_string(), idx)));
                            }
                        }
                    },
                },
            }
        }
        Ok(tokens)
    }

    pub fn parse<TI>(toks: &mut Peekable<TI>) -> Result<Phrase<T>, Box<dyn Error>>
    where
        TI: Iterator<Item = PhiToken<C, K>>,
    {
        let mut t = match toks.peek().unwrap() {
            PhiToken::Lambda(_) => {
                let Some(PhiToken::Lambda(bvar)) = toks.next() else {
                    unreachable!()
                };
                let body = Self::parse(toks).expect("Error parsing lambda body");

                abs(bvar, body)
            }
            PhiToken::LParen => {
                toks.next();
                let term = Self::parse(toks).expect("Error parsing subterm in parentheses");
                assert!(toks.next().unwrap() == PhiToken::RParen);
                term
            }
            PhiToken::RParen => {
                toks.next();
                panic!("Unexpected closing paren -- you may be missing an opening paren");
            }
            PhiToken::Var(_) => {
                let Some(PhiToken::Var(v)) = toks.next() else {
                    unreachable!()
                };
                var(v)
            }
            PhiToken::Const(_) => {
                let c_ast: Option<Phrase<T>> = CP::parse(toks).expect("Error in const parser");
                if let Some(constant) = c_ast {
                    match constant {
                        Phrase::Deduction(d) => match d {
                            PhiLambdaDeduction::DedApp { op, args } => match op.as_ref() {
                                PhiLambdaExpr::Const(c) => match c.type_of() {
                                    ConstantType::Method { arg_count } => {
                                        if args.is_empty() && arg_count > 0 {
                                            let mut args = vec![];
                                            while args.len() < arg_count {
                                                let arg = Self::parse(toks)
                                                    .expect("Error parsing method arg");
                                                args.push(arg);
                                            }
                                            ded_app(c.clone(), args)
                                        } else {
                                            ded_app(c.clone(), args)
                                        }
                                    }
                                    ConstantType::Val => todo!(),
                                    ConstantType::Sentence => todo!(),
                                },
                                _ => todo!(),
                            },
                        },
                        Phrase::Expr(e) => Phrase::Expr(e),
                    }
                } else {
                    todo!()
                }
            }
            _ => {
                todo!()
            }
        };
        if toks.peek().is_some_and(|c| {
            matches!(
                c,
                PhiToken::Lambda(_) | PhiToken::LParen | PhiToken::Var(_) | PhiToken::Const(_)
            )
        }) {
            let r = Self::parse(toks)?;
            t = fn_app(t, r)
        }
        Ok(t)
    }
}

pub type PureParser = Parser<
    PurePhiConstants,
    PurePhiKeywords,
    PureConstantsParser,
    PureKeywordsParser,
    PurePhiConstants,
>;
pub type PurePhiToken = PhiToken<PurePhiConstants, PurePhiKeywords>;
pub type PurePhiParseResult = Result<Vec<PurePhiToken>, ParseError>;
pub type PurePhrase = Phrase<PurePhiConstants>;
#[cfg(test)]
mod test {
    use super::PureParser as Parser;
    use super::{PhiToken, PurePhiParseResult as ParserResult};
    use crate::ast::{PhiLambdaDeduction as Ded, PhiLambdaExpr as Expr, PhiLambdaPhrase as Phrase};
    use crate::phi::constant::PurePhiConstants;
    use crate::util::*;
    use crate::PurePhrase;

    #[test]
    fn test_simple_abstraction_parse() {
        let pgm = "\\ a . (a b)";

        let expected = vec![
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("b".into()),
            PhiToken::RParen,
        ];
        let results: ParserResult = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);

        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected_result: PurePhrase = abs("a", fn_app(var("a"), var("b")));
        assert_eq!(parser_result.unwrap(), expected_result);
    }

    #[test]
    fn test_double_abs() {
        let pgm = "\\ a . (\\ c . (a c))";

        let expected = vec![
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::Lambda("c".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("c".into()),
            PhiToken::RParen,
            PhiToken::RParen,
        ];
        let results = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);

        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected_result = abs("a", abs("c", fn_app(var("a"), var("c"))));
        assert_eq!(parser_result.unwrap(), expected_result);
    }

    #[test]
    fn test_double_abs_app() {
        let pgm = "\\ a . (b (\\ c . (a c)))";

        let expected = vec![
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::Var("b".into()),
            PhiToken::LParen,
            PhiToken::Lambda("c".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("c".into()),
            PhiToken::RParen,
            PhiToken::RParen,
            PhiToken::RParen,
        ];
        let results = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);

        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected_result = abs("a", fn_app(var("b"), abs("c", fn_app(var("a"), var("c")))));
        assert_eq!(parser_result.unwrap(), expected_result);
    }

    #[test]
    fn test_double_abs_app_diff_order() {
        let pgm = "\\ a .  ((\\ c . (a c)) b)";

        let expected = vec![
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::LParen,
            PhiToken::Lambda("c".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("c".into()),
            PhiToken::RParen,
            PhiToken::RParen,
            PhiToken::Var("b".into()),
            PhiToken::RParen,
        ];
        let results = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);

        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected_result = abs("a", fn_app(abs("c", fn_app(var("a"), var("c"))), var("b")));
        assert_eq!(parser_result.unwrap(), expected_result);
    }

    #[test]
    fn test_can_parse_claim_method() {
        let pgm = "claim( \\ a .  ((\\ c . (a c)) b))";

        let expected = vec![
            PhiToken::Const(PurePhiConstants::Claim),
            PhiToken::LParen,
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::LParen,
            PhiToken::Lambda("c".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("c".into()),
            PhiToken::RParen,
            PhiToken::RParen,
            PhiToken::Var("b".into()),
            PhiToken::RParen,
            PhiToken::RParen,
        ];

        let results = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);
        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected = Phrase::Deduction(Ded::DedApp {
            op: Box::new(Expr::Const(PurePhiConstants::Claim)),
            args: vec![abs(
                "a",
                fn_app(abs("c", fn_app(var("a"), var("c"))), var("b")),
            )],
        });
        assert_eq!(parser_result.unwrap(), expected);
    }

    #[test]
    fn test_can_parse_nested_claim_method() {
        let pgm = "claim( \\ a .  ((\\ c . (a c)) b))";

        let expected = vec![
            PhiToken::Const(PurePhiConstants::Claim),
            PhiToken::LParen,
            PhiToken::Lambda("a".into()),
            PhiToken::LParen,
            PhiToken::LParen,
            PhiToken::Lambda("c".into()),
            PhiToken::LParen,
            PhiToken::Var("a".into()),
            PhiToken::Var("c".into()),
            PhiToken::RParen,
            PhiToken::RParen,
            PhiToken::Var("b".into()),
            PhiToken::RParen,
            PhiToken::RParen,
        ];

        let results = Parser::tokenize(pgm);
        assert!(results.is_ok());
        let results = results.unwrap();
        assert_eq!(expected, results);
        let parser_result = Parser::parse(&mut results.into_iter().peekable());
        assert!(parser_result.is_ok());
        let expected = Phrase::Deduction(Ded::DedApp {
            op: Box::new(Expr::Const(PurePhiConstants::Claim)),
            args: vec![abs(
                "a",
                fn_app(abs("c", fn_app(var("a"), var("c"))), var("b")),
            )],
        });
        assert_eq!(parser_result.unwrap(), expected);
    }
}
