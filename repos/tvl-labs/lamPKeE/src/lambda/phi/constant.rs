use std::iter::Peekable;

use crate::ast::{PhiLambdaDeduction as Ded, PhiLambdaExpr as Expr, PhiLambdaPhrase as Phrase};
use crate::traits::{KeywordToken, Parseable, Tokenizable};
use crate::{Constant, ParseError};
use crate::{ConstantToken, PhraseToken as PhiToken};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PurePhiConstants {
    Claim,
    True,
}
impl PurePhiConstants {
    pub fn is_constant<K>(tok: PhiToken<PurePhiConstants, K>) -> bool
    where
        K: KeywordToken + Tokenizable + PartialEq + Eq + Clone,
    {
        // XXX: Why == claim?
        tok == PhiToken::Const(PurePhiConstants::Claim)
    }
}

impl Tokenizable for PurePhiConstants {
    fn tokenize(input: &str) -> Option<(Self, usize)> {
        if input.len() < 5 {
            return None;
        }
        if &input[0..5] == "claim" {
            Some((PurePhiConstants::Claim, 4))
        } else {
            None
        }
    }
}

impl ConstantToken for PurePhiConstants {}
impl Constant for PurePhiConstants {
    fn type_of(&self) -> crate::ConstantType {
        match self {
            Self::Claim => crate::ConstantType::Method { arg_count: 1 },
            Self::True => crate::ConstantType::Sentence,
        }
    }
}
pub struct PureConstantsParser;
impl<K: KeywordToken> Parseable<PhiToken<PurePhiConstants, K>, PurePhiConstants>
    for PureConstantsParser
{
    type Error = ParseError;

    fn parse<TI>(toks: &mut Peekable<TI>) -> Result<Option<Phrase<PurePhiConstants>>, Self::Error>
    where
        TI: Iterator<Item = PhiToken<PurePhiConstants, K>>,
    {
        match toks.peek() {
            Some(PhiToken::Const(PurePhiConstants::Claim)) => {
                toks.next();
                Ok(Some(Phrase::Deduction(Ded::DedApp {
                    op: Box::new(Expr::Const(PurePhiConstants::Claim)),
                    args: vec![],
                })))
            }
            _ => Ok(None),
        }
    }
}
