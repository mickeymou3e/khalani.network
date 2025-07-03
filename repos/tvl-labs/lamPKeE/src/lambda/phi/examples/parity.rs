use std::iter::Peekable;

use crate::{
    ast::{PhiLambdaDeduction, PhiLambdaExpr as Expr, PhiLambdaPhrase as Phrase},
    phi::keyword::{PureKeywordsParser, PurePhiKeywords},
    traits::{ConstantToken, KeywordToken, Parseable, Tokenizable},
    util::*,
    Constant, ConstantType, ParseError, Parser, PhraseToken as PhiToken,
};

use self::ast::{ParityConstants, ValueN};

pub mod ast {
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum Method {
        ZeroAxiom,
        MakeEven,
        MakeOdd,
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum ValueN {
        Zero,
        Succ(Box<ValueN>),
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum ValueParitySign {
        Even,
        Odd,
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum Sentence {
        Statement(ValueN, ValueParitySign),
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum PrimitiveValue {
        Num(ValueN),
        Sign(ValueParitySign),
        Sentence(Sentence),
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum ParityConstants {
        Value(PrimitiveValue),
        Method(Method),
    }

    pub fn num(v: ValueN) -> ParityConstants {
        ParityConstants::Value(PrimitiveValue::Num(v))
    }

    pub fn sign(v: ValueParitySign) -> ParityConstants {
        ParityConstants::Value(PrimitiveValue::Sign(v))
    }

    pub fn sentence(n: ValueN, s: ValueParitySign) -> ParityConstants {
        ParityConstants::Value(PrimitiveValue::Sentence(Sentence::Statement(n, s)))
    }

    pub fn even() -> ValueParitySign {
        ValueParitySign::Even
    }

    pub fn odd() -> ValueParitySign {
        ValueParitySign::Odd
    }

    pub fn make_num(n: u64) -> ValueN {
        let mut count = n;
        let mut v = ValueN::Zero;
        while count > 0 {
            v = ValueN::Succ(Box::new(v));
            count -= 1;
        }
        v
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ParityConstantsTokens {
    ZeroAxiom,
    MakeEven,
    MakeOdd,
    Zero,
    Succ,
    Even,
    Odd,
    Colon,
}

fn get_method_tok(input: &str) -> Option<(ParityConstantsTokens, usize)> {
    if &input[0..1] == ":" {
        return Some((ParityConstantsTokens::Colon, 0));
    }
    if input.len() >= 2 {
        match &input[0..2] {
            "za" => Some((ParityConstantsTokens::ZeroAxiom, 1)),
            "me" => Some((ParityConstantsTokens::MakeEven, 1)),
            "mo" => Some((ParityConstantsTokens::MakeOdd, 1)),

            _ => {
                if input.len() >= 3 && &input[0..3] == "Odd" {
                    Some((ParityConstantsTokens::Odd, 2))
                } else if input.starts_with("Even") {
                    Some((ParityConstantsTokens::Even, 3))
                } else {
                    None
                }
            }
        }
    } else {
        None
    }
}

fn get_val_tok(input: &str) -> Option<ParityConstantsTokens> {
    eprintln!("Get val_tok called on {:?}", input);
    match &input[0..1] {
        "0" => Some(ParityConstantsTokens::Zero),
        "s" => Some(ParityConstantsTokens::Succ),
        _ => None,
    }
}
impl Tokenizable for ParityConstantsTokens {
    fn tokenize(input: &str) -> Option<(Self, usize)> {
        if input.is_empty() {
            return None;
        };
        if let Some(t) = get_val_tok(input) {
            Some((t, 0))
        } else {
            get_method_tok(input)
        }
    }
}

impl ConstantToken for ParityConstantsTokens {}

impl Constant for ParityConstants {
    fn type_of(&self) -> crate::ConstantType {
        match self {
            ParityConstants::Method(m) => {
                let arg_count = match m {
                    ast::Method::ZeroAxiom => 0,
                    ast::Method::MakeEven => 1,
                    ast::Method::MakeOdd => 1,
                };
                ConstantType::Method { arg_count }
            }
            ParityConstants::Value(v) => match v {
                ast::PrimitiveValue::Num(_) => crate::ConstantType::Val,
                ast::PrimitiveValue::Sign(_) => crate::ConstantType::Val,
                ast::PrimitiveValue::Sentence(_) => crate::ConstantType::Sentence,
            },
        }
    }
}
pub struct ParityConstantsParser;

fn parse_value_n<TI, K>(toks: &mut Peekable<TI>) -> Result<ValueN, ParseError>
where
    TI: Iterator<Item = PhiToken<ParityConstantsTokens, K>>,
    K: KeywordToken,
{
    let n = match toks.next() {
        Some(PhiToken::Const(ParityConstantsTokens::Zero)) => ValueN::Zero,
        Some(PhiToken::Const(ParityConstantsTokens::Succ)) => {
            ValueN::Succ(parse_value_n(toks)?.into())
        }
        Some(_) => return Err(ParseError::ParseConstantError("Unexpected token".into())),
        None => {
            return Err(ParseError::ParseConstantError(
                "Unexpected end of input".into(),
            ))
        }
    };
    Ok(n)
}
use ast::*;
impl<K: KeywordToken> Parseable<PhiToken<ParityConstantsTokens, K>, ParityConstants>
    for ParityConstantsParser
{
    type Error = ParseError;

    fn parse<TI>(toks: &mut Peekable<TI>) -> Result<Option<ParityPhiLambdaTerm>, Self::Error>
    where
        TI: Iterator<Item = PhiToken<ParityConstantsTokens, K>>,
    {
        match toks.peek() {
            Some(PhiToken::Const(ParityConstantsTokens::Zero)) => {
                toks.next();
                Ok(Some(val(num(ValueN::Zero))))
            }
            Some(PhiToken::Const(ParityConstantsTokens::MakeOdd)) => {
                toks.next();
                Ok(Some(ded_app(
                    ParityConstants::Method(ast::Method::MakeOdd),
                    vec![],
                )))
            }
            Some(PhiToken::Const(ParityConstantsTokens::MakeEven)) => {
                toks.next();
                Ok(Some(ded_app(
                    ParityConstants::Method(ast::Method::MakeEven),
                    vec![],
                )))
            }
            Some(PhiToken::Const(ParityConstantsTokens::ZeroAxiom)) => {
                toks.next();
                Ok(Some(ded_app(
                    ParityConstants::Method(ast::Method::ZeroAxiom),
                    vec![],
                )))
            }
            Some(PhiToken::Const(ParityConstantsTokens::Succ)) => {
                let n = parse_value_n(toks)?;
                Ok(Some(val(num(n))))
            }
            _ => todo!(),
        }
    }
}

pub type ParityParser = Parser<
    ParityConstantsTokens,
    PurePhiKeywords,
    ParityConstantsParser,
    PureKeywordsParser,
    ParityConstants,
>;
pub type ParityPhiToken = PhiToken<ParityConstantsTokens, PurePhiKeywords>;
pub type ParityPhiParseResult = Result<Vec<ParityPhiToken>, ParseError>;
pub type ParityPhiLambdaTerm = Phrase<ast::ParityConstants>;

pub fn eval(ast: ParityPhiLambdaTerm) -> ParityConstants {
    match ast {
        Phrase::Deduction(PhiLambdaDeduction::DedApp { op, args }) => {
            let mut args: Vec<_> = args.into_iter().map(eval).collect();
            let method = match *op {
                Expr::Const(ParityConstants::Method(m)) => m,
                _ => todo!(),
            };
            let expected = match method {
                Method::MakeEven => ValueParitySign::Odd,
                Method::MakeOdd => ValueParitySign::Even,
                Method::ZeroAxiom => return sentence(ValueN::Zero, ValueParitySign::Even),
            };
            let arg = args.remove(0);
            match arg {
                ParityConstants::Value(PrimitiveValue::Sentence(Sentence::Statement(n, p))) => {
                    assert_eq!(p, expected);
                    let other = match p {
                        ValueParitySign::Even => ValueParitySign::Odd,
                        ValueParitySign::Odd => ValueParitySign::Even,
                    };
                    sentence(ValueN::Succ(n.into()), other)
                }
                _ => todo!(),
            }
        }
        _ => todo!(),
    }
}

#[test]
fn can_tokenize_successfully() {
    let pgm = "\\ a . s s 0 a";

    let expected = vec![
        PhiToken::Lambda("a".into()),
        PhiToken::Const(ParityConstantsTokens::Succ),
        PhiToken::Const(ParityConstantsTokens::Succ),
        PhiToken::Const(ParityConstantsTokens::Zero),
        PhiToken::Var("a".into()),
    ];
    let results: ParityPhiParseResult = ParityParser::tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);

    let parser_result = ParityParser::parse(&mut results.into_iter().peekable());
    assert!(parser_result.is_ok());
    let expected_result = abs(
        "a",
        fn_app(
            val(num(make_num(2))),
            // Phrase::Expr(Expr::Const(ParityConstants::Num(ast::ValueN::Succ(
            //     Box::new(ast::ValueN::Succ(Box::new(ast::ValueN::Zero))),
            // )))),
            var("a"),
        ),
    );
    assert_eq!(parser_result.unwrap(), expected_result);
}

#[test]
fn parse_proof_1_is_odd() {
    let pgm = "mo (za)";
    let expected = vec![
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::ZeroAxiom),
        PhiToken::RParen,
    ];

    let results: ParityPhiParseResult = ParityParser::tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);
    let parse_result = ParityParser::parse(&mut results.into_iter().peekable());
    assert!(parse_result.is_ok());
    let result = parse_result.unwrap();
    let expected = ded_app(
        ParityConstants::Method(ast::Method::MakeOdd),
        vec![ded_app(
            ParityConstants::Method(ast::Method::ZeroAxiom),
            vec![],
        )],
    );
    assert_eq!(result, expected);
}

#[test]
fn parse_proof_2_is_even() {
    let pgm = " me (mo (za))";
    let expected = vec![
        PhiToken::Const(ParityConstantsTokens::MakeEven),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::ZeroAxiom),
        PhiToken::RParen,
        PhiToken::RParen,
    ];

    let results: ParityPhiParseResult = ParityParser::tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);
    let parse_result = ParityParser::parse(&mut results.into_iter().peekable());
    assert!(parse_result.is_ok());
    let result = parse_result.unwrap();
    let expected = ded_app(
        ParityConstants::Method(ast::Method::MakeEven),
        vec![ded_app(
            ParityConstants::Method(ast::Method::MakeOdd),
            vec![ded_app(
                ParityConstants::Method(ast::Method::ZeroAxiom),
                vec![],
            )],
        )],
    );

    assert_eq!(result, expected);
}

#[test]
fn parse_proof_3_is_odd() {
    let pgm = " mo (me (mo (za)))";
    let expected = vec![
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeEven),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::ZeroAxiom),
        PhiToken::RParen,
        PhiToken::RParen,
        PhiToken::RParen,
    ];

