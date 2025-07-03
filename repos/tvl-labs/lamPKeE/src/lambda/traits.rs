use std::{error::Error, iter::Peekable};

use crate::ast::PhiLambdaPhrase;
pub trait Tokenizable: Sized {
    fn tokenize(input: &str) -> Option<(Self, usize)> {
        _ = input;
        None
    }
}

pub trait Parseable<Token, Ast> {
    type Error: Error;

    fn parse<TI>(toks: &mut Peekable<TI>) -> Result<Option<PhiLambdaPhrase<Ast>>, Self::Error>
    where
        TI: Iterator<Item = Token>;
}

pub trait ConstantToken: Tokenizable + PartialEq + Eq + std::fmt::Debug {}

pub trait KeywordToken: Tokenizable + PartialEq + Eq + std::fmt::Debug {}

pub enum ConstantType {
    Method { arg_count: usize },
    Val,
    Sentence,
}
pub trait Constant: Clone {
    fn type_of(&self) -> ConstantType;
}
pub trait Keyword {}
