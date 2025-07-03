use std::{borrow::Cow, fmt, rc::Rc};

use num_bigint::BigUint;
use unifier_set::{ClassifyTerm, DirectChildren, TermKind, UnifierSet};

#[derive(Clone, Hash, PartialEq, Eq)]
pub enum Proposition {
    True,
    False,
    ForAll(Type, Rc<Proposition>),
    Exists(Type, Rc<Proposition>),
    Not(Rc<Proposition>),
    And(Rc<Proposition>, Rc<Proposition>),
    Or(Rc<Proposition>, Rc<Proposition>),
    If(Rc<Proposition>, Rc<Proposition>),
    Iff(Rc<Proposition>, Rc<Proposition>),
    /// Boolean terms are propositions.
    Term(Term),
}

impl Proposition {
    pub fn equal(l: Term, r: Term) -> Self {
        Self::Term(Term::FunctionApp(
            "=".into(),
            vec![l, r],
            Type::boolean().clone(),
        ))
    }
}

#[derive(Clone, Hash, PartialEq, Eq)]
pub struct Type {
    pub name: Cow<'static, str>,
    pub var: Option<TypeVar>,
}

impl Type {
    pub fn new_var(var: TypeVar) -> Type {
        Self {
            name: format!("?t{}", var.0).into(),
            var: Some(var),
        }
    }

    pub fn new(name: impl Into<Cow<'static, str>>) -> Self {
        Self {
            name: name.into(),
            var: None,
        }
    }

    pub fn boolean() -> &'static Self {
        static BOOLEAN: Type = Type {
            name: Cow::Borrowed("Boolean"),
            var: None,
        };

        &BOOLEAN
    }

    pub fn nat() -> &'static Self {
        static NAT: Type = Type {
            name: Cow::Borrowed("Nat"),
            var: None,
        };

        &NAT
    }

    pub fn u8() -> &'static Self {
        static U8: Type = Type {
            name: Cow::Borrowed("u8"),
            var: None,
        };

        &U8
    }

    pub fn bytes() -> &'static Self {
        static BYTES: Type = Type {
            name: Cow::Borrowed("Bytes"),
            var: None,
        };

        &BYTES
    }

    pub fn is_boolean(&self) -> bool {
        self.name == "Boolean"
    }
}

impl From<&axi_ast::TypeReference> for Type {
    fn from(t: &axi_ast::TypeReference) -> Self {
        Self::new(t.name.cloned())
    }
}

#[derive(Clone, Hash, PartialEq, Eq)]
pub enum Term {
    /// A global unique id for a variable.
    Var(u64, Type),
    /// Constant enum variants.
    Constant(String, Type),
    // Function application terms.
    //
    // Struct construction and field access are also FunctionApp terms with
    // special function names:
    //
    // Struct construction is represented by the special function name
    // <struct_name>.mk, and field access is represented by the function
    // <struct_name>.<field_name>.
    FunctionApp(String, Vec<Term>, Type),
    /// De Bruijn index for a quantified variable.
    Bound(u64, Type),
    BuiltinNat(BigUint),
    BuiltinU8(u8),
    BuiltinBytes(Vec<u8>),
}

impl Term {
    pub fn type_(&self) -> &Type {
        match self {
            Term::Var(_, tp) => tp,
            Term::Constant(_, tp) => tp,
            Term::Bound(_, tp) => tp,
            Term::FunctionApp(_, _, tp) => tp,
            Term::BuiltinNat(_) => Type::nat(),
            Term::BuiltinBytes(_) => Type::bytes(),
            Term::BuiltinU8(_) => Type::u8(),
        }
    }

    pub fn with_type(&self, t: Type) -> Term {
        match self {
            Term::Var(v, _) => Term::Var(*v, t),
            Term::Bound(v, _) => Term::Bound(*v, t),
            t => t.clone(),
        }
    }

