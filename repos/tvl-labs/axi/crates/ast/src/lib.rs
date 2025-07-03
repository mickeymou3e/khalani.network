use std::{ops::Deref, rc::Rc};

pub type Identifier = String;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Loc {
    pub left: usize,
    pub right: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WithLoc<T> {
    pub inner: T,
    pub loc: Loc,
}

pub type LocExpr = WithLoc<Expr>;
pub type LocIdentifier = WithLoc<Identifier>;
pub type LocPattern = WithLoc<Pattern>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Expr {
    Ident(String),
    Assume {
        assumption: Box<LocExpr>,
        body: Vec<Stmt>,
    },
    ByInduction(ByInductionExpr),
    MethodApp(String, Vec<LocExpr>),
    PickAny(Vec<(Identifier, TypeReference)>, Vec<Stmt>),
    PropApp(PropOp, Vec<LocExpr>),
    StructExpr(StructExpr),
    FieldAccess(Box<LocExpr>, WithLoc<Identifier>),
    Proc(Vec<Identifier>, Box<LocExpr>),
    /// Function or predicate or procedure.
    App(Identifier, Vec<LocExpr>),
    ForAll(Vec<(Identifier, Option<TypeReference>)>, Box<LocExpr>),
    Exists(Vec<(Identifier, Option<TypeReference>)>, Box<LocExpr>),
    Stmts(Vec<Stmt>),
    Match(MatchExpr),
    IfElse(IfElseExpr),
    LitNat(String),
    LitHex(String),
    LitU8(String),
    True,
    False,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PropOp {
    Not,
    And,
    Or,
    If,
    Iff,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Stmt {
    Expr(LocExpr),
    LetBinding(Identifier, LocExpr),
    ConstDec(LocIdentifier, TypeReference),
    ProcDef(Identifier, Vec<Identifier>, LocExpr),
    PickWitness(Vec<Identifier>, LocExpr),
    InductiveEnum(Rc<InductiveEnum>),
    Struct(Rc<StructDecl>),
    Domain(LocIdentifier),
    FunctionDef(Rc<FunctionDef>),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InductiveEnum {
    pub name: LocIdentifier,
    pub variants: Vec<Rc<EnumVariant>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StructDecl {
    pub name: LocIdentifier,
    pub fields: Vec<Field>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Field {
    pub name: LocIdentifier,
    pub type_: TypeReference,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StructExpr {
    pub name: LocIdentifier,
    pub fields: Vec<(LocIdentifier, LocExpr)>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EnumVariant {
    pub name: LocIdentifier,
    pub fields: Vec<TypeReference>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TypeReference {
    pub name: LocIdentifier,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FunctionDef {
    pub name: LocIdentifier,
    pub params: Vec<(Identifier, TypeReference)>,
    pub return_type: TypeReference,
    pub body: Option<Vec<Stmt>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ByInductionExpr {
    pub var: Identifier,
    pub type_: TypeReference,
    pub goal: Box<LocExpr>,
    pub cases: Vec<(LocPattern, LocExpr)>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MatchExpr {
    pub scrutinee: Box<LocExpr>,
    pub match_arms: Vec<(LocPattern, LocExpr)>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IfElseExpr {
    pub condition: Box<LocExpr>,
    pub true_branch: Vec<Stmt>,
    pub false_branch: Vec<Stmt>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Pattern {
    // Identifier or variant
    Identifier(Identifier),
    TupleStruct(LocIdentifier, Vec<LocPattern>),
}

impl Loc {
    pub fn till(self, right: Loc) -> Loc {
        Loc {
            left: self.left,
            right: right.right,
        }
    }
}

impl<T> WithLoc<T>
where
    T: Clone,
{
    pub fn cloned(&self) -> T {
        self.inner.clone()
    }
}

impl<T> Deref for WithLoc<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl From<(usize, usize)> for Loc {
    fn from((left, right): (usize, usize)) -> Self {
        Self { left, right }
    }
}

pub trait WithLocExt: Sized {
    fn with_loc<L>(self, loc: L) -> WithLoc<Self>
    where
        L: Into<Loc>,
    {
        WithLoc {
            inner: self,
            loc: loc.into(),
        }
    }
}

impl<T: Sized> WithLocExt for T {}
