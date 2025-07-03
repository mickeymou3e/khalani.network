use std::rc::Rc;

use axi_ast::{EnumVariant, FunctionDef, Identifier, InductiveEnum, LocExpr, StructDecl};
use rpds::{HashTrieMap, HashTrieSet};

use super::{
    interpreter::{InterResult, Interpreter, Params},
    proposition::{Proposition, Term},
};

#[derive(Default, Clone)]
pub struct AssumptionBase {
    inner: HashTrieSet<Rc<Proposition>>,
}

impl AssumptionBase {
    pub fn contains(&self, prop: &Proposition) -> bool {
        self.inner.contains(prop)
    }

    pub fn insert(&mut self, prop: Rc<Proposition>) {
        self.inner.insert_mut(prop)
    }

    pub fn remove(&mut self, prop: &Proposition) {
        self.inner.remove_mut(prop);
    }
}

#[derive(Clone)]
pub enum Def {
    Prop(Rc<Proposition>),
    /// Closure, formal params, body.
    Proc(DefTable, Vec<Identifier>, LocExpr),
    BuiltinMethod,
    ExternalProc(Rc<dyn ExternalProc>),
    BuiltInEq,
    Term(Term),
    EnumVariant(Rc<EnumVariant>, /* type name */ Identifier),
    Function(Rc<FunctionDef>),
}

impl Def {
    pub fn is_enum_variant(&self) -> bool {
        matches!(self, Def::EnumVariant(..))
    }

    /// Test that this is a function or an enum variant.
    pub fn is_function_like(&self) -> bool {
        matches!(self, Def::EnumVariant(..) | Def::Function(..))
    }
}

#[derive(Clone, Copy)]
pub enum BuiltInType {
    Boolean,
    Nat,
    Bytes,
    U8,
}

#[derive(Clone)]
pub enum TypeDef {
    InductiveEnum(Rc<InductiveEnum>),
    BuiltIn(BuiltInType),
    Struct(Rc<StructDecl>),
    Domain,
}

#[derive(Default, Clone)]
pub struct DefTable {
    defs: HashTrieMap<String, Rc<Def>>,
    top_defs: HashTrieMap<String, Rc<Def>>,
    types: HashTrieMap<String, Rc<TypeDef>>,
}

impl DefTable {
    pub fn with_builtins() -> Self {
        let mut this = Self::default();
        this.define_type("Boolean".into(), TypeDef::BuiltIn(BuiltInType::Boolean));
        this.define_type("u8".into(), TypeDef::BuiltIn(BuiltInType::Boolean));
        let methods = [
            "claim",
            "dn",
            "both",
            "left_and",
            "right_and",
            "left_either",
            "right_either",
            "absurd",
            "mp",
            "mt",
            "left_iff",
            "right_iff",
            "equiv",
            "cd",
            "false_elim",
            "true_intro",
            "uspec",
            "egen",
            "reflex",
            "fcong",
            "rcong",
            "eq_chain",
            "assert",
            "prove_by_eval_term",
            "prove_by_eval",
        ];
        for m in methods {
            this.define_top(m.into(), Def::BuiltinMethod.into());
        }
        this.define_top("=".into(), Def::BuiltInEq.into());
        this
    }

    pub fn closure(&self) -> DefTable {
        self.clone()
    }

    pub fn define_top(&mut self, ident: String, expr: Rc<Def>) {
        self.top_defs.insert_mut(ident, expr);
    }

    pub fn define(&mut self, ident: String, expr: Rc<Def>) {
        self.defs.insert_mut(ident, expr);
    }

    pub fn get_type(&self, name: &str) -> Option<Rc<TypeDef>> {
        self.types.get(name).cloned()
    }

    pub fn define_type(&mut self, name: String, type_: impl Into<Rc<TypeDef>>) {
        self.types.insert_mut(name, type_.into());
    }

    pub fn get(&self, ident: &str) -> Option<Rc<Def>> {
        self.defs
            .get(ident)
            .cloned()
            .or_else(|| self.top_defs.get(ident).cloned())
    }
}

pub trait ExternalProc {
    fn run(&self, ctx: &Interpreter, params: Params) -> InterResult;
}

pub trait ExternalEval {
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str>;
}

impl<F> ExternalEval for F
where
    F: Fn(&[Term]) -> Result<Term, &'static str>,
{
    fn eval(&self, params: &[Term]) -> Result<Term, &'static str> {
        (self)(params)
    }
}
