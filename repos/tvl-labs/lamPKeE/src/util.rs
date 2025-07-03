use crate::lambda::ast::{
    Identifier, PhiLambdaDeduction as Ded, PhiLambdaExpr as Expr, PhiLambdaPhrase as Phrase,
};
use std::boxed::Box;

pub fn ident(i: impl Into<Identifier>) -> Identifier {
    i.into()
}

pub fn var<T>(i: impl Into<Identifier>) -> Phrase<T> {
    Phrase::Expr(Expr::Var(i.into()))
}

pub fn abs<T>(var: impl Into<Identifier>, body: Phrase<T>) -> Phrase<T> {
    Phrase::Expr(Expr::Func {
        bound_var: var.into(),
        body: Box::new(
            body.try_into()
                .expect("Error converting phrase to expression"),
        ),
    })
}

pub fn fn_app<T>(l: Phrase<T>, r: Phrase<T>) -> Phrase<T> {
    Phrase::Expr(Expr::FuncApp {
        op: Box::new(
            l.try_into()
                .expect("Error convert app operation to expression"),
        ),
        args: vec![r],
    })
}

pub fn val<T>(item: T) -> Phrase<T> {
    Phrase::Expr(Expr::Const(item))
}

pub fn ded_app<T>(op: T, args: Vec<Phrase<T>>) -> Phrase<T> {
    Phrase::Deduction(Ded::DedApp {
        op: Box::new(Expr::Const(op)),
        args,
    })
}

// pub enum MatchPat {
//     Wildcard,
//     Split(Vec<MatchPat>),
//     TokLiteral(Token),
//     // Binding is a binding to a pattern + the pattern that denotes where the bidning should end
//     Binding(Box<MatchRes>, Token)
// }

// pub enum MatchRes {
//     Tok(Token),
//     Multi(Vec<Token>),
//     Collection(Vec<MatchRes>),
//     Nothing
// }
//  pub fn match_tok_seq(pat: &mut MatchPat, toks: Vec<Token>) -> (MatchRes, Vec<Token>) {
//     match pat {
//         MatchPat::Wildcard => (MatchRes::Tok(toks.first().cloned().unwrap()), toks[1..].to_vec()),
//         MatchPat::Split(pats) => {
//             let mut leftover_toks = toks.clone();
//             let mut matches = vec![];
//             for pat in pats {
//                 if let MatchPat::Binding(mut  p, l) = pat {

//                 }
//                 let (res, new_toks) = match_tok_seq(pat, leftover_toks);
//                 leftover_toks = new_toks;
//                 matches.push(res);
//             }

//             (MatchRes::Collection(matches), leftover_toks)
//         },
//         MatchPat::TokLiteral(l) => {
//             (MatchRes::Tok(l.clone()), toks[1..].to_vec())
//         },
//         MatchPat::Binding(r) => {

//         },
//     }
//  }

// pub fn match_pats(pats: &mut Vec<MatchPat>, toks: &mut [Token]) -> (Vec<MatchPat>, Vec<Token>, bool) {
//     todo!()
// }