    pub fn var_eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Term::Var(v1, _), Term::Var(v2, _)) => v1 == v2,
            _ => false,
        }
    }

    pub fn is_true(&self) -> bool {
        match self {
            Term::Constant(s, t) => s == "true" && t.name == "Boolean",
            _ => false,
        }
    }

    pub fn is_false(&self) -> bool {
        match self {
            Term::Constant(s, t) => s == "false" && t.name == "Boolean",
            _ => false,
        }
    }
}

fn map_propositional(
    p: &Proposition,
    mut f: impl FnMut(&Rc<Proposition>) -> Rc<Proposition>,
) -> Proposition {
    use Proposition::*;
    match p {
        Not(p) => Not(f(p)),
        And(p, q) => And(f(p), f(q)),
        Or(p, q) => Or(f(p), f(q)),
        If(p, q) => If(f(p), f(q)),
        Iff(p, q) => Iff(f(p), f(q)),
        p => p.clone(),
    }
}

/// Substitute t to de Bruijn index. Will also reify all type variables.
pub fn de_bruijn(
    p: &Proposition,
    index: u64,
    t: &Term,
    unifier: &UnifierSet<TypeVar, Type>,
    has_remaining_type_variables: &mut bool,
) -> Proposition {
    match p {
        Proposition::ForAll(tp, p) => Proposition::ForAll(
            unifier.reify_term(tp),
            de_bruijn(p, index + 1, t, unifier, has_remaining_type_variables).into(),
        ),
        Proposition::Exists(tp, p) => Proposition::Exists(
            unifier.reify_term(tp),
            de_bruijn(p, index + 1, t, unifier, has_remaining_type_variables).into(),
        ),
        Proposition::Term(t1) => Proposition::Term(de_bruijn_param(
            t1,
            index,
            t,
            unifier,
            has_remaining_type_variables,
        )),
        p => map_propositional(p, |p0| {
            de_bruijn(p0, index, t, unifier, has_remaining_type_variables).into()
        }),
    }
}

fn de_bruijn_param(
    p: &Term,
    index: u64,
    t: &Term,
    unifier: &UnifierSet<TypeVar, Type>,
    has_remaining_type_variables: &mut bool,
) -> Term {
    match p {
        Term::FunctionApp(f, ps, tp) => {
            let ps = ps
                .iter()
                .map(|p| de_bruijn_param(p, index, t, unifier, has_remaining_type_variables))
                .collect();
            Term::FunctionApp(f.clone(), ps, tp.clone())
        }
        t1 => {
            let real_type = unifier.reify_term(t1.type_());
            if real_type.is_var() {
                *has_remaining_type_variables = true;
            }
            if t1 == t || t1.var_eq(t) {
                Term::Bound(index, real_type)
            } else {
                t1.with_type(real_type)
            }
        }
    }
}

/// Substitute bound parameter (de Bruijn index) with term.
pub fn subst(p: &Proposition, index: u64, q: &Term) -> Proposition {
    match p {
        Proposition::ForAll(t, p) => Proposition::ForAll(t.clone(), subst(p, index + 1, q).into()),
        Proposition::Exists(t, p) => Proposition::Exists(t.clone(), subst(p, index + 1, q).into()),
        Proposition::Term(t) => Proposition::Term(subst_param(t, index, q)),
        p => map_propositional(p, |p0| subst(p0, index, q).into()),
    }
}

fn subst_param(p: &Term, index: u64, q: &Term) -> Term {
    match p {
        Term::FunctionApp(f, ps, tp) => {
            let ps = ps.iter().map(|p| subst_param(p, index, q)).collect();
            Term::FunctionApp(f.clone(), ps, tp.clone())
        }
        Term::Bound(l, _) if *l == index => q.clone(),
        _ => p.clone(),
    }
}

pub fn all_universal(mut p: Proposition) -> Proposition {
    let mut vars = Vec::new();
    all_free_variables(&p, &mut vars);
    for v in vars.into_iter().rev() {
        p = Proposition::ForAll(
            v.type_().clone(),
            de_bruijn(&p, 0, &v, &Default::default(), &mut false).into(),
        );
    }
    p
}

