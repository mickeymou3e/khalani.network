use crate::ast::PhiLambdaPhrase;
use crate::traits::{KeywordToken, Parseable, Tokenizable};
use crate::{Constant, ParseError};
use crate::{ConstantToken, PhraseToken as PhiToken};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PurePhiKeywords {
    Nothing,
}

impl Tokenizable for PurePhiKeywords {}

impl KeywordToken for PurePhiKeywords {}

pub struct PureKeywordsParser;

impl<C: ConstantToken, T: Constant> Parseable<PhiToken<C, PurePhiKeywords>, T>
    for PureKeywordsParser
{
    type Error = ParseError;

    fn parse<TI>(
        _toks: &mut std::iter::Peekable<TI>,
    ) -> Result<Option<PhiLambdaPhrase<T>>, Self::Error>
    where
        TI: Iterator<Item = PhiToken<C, PurePhiKeywords>>,
    {
        Ok(None)
    }
}
