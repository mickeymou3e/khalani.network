use crate::traits::{ConstantToken, KeywordToken};

type BoundVar = String;
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PhraseToken<C: ConstantToken, K: KeywordToken> {
    Lambda(BoundVar),
    LParen,
    RParen,
    Var(String),
    Kwd(K),
    Const(C),
}