    let results: ParityPhiParseResult = ParityParser::tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);
    let parse_result = ParityParser::parse(&mut results.into_iter().peekable());
    assert!(parse_result.is_ok());
    let result = parse_result.unwrap();
    let expected = ded_app(
        ParityConstants::Method(ast::Method::MakeOdd),
        vec![ded_app(
            ParityConstants::Method(ast::Method::MakeEven),
            vec![ded_app(
                ParityConstants::Method(ast::Method::MakeOdd),
                vec![ded_app(
                    ParityConstants::Method(ast::Method::ZeroAxiom),
                    vec![],
                )],
            )],
        )],
    );

    assert_eq!(result, expected);
}
#[test]
fn parse_proof_4_is_even() {
    let pgm = "me (mo (me (mo (za))))";
    let expected = vec![
        PhiToken::Const(ParityConstantsTokens::MakeEven),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeEven),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::MakeOdd),
        PhiToken::LParen,
        PhiToken::Const(ParityConstantsTokens::ZeroAxiom),
        PhiToken::RParen,
        PhiToken::RParen,
        PhiToken::RParen,
        PhiToken::RParen,
    ];

    let results: ParityPhiParseResult = ParityParser::tokenize(pgm);
    assert!(results.is_ok());
    let results = results.unwrap();
    assert_eq!(expected, results);
}

#[test]
fn test_proof_4_is_even() {
    let pgm = "me mo me mo za";
    let tokens = ParityParser::tokenize(pgm).unwrap();
    let ast = ParityParser::parse(&mut tokens.into_iter().peekable()).unwrap();
    let result = eval(ast);
    assert_eq!(result, sentence(make_num(4), ValueParitySign::Even));
}
