use std::rc::Rc;

#[derive(Debug, PartialEq, Eq)]
pub enum PrimFunc {
    EqFun,
    NotFun,
    AndFun,
    OrFun,
    IfFun,
    IffFun,
}

#[derive(Debug, PartialEq, Eq)]
pub enum PrimMethod {
    Claim,
    Dn,
    Mp,
    Both,
    LeftAnd,
    RightAnd,
    Cd,
    LeftEither,
    RightEither,
    CondRule,
    Equiv,
    LeftIff,
    RightIff,
    Absurd,
    TrueIntro,
    NegRule,
    FalseElim,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Constant {
    PrimMethodConstant(PrimMethod),
    PrimFunConstant(PrimFunc),
    PropAtomConstant(String),
    TrueConstant,
    FalseConstant,
}

pub type Ide = String;

#[derive(Debug, PartialEq, Eq)]
pub enum Proposition {
    Atom(String),
    TrueProp,
    FalseProp,
    Neg(Rc<Proposition>),
    Conj {
        left: Rc<Proposition>,
        right: Rc<Proposition>,
    },
    Disj {
        left: Rc<Proposition>,
        right: Rc<Proposition>,
    },
    Cond {
        left: Rc<Proposition>,
        right: Rc<Proposition>,
    },
    BiCond {
        left: Rc<Proposition>,
        right: Rc<Proposition>,
    },
}

#[derive(Debug, PartialEq, Eq)]
pub enum Exp {
    Const(Constant),
    Ide(Ide),
    Fun {
        params: Vec<Ide>,
        body: Rc<Exp>,
    },
    Method {
        params: Vec<Ide>,
        body: Rc<Ded>,
    },
    FunApp(Rc<Exp>, Vec<Phrase>),
    Let(Vec<(Ide, Rc<Phrase>)>, Rc<Exp>),
    Fix(Ide, Rc<Exp>),
    Match {
        discriminant: Rc<Exp>,
        cases: Vec<(Rc<Pattern>, Rc<Exp>)>,
    },
    Seq(Vec<Rc<Exp>>),
}

impl Exp {
    pub fn seq(self, e: Exp) -> Exp {
        match self {
            Exp::Seq(mut es) => {
                es.push(Rc::new(e));
                Exp::Seq(es)
            }
            _ => match e {
                Exp::Seq(es) => {
                    let mut ess = vec![Rc::new(self)];
                    ess.extend(es);
                    Exp::Seq(ess)
                }
                _ => Exp::Seq(vec![Rc::new(self), Rc::new(e)]),
            },
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum Ded {
    MethodApp(Rc<Exp>, Vec<Phrase>),
    Assume(Rc<Exp>, Rc<Ded>),
    SupposeAbsurd(Rc<Exp>, Rc<Ded>),
    LetDed(Vec<(Ide, Rc<Phrase>)>, Rc<Ded>),
    By(Rc<Exp>, Rc<Ded>),
    SeqDed(Vec<Rc<Ded>>),
    MatchDed {
        discriminant: Rc<Exp>,
        cases: Vec<(Rc<Pattern>, Rc<Ded>)>,
    },
}

impl Ded {
    pub fn seq(self, d: Ded) -> Ded {
        match self {
            Ded::SeqDed(mut ds) => {
                ds.push(Rc::new(d));
                Ded::SeqDed(ds)
            }
            _ => match d {
                Ded::SeqDed(es) => {
                    let mut ess = vec![Rc::new(self)];
                    ess.extend(es);
                    Ded::SeqDed(ess)
                }
                _ => Ded::SeqDed(vec![Rc::new(self), Rc::new(d)]),
            },
        }
    }
}
#[derive(Debug, PartialEq, Eq)]
pub enum Phrase {
    Exp(Rc<Exp>),
    Ded(Rc<Ded>),
}

#[derive(Debug, PartialEq, Eq)]
pub enum Pattern {
    IdPat(Ide),
    AtomPat(String),
    TruePat,
    FalsePat,
    AnyPat,
    NegPat(Rc<Pattern>),
    ConjPat {
        left: Rc<Pattern>,
        right: Rc<Pattern>,
    },
    DisjPat {
        left: Rc<Pattern>,
        right: Rc<Pattern>,
    },
    CondPat {
        left: Rc<Pattern>,
        right: Rc<Pattern>,
    },
    BiCondPat {
        left: Rc<Pattern>,
        right: Rc<Pattern>,
    },
}
