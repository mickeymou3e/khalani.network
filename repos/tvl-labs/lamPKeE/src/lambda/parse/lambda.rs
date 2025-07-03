use std::error::Error;
use std::iter::Peekable;

use crate::lambda::PhraseToken as Token;
use crate::phi::constant::PurePhiConstants;
use crate::phi::keyword::PurePhiKeywords;
use crate::{lambda::ast::PhiLambdaPhrase as Phrase, util::*};

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

pub fn tokenize(input: &str) -> Result<Vec<Token<PurePhiConstants, PurePhiKeywords>>, ParseError> {
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
                tokens.push(Token::Lambda(identifier));
            }
            ')' => tokens.push(Token::RParen),
            '(' => tokens.push(Token::LParen),
            _ => {
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
                    tokens.push(Token::Var(var_name));
                } else {
                    return Err(ParseError::LexerError((car.to_string(), idx)));
                }
            }
        }
    }
    Ok(tokens)
}

pub fn parse<TI>(toks: &mut Peekable<TI>) -> Result<Phrase<PurePhiConstants>, Box<dyn Error>>
where
    TI: Iterator<Item = Token<PurePhiConstants, PurePhiKeywords>>,
{
    match toks.next().unwrap() {
        Token::Lambda(abs_var) => {
            let body = parse(toks).expect("Error parsing lambda body");

            let lambda_with_body = abs(abs_var, body);
            Ok(lambda_with_body)
        }
        Token::LParen => {
            let term = parse(toks).expect("Error parsing subterm in parentheses");
            if toks.next_if_eq(&Token::RParen).is_some() {
                Ok(term)
            } else {
                let term1 = parse(toks).expect("Error parsing subterm in parentheses");
                assert_eq!(toks.next().unwrap(), Token::RParen);
                Ok(fn_app(term, term1))
            }
        }
        Token::RParen => {
            panic!("Unexpected closing paren -- you may be missing an opening paren");
        }
        Token::Var(v) => Ok(var(v)),
        Token::Const(_) => todo!(),
        Token::Kwd(_) => todo!(),
    }
}

#[test]
fn test_simple_abstraction_parse() {
    let pgm = "\\ a . (a b)";

    let expected = vec![
        Token::Lambda("a".into()),
        Token::LParen,
        Token::Var("a".into()),
        Token::Var("b".into()),
        Token::RParen,
    ];
    let results = tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);

    let parser_result = parse(&mut results.into_iter().peekable());
    assert!(parser_result.is_ok());
    let expected_result = abs("a", fn_app(var("a"), var("b")));
    assert_eq!(parser_result.unwrap(), expected_result);
}

#[test]
fn test_double_abs() {
    let pgm = "\\ a . (\\ c . (a c))";

    let expected = vec![
        Token::Lambda("a".into()),
        Token::LParen,
        Token::Lambda("c".into()),
        Token::LParen,
        Token::Var("a".into()),
        Token::Var("c".into()),
        Token::RParen,
        Token::RParen,
    ];
    let results = tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);

    let parser_result = parse(&mut results.into_iter().peekable());
    assert!(parser_result.is_ok());
    let expected_result = abs("a", abs("c", fn_app(var("a"), var("c"))));
    assert_eq!(parser_result.unwrap(), expected_result);
}

#[test]
fn test_double_abs_app() {
    let pgm = "\\ a . (b (\\ c . (a c)))";

    let expected = vec![
        Token::Lambda("a".into()),
        Token::LParen,
        Token::Var("b".into()),
        Token::LParen,
        Token::Lambda("c".into()),
        Token::LParen,
        Token::Var("a".into()),
        Token::Var("c".into()),
        Token::RParen,
        Token::RParen,
        Token::RParen,
    ];
    let results = tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);

    let parser_result = parse(&mut results.into_iter().peekable());
    assert!(parser_result.is_ok());
    let expected_result = abs("a", fn_app(var("b"), abs("c", fn_app(var("a"), var("c")))));
    assert_eq!(parser_result.unwrap(), expected_result);
}

#[test]
fn test_double_abs_app_diff_order() {
    let pgm = "\\ a .  ((\\ c . (a c)) b)";

    let expected = vec![
        Token::Lambda("a".into()),
        Token::LParen,
        Token::LParen,
        Token::Lambda("c".into()),
        Token::LParen,
        Token::Var("a".into()),
        Token::Var("c".into()),
        Token::RParen,
        Token::RParen,
        Token::Var("b".into()),
        Token::RParen,
    ];
    let results = tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);

    let parser_result = parse(&mut results.into_iter().peekable());
    assert!(parser_result.is_ok());
    let expected_result = abs("a", fn_app(abs("c", fn_app(var("a"), var("c"))), var("b")));
    assert_eq!(parser_result.unwrap(), expected_result);
}