fn all_free_variables(p: &Proposition, vars: &mut Vec<Term>) {
    match p {
        Proposition::Not(p) => {
            all_free_variables(p, vars);
        }
        Proposition::And(p1, p2) => {
            all_free_variables(p1, vars);
            all_free_variables(p2, vars);
        }
        Proposition::Or(p1, p2) => {
            all_free_variables(p1, vars);
            all_free_variables(p2, vars);
        }
        Proposition::If(p1, p2) => {
            all_free_variables(p1, vars);
            all_free_variables(p2, vars);
        }
        Proposition::Iff(p1, p2) => {
            all_free_variables(p1, vars);
            all_free_variables(p2, vars);
        }
        Proposition::True | Proposition::False => {}
        Proposition::Exists(_, p) => all_free_variables(p, vars),
        Proposition::ForAll(_, p) => all_free_variables(p, vars),
        Proposition::Term(t) => all_free_variables_in_term(t, vars),
    }
}

fn all_free_variables_in_term(t: &Term, vars: &mut Vec<Term>) {
    match t {
        Term::FunctionApp(_, ts, _) => {
            for t in ts {
                all_free_variables_in_term(t, vars);
            }
        }
        t @ Term::Var(..) => {
            if !vars.contains(t) {
                vars.push(t.clone());
            }
        }
        _ => {}
    }
}

impl fmt::Display for Proposition {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        use Proposition::*;
        match self {
            True => write!(f, "true"),
            False => write!(f, "false"),
            And(x, y) => write!(f, "and({x}, {y})"),
            Or(x, y) => write!(f, "or({x}, {y})"),
            If(x, y) => write!(f, "if({x}, {y})"),
            Iff(x, y) => write!(f, "iff({x}, {y})"),
            Not(x) => write!(f, "not({x})"),
            Exists(t, p) => write!(f, "exists {}. {p}", t.name),
            ForAll(t, p) => write!(f, "forall {}. {p}", t.name),
            Term(self::Term::FunctionApp(fun, ts, _)) => write!(f, "{fun}{ts:?}"),
            Term(self::Term::Constant(c, _)) => write!(f, "{c}"),
            Term(t) => write!(f, "{t}"),
        }
    }
}

impl fmt::Debug for Proposition {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{self}")
    }
}

impl fmt::Display for Term {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        use Term::*;
        match self {
            Var(v, t) => write!(f, "*{v}:{}", t.name),
            Bound(b, t) => write!(f, "@{b}:{}", t.name),
            Constant(e, t) => write!(f, "{e}:{}", t.name),
            FunctionApp(func, ts, t) => write!(f, "{func}{ts:?}):{}", t.name),
            BuiltinNat(n) => write!(f, "{n}"),
            BuiltinBytes(bs) => write!(f, "0x{}", hex::encode(bs)),
            BuiltinU8(u) => write!(f, "{}_u8", u),
        }
    }
}

impl fmt::Debug for Term {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{self}")
    }
}

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
pub struct TypeVar(pub u64);

impl From<TypeVar> for Type {
    fn from(value: TypeVar) -> Self {
        Type::new_var(value)
    }
}

impl ClassifyTerm<TypeVar> for Type {
    fn superficially_unifiable(&self, other: &Self) -> bool {
        self == other
    }

    fn classify_term(&self) -> TermKind<&TypeVar> {
        match self.var {
            Some(ref v) => TermKind::Var(v),
            _ => TermKind::NonVar,
        }
    }
}

impl DirectChildren<TypeVar> for Type {
    fn direct_children<'a>(&'a self) -> Box<dyn Iterator<Item = &'a Self> + 'a> {
        Box::new([].iter())
    }

    fn map_direct_children<'a>(&'a self, _f: impl FnMut(&'a Self) -> Self + 'a) -> Self {
        self.clone()
    }
}

#[cfg(test)]
mod tests;
