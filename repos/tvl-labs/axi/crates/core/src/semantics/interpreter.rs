use std::{
    borrow::Cow,
    cell::RefCell,
    collections::{HashMap, HashSet},
    error::Error,
    fmt,
    rc::Rc,
    sync::atomic::{AtomicU64, Ordering},
};

use axi_ast::{EnumVariant, Expr, Loc, LocExpr, Pattern, PropOp, Stmt, WithLoc, WithLocExt};
use axi_parser::{lex::lexer, parser::stmts_all};
use scopeguard::defer;
use unifier_set::{ClassifyTerm, UnifierSet};

use crate::{context::*, proposition::*};

/// Term evaluation. Esp. user defined functions evaluation.
mod eval;
mod symbolic_evaluator;

#[derive(Debug)]
pub struct EvalError {
    pub location: Loc,
    pub message: Cow<'static, str>,
    pub labels: Vec<(Loc, Cow<'static, str>)>,
}

impl fmt::Display for EvalError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Error {}-{}: {}",
            self.location.left, self.location.right, self.message
        )
    }
}

impl Error for EvalError {}

#[cfg(feature = "ariadne")]
impl EvalError {
    pub fn as_ariadne_report(&self) -> ariadne::Report<'_> {
        use ariadne::*;

        let span = self.location.left..self.location.right;
        let mut r = Report::build(ReportKind::Error, span.clone())
            .with_label(Label::new(span).with_message(&self.message));
        for (loc, msg) in &self.labels {
            r = r.with_label(Label::new(loc.left..loc.right).with_message(msg));
        }
        r.finish()
    }
}

#[macro_export]
macro_rules! error {
    ($loc:expr, $msg:expr) => {
        $crate::interpreter::EvalError {
            location: $loc,
            message: $msg.into(),
            labels: Vec::new(),
        }
    };
}

#[macro_export]
macro_rules! bail {
    ($loc:expr, $msg:expr) => {
        return Err($crate::interpreter::EvalError {
            location: $loc,
            message: $msg.into(),
            labels: Vec::new(),
        })
    };
}

pub enum InterResultInner {
    Proved(Rc<Proposition>),
    Proposition(Rc<Proposition>),
    Proc(DefTable, Vec<String>, LocExpr),
    Term(Term),
    Nothing,
}

impl fmt::Debug for InterResultInner {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            InterResultInner::Nothing => write!(f, "Nothing"),
            InterResultInner::Proc(..) => write!(f, "Proc(..)"),
            InterResultInner::Proposition(p) => write!(f, "Proposition({p:?})"),
            InterResultInner::Proved(p) => write!(f, "Proved({p:?})"),
            InterResultInner::Term(t) => write!(f, "Term({t:?})"),
        }
    }
}

pub type InterResult = Result<InterResultInner, EvalError>;

pub struct Interpreter {
    pub ab: AssumptionBase,
    pub definitions: DefTable,
    extern_function_eval: Rc<RefCell<HashMap<String, Box<dyn ExternalEval>>>>,
    depth: usize,
    pub allow_assert: bool,
    pub use_axiom_translator: bool,
    unifier: Rc<RefCell<UnifierSet<TypeVar, Type>>>,
    /// Whether there are any type variables in any defined terms.
    has_type_variables: bool,
}

impl Interpreter {
    pub fn new_with_builtins() -> Self {
        let mut it = Self {
            ab: Default::default(),
            definitions: DefTable::with_builtins(),
            extern_function_eval: Default::default(),
            depth: 0,
            allow_assert: true,
            use_axiom_translator: true,
            unifier: Default::default(),
            has_type_variables: false,
        };
        let stmts = stmts_all(lexer(include_str!("../builtins/nat.axi"))).unwrap();
        for stmt in stmts {
            it.interpret_top(stmt).unwrap();
        }
        let stmts = stmts_all(lexer(include_str!("../builtins/bytes.axi"))).unwrap();
        for stmt in stmts {
            it.interpret_top(stmt).unwrap();
        }

        it
    }

    fn define(&mut self, i: String, d: Rc<Def>) {
        self.definitions.define(i, d);
    }

    pub fn define_external_procedure<M>(&mut self, name: impl Into<String>, m: M)
    where
        M: ExternalProc + 'static,
    {
        self.define(name.into(), Rc::new(Def::ExternalProc(Rc::new(m))))
    }

    /// Define an external evaluation hook for a function.
    ///
    /// # Panics
    ///
    /// If called not at the top level (i.e. at a depth greater than 0).
    pub fn define_external_eval<E>(&mut self, name: impl Into<String>, e: E)
    where
        E: ExternalEval + 'static,
    {
        assert_eq!(self.depth, 0);

        self.extern_function_eval
            .borrow_mut()
            .insert(name.into(), Box::new(e));
    }

    fn derive(&mut self, prop: Rc<Proposition>) {
        self.ab.insert(prop);
    }

    fn block(&self) -> Interpreter {
        Interpreter {
            ab: self.ab.clone(),
            definitions: self.definitions.clone(),
            extern_function_eval: self.extern_function_eval.clone(),
            depth: self.depth + 1,
            allow_assert: self.allow_assert,
            use_axiom_translator: self.use_axiom_translator,
            unifier: self.unifier.clone(),
            has_type_variables: self.has_type_variables,
        }
    }

    fn block_with_closure(&mut self, closure: DefTable) -> Interpreter {
        Interpreter {
            ab: self.ab.clone(),
            definitions: closure,
            extern_function_eval: self.extern_function_eval.clone(),
            unifier: self.unifier.clone(),
            depth: self.depth + 1,
            allow_assert: self.allow_assert,
            use_axiom_translator: self.use_axiom_translator,
            has_type_variables: self.has_type_variables,
        }
    }

    fn eval_context(&self) -> eval::Eval {
        eval::Eval {
            definitions: self.definitions.clone(),
            extern_function_eval: self.extern_function_eval.clone(),
        }
    }

    /// Evaluate a statement at the top level.
    ///
    /// You can define new types, constants and functions only at the top level.
    pub fn interpret_top(&mut self, stmt: Stmt) -> InterResult {
        match stmt {
            Stmt::Domain(d) => {
                if self.definitions.get_type(&d).is_some() {
                    bail!(d.loc, "the type is defined multiple times");
                }
                self.definitions.define_type(d.cloned(), TypeDef::Domain);
                Ok(InterResultInner::Nothing)
            }
            Stmt::Struct(struct_decl) => {
                let name = &struct_decl.name;
                if self.definitions.get_type(name).is_some() {
                    bail!(name.loc, "the type is defined multiple times");
                }
                // Check mk and duplicated fields.
                let mut fields = HashSet::new();
                for f in &struct_decl.fields {
                    if f.name.inner == "mk" {
                        bail!(
                            f.name.loc,
                            "the name mk is reserved for the struct constructor"
                        );
                    }
                    if !fields.insert(&*f.name.inner) {
                        bail!(f.name.loc, "duplicated field");
                    }
                    if self.definitions.get_type(&f.type_.name).is_none() {
                        bail!(f.type_.name.loc, "unknown type");
                    }
                }
                // Axiom: constructor is injective:
                {
                    let mut left = Vec::with_capacity(struct_decl.fields.len());
                    let mut right = Vec::with_capacity(struct_decl.fields.len());
                    for field in &struct_decl.fields {
                        let typ = Type::from(&field.type_);
                        left.push(Term::Var(next_var_id(), typ.clone()));
                        right.push(Term::Var(next_var_id(), typ));
                    }
                    let eqs = left
                        .iter()
                        .zip(&right)
                        .map(|(l, r)| Proposition::equal(l.clone(), r.clone()))
                        .reduce(|p1, p2| Proposition::And(p1.into(), p2.into()))
                        .unwrap();
                    let constructor = format!("{}.mk", struct_decl.name.inner);
                    let type_ = Type::new(struct_decl.name.cloned());
                    let left = Term::FunctionApp(constructor.clone(), left, type_.clone());
                    let right = Term::FunctionApp(constructor, right, type_);
                    let mut prop =
                        Proposition::If(Proposition::equal(left, right).into(), eqs.into());
                    prop = all_universal(prop);
                    self.derive(prop.into());
                }

                self.definitions
                    .define_type(name.cloned(), TypeDef::Struct(struct_decl));
                Ok(InterResultInner::Nothing)
            }
            Stmt::InductiveEnum(e) => {
                if self.definitions.get_type(&e.name).is_some() {
                    bail!(e.name.loc, "the type is defined multiple times");
                }
                self.definitions
                    .define_type(e.name.cloned(), TypeDef::InductiveEnum(e.clone()));
                for v in &e.variants {
                    if self
                        .definitions
                        .get(&v.name)
                        .is_some_and(|d| d.is_function_like())
                    {
                        bail!(v.name.loc, "the name is defined multiple times");
                    }
                    for f in &v.fields {
                        if self.definitions.get_type(&f.name).is_none() {
                            bail!(f.name.loc, "undefined type");
                        }
                    }
                    self.definitions.define_top(
                        v.name.cloned(),
                        Def::EnumVariant(v.clone(), e.name.cloned()).into(),
                    );
                }
                let type_ = Type::new(e.name.cloned());
                // The axioms:
                // Different variants are not equal.
                for i in 0..e.variants.len() - 1 {
                    for j in i + 1..e.variants.len() {
                        let (vi, vj) = (&*e.variants[i], &*e.variants[j]);
                        let to_term = |v: &EnumVariant| {
                            if v.fields.is_empty() {
                                Term::Constant(v.name.cloned(), type_.clone())
                            } else {
                                let mut vs = Vec::with_capacity(v.fields.len());
                                for field_type in &v.fields {
                                    vs.push(Term::Var(next_var_id(), field_type.into()));
                                }
                                Term::FunctionApp(v.name.cloned(), vs, type_.clone())
                            }
                        };
                        let mut prop =
                            Proposition::Not(Proposition::equal(to_term(vi), to_term(vj)).into());
                        prop = all_universal(prop);
                        self.derive(prop.into());
                    }
                }
                // Variants are injective.
                for v in &e.variants {
                    if !v.fields.is_empty() {
                        let mut left = Vec::with_capacity(v.fields.len());
                        let mut right = Vec::with_capacity(v.fields.len());
                        for field_type in &v.fields {
                            left.push(Term::Var(next_var_id(), field_type.into()));
                            right.push(Term::Var(next_var_id(), field_type.into()));
                        }
                        let eqs = left
                            .iter()
                            .zip(&right)
                            .map(|(l, r)| Proposition::equal(l.clone(), r.clone()))
                            .reduce(|p1, p2| Proposition::And(p1.into(), p2.into()))
                            .unwrap();
                        let left = Term::FunctionApp(v.name.cloned(), left, type_.clone());
                        let right = Term::FunctionApp(v.name.cloned(), right, type_.clone());
                        let mut prop =
                            Proposition::If(Proposition::equal(left, right).into(), eqs.into());
                        prop = all_universal(prop);
                        self.derive(prop.into());
                    }
                }
                // TODO(optional): all values are of some variant.
                // (Optional because it's also provable with induction.)
                Ok(InterResultInner::Nothing)
            }
            Stmt::FunctionDef(f) => {
                if self
                    .definitions
                    .get(&f.name)
                    .is_some_and(|d| d.is_function_like())
                {
                    bail!(f.name.loc, "the name is defined multiple times");
                }
                for (_, t) in &f.params {
                    if self.definitions.get_type(&t.name).is_none() {
                        bail!(t.name.loc, "undefined type");
                    }
                }
                self.definitions
                    .define_top(f.name.cloned(), Def::Function(f.clone()).into());
                if self.use_axiom_translator {
                    let axioms =
                        symbolic_evaluator::function_to_axioms(self.definitions.clone(), &f);
                    for a in axioms {
                        self.derive(a);
                    }
                }
                Ok(InterResultInner::Nothing)
            }
            Stmt::ConstDec(i, ref t) => {
                if self.definitions.get(&i).is_some() {
                    bail!(i.loc, "the name is already defined");
                }
                self.definitions.define_top(
                    i.cloned(),
                    Def::Term(Term::Constant(i.inner, t.into())).into(),
                );
                Ok(InterResultInner::Nothing)
            }
            s => self.interpret(s),
        }
    }

    pub fn interpret(&mut self, stmt: Stmt) -> InterResult {
        match stmt {
            Stmt::Expr(expr) => self.interpret_expr(expr),
            Stmt::ProcDef(i, params, body) => {
                let loc = body.loc;
                self.interpret(Stmt::LetBinding(
                    i,
                    Expr::Proc(params, body.into()).with_loc(loc),
                ))
            }
            Stmt::LetBinding(i, e) => {
                let loc = e.loc;
                let def = match self.interpret_expr(e)? {
                    InterResultInner::Proposition(p) => Def::Prop(p),
                    InterResultInner::Proved(p) => Def::Prop(p),
                    InterResultInner::Term(t) => Def::Term(t),
                    InterResultInner::Proc(c, ps, b) => Def::Proc(c, ps, b),
                    _ => bail!(loc, "invalid binding"),
                };
                self.define(i, def.into());
                Ok(InterResultInner::Nothing)
            }
            Stmt::PickWitness(vs, e) => {
                let loc = e.loc;
                let p = self.interpret_expr(e)?;
                let mut p = p.require_proposition(loc)?.inner;
                if !self.ab.contains(&p) {
                    bail!(loc, NOT_HOLD);
                }
                for v in vs {
                    let vi = next_var_id();
                    let term;
                    p = match &*p {
                        Proposition::Exists(tp, p) => {
                            term = Term::Var(vi, tp.clone());
                            subst(p, 0, &term).into()
                        }
                        _ => bail!(loc, "invalid proposition, expected exists"),
                    };
                    self.define(v, Def::Term(term).into());
                }
                self.proved(p)
            }
            Stmt::InductiveEnum(e) => {
                bail!(e.name.loc, "defining a new type is not allowed here")
            }
            Stmt::Struct(s) => {
                bail!(s.name.loc, "defining a new type is not allowed here")
            }
            Stmt::Domain(d) => {
                bail!(d.loc, "defining a new type is not allowed here")
            }
            Stmt::FunctionDef(f) => {
                bail!(f.name.loc, "defining a new function is not allowed here")
            }
            Stmt::ConstDec(n, _) => {
                bail!(n.loc, "defining a new constant is not allowed here")
            }
        }
    }

    pub fn interpret_expr(&mut self, expr: LocExpr) -> InterResult {
        let loc = expr.loc;
        match expr.inner {
            Expr::False => Ok(InterResultInner::Proposition(Proposition::False.into())),
            Expr::True => Ok(InterResultInner::Proposition(Proposition::True.into())),
            Expr::LitNat(_) | Expr::LitHex(_) | Expr::LitU8(_) => {
                Ok(InterResultInner::Term(parse_literal(&expr.inner, loc)?))
            }
            Expr::Proc(params, body) => Ok(InterResultInner::Proc(
                self.definitions.closure(),
                params,
                *body,
            )),
            Expr::Ident(i) => match self.definitions.get(&i) {
                Some(def) => match &*def {
                    Def::Prop(p) => Ok(InterResultInner::Proposition(p.clone())),
                    Def::BuiltinMethod => {
                        // TODO: should be allowed too.
                        bail!(loc, "invalid, is a builtin method")
                    }
                    Def::ExternalProc(_) => {
                        bail!(loc, "invalid, is an external method")
                    }
                    Def::Proc(c, ps, b) => {
                        Ok(InterResultInner::Proc(c.clone(), ps.clone(), b.clone()))
                    }
                    Def::EnumVariant(e, type_) => {
                        if e.fields.is_empty() {
                            Ok(InterResultInner::Term(Term::Constant(
                                e.name.cloned(),
                                Type::new(type_.clone()),
                            )))
                        } else {
                            bail!(loc, "invalid, is a enum variant")
                        }
                    }
                    Def::Function(..) | Def::BuiltInEq => {
                        bail!(loc, "invalid, is a function")
                    }
                    Def::Term(t) => Ok(InterResultInner::Term(t.clone())),
                },
                None => bail!(loc, "not defined"),
            },
            Expr::Assume { assumption, body } => {
                let assumption_loc = assumption.loc;
                let assumption = self
                    .interpret_expr(*assumption)?
                    .require_proposition(assumption_loc)?;
                let mut assume_block = self.block();
                assume_block.derive(assumption.cloned());
                let p = assume_block
                    .interpret_expr(Expr::Stmts(body).with_loc(loc))?
                    .require_proved(loc)?;
                let conclusion = Rc::new(Proposition::If(assumption.inner, p));
                drop(assume_block);
                self.proved(conclusion)
            }
            Expr::Stmts(stmts) => {
                let mut block = self.block();
                let mut last_result = InterResultInner::Nothing;
                for stmt in stmts {
                    last_result = block.interpret(stmt)?;
                }
                drop(block);
                match last_result {
                    InterResultInner::Proved(p) => self.proved(p),
                    r => Ok(r),
                }
            }
            Expr::StructExpr(sexpr) => {
                let struct_ = self
                    .definitions
                    .get_type(&sexpr.name)
                    .ok_or(error!(sexpr.name.loc, "unknown struct"))?;
                let struct_ = match &*struct_ {
                    TypeDef::Struct(s) => &**s,
                    _ => bail!(sexpr.name.loc, "not a struct"),
                };
                // Check all fields are covered with no duplicates.
                //
                // This maps field name to index in the struct expression.
                let mut field_map: HashMap<&str, Option<usize>> = struct_
                    .fields
                    .iter()
                    .map(|f| (&*f.name.inner, None))
                    .collect();
                for (i, (f, _)) in sexpr.fields.iter().enumerate() {
                    match field_map.get_mut(&*f.inner) {
                        Some(idx) => {
                            if idx.is_some() {
                                bail!(f.loc, "duplicated field");
                            } else {
                                *idx = Some(i);
                            }
                        }
                        None => {
                            bail!(f.loc, "unknown field");
                        }
                    }
                }
                if field_map.iter().any(|(_, idx)| idx.is_none()) {
                    bail!(loc, "some fields are not specified");
                }
                let mut values = Vec::with_capacity(sexpr.fields.len());
                for (_, e) in sexpr.fields {
                    let e_loc = e.loc;
                    values.push(self.interpret_expr(e)?.require_term(e_loc)?);
                }
                let mut sorted_values = Vec::with_capacity(struct_.fields.len());
                for f in &struct_.fields {
                    let i = field_map[&*f.name.inner].unwrap();
                    sorted_values.push(core::mem::replace(
                        &mut values[i],
                        Term::Var(u64::MAX, Type::boolean().clone()),
                    ));
                }
                Ok(InterResultInner::Term(Term::FunctionApp(
                    format!("{}.mk", struct_.name.inner),
                    sorted_values,
                    Type::new(struct_.name.cloned()),
                )))
            }
            Expr::FieldAccess(expr, field) => {
                let expr_loc = expr.loc;
                let term = self.interpret_expr(*expr)?.require_term(loc)?;
                let term_typ = self.unifier.borrow().reify_term(term.type_());
                if term_typ.is_var() {
                    bail!(
                        expr_loc,
                        "cannot infer the type of this expression at this point"
                    );
                }
                let typ = self.definitions.get_type(&term_typ.name).unwrap();
                let types = match &*typ {
                    TypeDef::Struct(s) => s.fields.iter().find_map(|f| {
                        if f.name.inner == field.inner {
                            Some((s, f.type_.name.cloned()))
                        } else {
                            None
                        }
                    }),
                    _ => None,
                };
                let Some((struct_type, field_type)) = types else {
                    bail!(field.loc, "unknown field");
                };
                Ok(InterResultInner::Term(Term::FunctionApp(
                    format!("{}.{}", struct_type.name.inner, field.inner),
                    vec![term],
                    Type::new(field_type),
                )))
            }
            Expr::PropApp(op, params) => {
                let (_, params) = self.interpret_params(params, loc)?;
                let p = match op {
                    PropOp::Not => Proposition::Not(params.one_proposition()?.inner),
                    PropOp::And => {
                        let (l, r) = params.two_propositions()?;
                        Proposition::And(l.inner, r.inner)
                    }
                    PropOp::Or => {
                        let (l, r) = params.two_propositions()?;
                        Proposition::Or(l.inner, r.inner)
                    }
                    PropOp::If => {
                        let (l, r) = params.two_propositions()?;
                        Proposition::If(l.inner, r.inner)
                    }
                    PropOp::Iff => {
                        let (l, r) = params.two_propositions()?;
                        Proposition::Iff(l.inner, r.inner)
                    }
                };
                Ok(InterResultInner::Proposition(p.into()))
            }
            Expr::MethodApp(method, params) => {
                let (loc_args, params) = self.interpret_params(params, loc)?;
                let def = self.definitions.get(&method);
                let (closure, formal_params, body) = match def.as_deref() {
                    Some(Def::Proc(scope, params, body)) => (scope, params, body),
                    Some(Def::BuiltinMethod) => {
                        return self.run_builtin_method(method, params, loc, loc_args)
                    }
                    Some(Def::ExternalProc(m)) => {
                        let r = m.run(self, params);
                        match r {
                            Ok(InterResultInner::Proved(p)) => {
                                return self.proved(p);
                            }
                            r => {
                                return r;
                            }
                        }
                    }
                    _ => bail!(loc, "method not defined"),
                };

                if formal_params.len() != params.inner.len() {
                    bail!(loc_args, "wrong number of arguments");
                }
                let mut method_block = self.block_with_closure(closure.clone());
                for (p, p1) in formal_params.iter().zip(params.inner) {
                    let def = match p1.inner {
                        InterResultInner::Proposition(p) => Def::Prop(p),
                        InterResultInner::Proved(p) => Def::Prop(p),
                        InterResultInner::Term(t) => Def::Term(t),
                        InterResultInner::Proc(c, ps, b) => Def::Proc(c, ps, b),
                        _ => bail!(p1.loc, "invalid parameter for procedure application"),
                    };
                    method_block.define(p.clone(), def.into());
                }
                let conclusion = method_block
                    .interpret_expr(body.clone())?
                    .require_proved(loc)?;
                drop(method_block);
                self.proved(conclusion)
            }
            Expr::App(fp, params) => {
                let def = self.definitions.get(&fp);
                if let Some(Def::Proc(closure, formal_params, body)) = def.as_deref() {
                    let (params_loc, params) = self.interpret_params(params, loc)?;
                    if formal_params.len() != params.inner.len() {
                        bail!(params_loc, "wrong number of arguments");
                    }
                    let mut proc_block = self.block_with_closure(closure.clone());
                    for (p, p1) in formal_params.iter().zip(params.inner) {
                        let d = match p1.inner {
                            InterResultInner::Nothing => {
                                bail!(p1.loc, "invalid parameter for procedure application")
                            }
                            InterResultInner::Proposition(p) | InterResultInner::Proved(p) => {
                                Def::Prop(p)
                            }
                            InterResultInner::Proc(c, ps, b) => Def::Proc(c, ps, b),
                            InterResultInner::Term(t) => Def::Term(t),
                        };
                        proc_block.define(p.clone(), d.into());
                    }
                    let result = proc_block.interpret_expr(body.clone())?;
                    drop(proc_block);
                    let result = match result {
                        InterResultInner::Proved(_) => {
                            bail!(loc, "invalid proc body, deduction")
                        }
                        r => r,
                    };
                    return Ok(result);
                }

                let (params_loc, params) = self.interpret_params(params, loc)?;
                if let Some(Def::ExternalProc(ep)) = def.as_deref() {
                    match ep.run(self, params) {
                        r @ Ok(InterResultInner::Term(_)) => return r,
                        r @ Ok(InterResultInner::Proposition(_)) => return r,
                        _ => bail!(loc, "unexpected return value from external procedure"),
                    }
                }
                let params = params.var_terms()?;
                fn type_check_params<'a>(
                    unifier: &mut UnifierSet<TypeVar, Type>,
                    params_loc: Loc,
                    params: Vec<WithLoc<Term>>,
                    expected_types: impl ExactSizeIterator<Item = &'a str>,
                ) -> Result<Vec<Term>, EvalError> {
                    if params.len() != expected_types.len() {
                        bail!(params_loc, "wrong number of parameters");
                    }
                    let mut result = Vec::with_capacity(params.len());
                    for (t, tp) in params.into_iter().zip(expected_types) {
                        if t.type_().var.is_some() {
                            match unifier.unify(t.type_(), &Type::new(tp.to_string())) {
                                None => bail!(t.loc, "failed to unify"),
                                Some(u) => *unifier = u,
                            }
                        } else if t.type_().name != tp {
                            bail!(t.loc, "wrong type for parameter");
                        }
                        result.push(t.inner);
                    }
                    Ok(result)
                }
                let (return_type, params) = match self.definitions.get(&fp).as_deref() {
                    Some(Def::Function(f)) => (
                        (&f.return_type).into(),
                        type_check_params(
                            &mut self.unifier.borrow_mut(),
                            params_loc,
                            params,
                            f.params.iter().map(|(_, t)| &**t.name),
                        )?,
                    ),
                    Some(Def::EnumVariant(e, t)) => (
                        Type::new(t.clone()),
                        type_check_params(
                            &mut self.unifier.borrow_mut(),
                            params_loc,
                            params,
                            e.fields.iter().map(|f| &**f.name),
                        )?,
                    ),
                    Some(Def::BuiltInEq) => (Type::boolean().clone(), {
                        // There must be two params by the syntax.
                        assert_eq!(params.len(), 2);
                        let mut unifier = self.unifier.borrow_mut();
                        match unifier.unify(params[0].type_(), params[1].type_()) {
                            Some(u) => *unifier = u,
                            None => {
                                bail!(params_loc, "the type of the parameters cannot be unified")
                            }
                        }
                        params.into_iter().map(|t| t.inner).collect()
                    }),
                    _ => bail!(loc, "not a function"),
                };
                Ok(InterResultInner::Term(Term::FunctionApp(
                    fp,
                    params,
                    return_type,
                )))
            }
            Expr::ForAll(vs, e) => self.interpret_quantified(*e, vs, Proposition::ForAll),
            Expr::Exists(vs, e) => self.interpret_quantified(*e, vs, Proposition::Exists),
            Expr::PickAny(vs, body) => {
                let mut block = self.block();
                let mut terms = Vec::with_capacity(vs.len());
                for (v, t) in &vs {
                    let term = Term::Var(next_var_id(), t.into());
                    block.define(v.clone(), Def::Term(term.clone()).into());
                    terms.push(term);
                }
                let mut p = block
                    .interpret_expr(Expr::Stmts(body).with_loc(loc))?
                    .require_proved(loc)?;
                drop(block);
                for term in terms.into_iter().rev() {
                    p = Proposition::ForAll(
                        term.type_().clone(),
                        de_bruijn(&p, 0, &term, &Default::default(), &mut false).into(),
                    )
                    .into();
                }
                self.proved(p)
            }
            // These are not supported in deductions yet.
            Expr::Match(..) | Expr::IfElse(..) => Ok(InterResultInner::Nothing),
            Expr::ByInduction(induction) => {
                let type_loc = induction.type_.name.loc;
                let type_ = self
                    .definitions
                    .get_type(&induction.type_.name)
                    .ok_or(error!(type_loc, "unknown type"))?;
                let TypeDef::InductiveEnum(type_) = &*type_ else {
                    bail!(type_loc, "invalid type for induction");
                };
                let type_ref = Type::from(&induction.type_);
                let goal = self
                    .interpret_quantified(
                        *induction.goal,
                        vec![(induction.var, Some(induction.type_))],
                        Proposition::ForAll,
                    )?
                    .require_proposition(loc)?
                    .inner;
                // Without forall.
                let naked_goal = match &*goal {
                    Proposition::ForAll(_, p) => p,
                    _ => unreachable!(),
                };
                struct VariantUsed {
                    used: bool,
                    variant: Rc<EnumVariant>,
                }
                let mut variants = {
                    let mut variants = HashMap::new();
                    for v in &type_.variants {
                        variants.insert(
                            &**v.name,
                            VariantUsed {
                                used: false,
                                variant: v.clone(),
                            },
                        );
                    }
                    variants
                };
                // TODO: proper error handling.
                for (pat, expr) in induction.cases {
                    match pat.inner {
                        Pattern::Identifier(i) => {
                            let v = variants.get_mut(&*i).unwrap();
                            if v.used {
                                bail!(pat.loc, "duplicated pattern for this enum variant");
                            }
                            v.used = true;
                            if !v.variant.fields.is_empty() {
                                bail!(pat.loc, "invalid pattern, no binding for fields");
                            }
                            let expected = subst(
                                naked_goal,
                                0,
                                &Term::Constant(v.variant.name.cloned(), type_ref.clone()),
                            );
                            let loc = expr.loc;
                            let conclusion =
                                self.block().interpret_expr(expr)?.require_proved(loc)?;
                            if *conclusion != expected {
                                bail!(loc, "the expected conclusion is not derived");
                            }
                        }
                        Pattern::TupleStruct(i, ps) => {
                            let v = variants.get_mut(&**i).unwrap();
                            if v.used {
                                bail!(pat.loc, "duplicated pattern for this enum variant");
                            }
                            v.used = true;
                            if v.variant.fields.len() != ps.len() {
                                bail!(pat.loc, "invalid pattern, wrong number of fields");
                            }

                            // Handle bindings and induction hypotheses.
                            let mut assume_block = self.block();
                            let mut vars = Vec::with_capacity(ps.len());

                            let mut previous_bindings = HashSet::new();
                            for (f, p) in v.variant.fields.iter().zip(ps.iter()) {
                                let var_term = Term::Var(next_var_id(), f.into());
                                vars.push(var_term.clone());
                                let var = match &**p {
                                    Pattern::Identifier(i) => i.as_str(),
                                    _ => bail!(p.loc, "nested patterns are not supported yet"),
                                };

                                if assume_block
                                    .definitions
                                    .get(var)
                                    .is_some_and(|d| d.is_enum_variant())
                                {
                                    bail!(p.loc, "invalid binding, is an enum variant");
                                }

                                if previous_bindings.contains(var) {
                                    bail!(p.loc, "duplicated binding");
                                }
                                previous_bindings.insert(var);

                                if f.name.inner == type_.name.inner {
                                    let hyp = subst(naked_goal, 0, &var_term);
                                    assume_block.derive(hyp.into());
                                }
                                assume_block.define(var.to_string(), Def::Term(var_term).into());
                            }
                            let expected = subst(
                                naked_goal,
                                0,
                                &Term::FunctionApp(v.variant.name.cloned(), vars, type_ref.clone()),
                            );
                            let loc = expr.loc;
                            let conclusion =
                                assume_block.interpret_expr(expr)?.require_proved(loc)?;
                            drop(assume_block);
                            if *conclusion != expected {
                                bail!(loc, "the expected conclusion is not derived");
                            }
                        }
                    }
                }
                for (_, v) in variants {
                    if !v.used {
                        bail!(loc, "Some variants not covered");
                    }
                }
                self.proved(goal)
            }
        }
    }

    fn run_builtin_method(
        &mut self,
        method: String,
        params: Params,
        loc: Loc,
        loc_args: Loc,
    ) -> Result<InterResultInner, EvalError> {
        match &*method {
            "assert" => {
                if !self.allow_assert {
                    bail!(loc, "assert is not allowed");
                }
                let p = params.one_proposition()?;
                self.proved(p.inner)
            }
            "claim" => {
                let p = params.one_proposition()?;
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                self.proved(p.inner)
            }
            "dn" => {
                let p = params.one_proposition()?;
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                let p = match **p {
                    Proposition::Not(ref p1) => match **p1 {
                        Proposition::Not(ref p2) => p2.clone(),
                        _ => bail!(p.loc, "proposition is not a double negation"),
                    },
                    _ => bail!(p.loc, "proposition is not a double negation"),
                };
                self.proved(p)
            }
            "both" => {
                let (l, r) = params.two_propositions()?;
                if !self.ab.contains(&l) {
                    bail!(l.loc, NOT_HOLD);
                }
                if !self.ab.contains(&r) {
                    bail!(r.loc, NOT_HOLD);
                }
                self.proved(Proposition::And(l.inner, r.inner))
            }
            "left_and" | "right_and" => {
                let p = params.one_proposition()?;
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                let p = match **p {
                    Proposition::And(ref l, ref r) => {
                        if method == "left_and" { l } else { r }.clone()
                    }
                    _ => bail!(p.loc, "not an and proposition"),
                };
                self.proved(p)
            }
            "left_either" | "right_either" => {
                let (l, r) = params.two_propositions()?;
                if method == "left_either" && !self.ab.contains(&l) {
                    bail!(l.loc, NOT_HOLD);
                }
                if method == "right_either" && !self.ab.contains(&r) {
                    bail!(r.loc, NOT_HOLD);
                }
                self.proved(Proposition::Or(l.inner, r.inner))
            }
            "absurd" => {
                let (l, r) = params.two_propositions()?;
                if !self.ab.contains(&l) {
                    bail!(l.loc, NOT_HOLD);
                }
                if !self.ab.contains(&r) {
                    bail!(r.loc, NOT_HOLD);
                }
                let ok = **r == Proposition::Not(l.cloned()) || **l == Proposition::Not(r.cloned());
                if !ok {
                    bail!(
                        loc_args,
                        "the propositions are not complements of each other"
                    );
                }
                self.proved(Proposition::False)
            }
            "mp" => {
                let p = params.one_proposition()?;
                let (l, r) = match &**p {
                    Proposition::If(l, r) => (l, r),
                    _ => bail!(p.loc, "proposition is not an implication"),
                };
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                if !self.ab.contains(l) {
                    bail!(p.loc, "the antecedent does not hold");
                }
                self.proved(r.clone())
            }
            "mt" => {
                let p = params.one_proposition()?;
                let (l, r) = match &**p {
                    Proposition::If(l, r) => (l, r),
                    _ => bail!(p.loc, "proposition is not an implication"),
                };
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                if !self.ab.contains(&Proposition::Not(r.clone())) {
                    bail!(p.loc, "the negation of the consequent does not hold");
                }
                let p = Proposition::Not(l.clone());
                self.proved(p)
            }
            "left_iff" | "right_iff" => {
                let p = params.one_proposition()?;
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                let p = match &**p {
                    Proposition::Iff(l, r) => Rc::new(if method == "left_iff" {
                        Proposition::If(l.clone(), r.clone())
                    } else {
                        Proposition::If(r.clone(), l.clone())
                    }),
                    _ => bail!(p.loc, "the proposition is not an equivalence"),
                };
                self.proved(p)
            }
            "equiv" => {
                let (l, r) = params.two_propositions()?;
                let (l, r) = (l.inner, r.inner);
                let ok = self.ab.contains(&Proposition::If(l.clone(), r.clone()))
                    && self.ab.contains(&Proposition::If(r.clone(), l.clone()));
                if !ok {
                    bail!(loc_args, "equivalence does not hold");
                }
                self.proved(Proposition::Iff(l, r))
            }
            "cd" => {
                let (l, r) = params.two_propositions()?;
                let (a, b, c, d) = match (&**l, &**r) {
                    (Proposition::If(a, b), Proposition::If(c, d)) => (a, b, c, d),
                    (Proposition::If(_, _), _) => {
                        bail!(r.loc, "proposition is not an implication")
                    }
                    _ => bail!(l.loc, "proposition is not an implication"),
                };
                if b != d {
                    bail!(loc_args, "consequents are different");
                }
                let ok = self.ab.contains(&l)
                    && self.ab.contains(&r)
                    && self.ab.contains(&Proposition::Or(a.clone(), c.clone()));
                if !ok {
                    bail!(loc_args, NOT_HOLD);
                }
                self.proved(b.clone())
            }
            "false_elim" => {
                if !params.is_empty() {
                    bail!(loc_args, "no arguments expected");
                }
                self.proved(Proposition::Not(Proposition::False.into()))
            }
            "true_intro" => {
                if !params.is_empty() {
                    bail!(loc_args, "no arguments expected");
                }
                self.proved(Proposition::True)
            }
            "uspec" => {
                let (p, t) = params.proposition_and_term()?;
                if !self.ab.contains(&p) {
                    bail!(p.loc, NOT_HOLD);
                }
                let p = match &**p {
                    Proposition::ForAll(tp, p) => {
                        if tp != t.type_() {
                            bail!(loc, "wrong type of term");
                        }
                        Rc::new(subst(p, 0, &t))
                    }
                    _ => bail!(p.loc, "invalid proposition, expected forall"),
                };
                self.proved(p)
            }
            "egen" => {
                let (pe, t) = params.proposition_and_term()?;
                let p = match &**pe {
                    Proposition::Exists(_, p) => subst(p, 0, &t),
                    _ => bail!(pe.loc, "invalid proposition, expected exists"),
                };
                if !self.ab.contains(&p) {
                    bail!(loc_args, NOT_HOLD);
                }
                self.proved(pe.inner)
            }
            "reflex" => {
                let t: Term = params.one_term()?;
                self.proved(Proposition::equal(t.clone(), t))
            }
            "fcong" => {
                let (l, r) = params.two_terms()?;
                let (lf, lts) = match &*l {
                    Term::FunctionApp(lf, lts, _) => (lf, lts),
                    _ => bail!(l.loc, "not a term of function application"),
                };
                let (rf, rts) = match &*r {
                    Term::FunctionApp(rf, rts, _) => (rf, rts),
                    _ => bail!(r.loc, "not a term of function application"),
                };
                if lf != rf {
                    bail!(l.loc.till(r.loc), "not the same function");
                }
                if lts.len() != rts.len() {
                    bail!(l.loc.till(r.loc), "not same number of arguments");
                }
                for (lt, rt) in lts.iter().zip(rts) {
                    if lt == rt {
                        continue;
                    }
                    if self
                        .ab
                        .contains(&Proposition::equal(lt.clone(), rt.clone()))
                    {
                        continue;
                    }
                    bail!(l.loc.till(r.loc), "the arguments are not proved equal");
                }
                self.proved(Proposition::equal(l.inner, r.inner))
            }
            "rcong" => {
                let (l, r) = params.two_propositions()?;
                if !self.ab.contains(&l) {
                    bail!(l.loc, NOT_HOLD);
                }
                let (lp, lts) = match &**l {
                    Proposition::Term(Term::FunctionApp(l, lts, _)) => (l, lts),
                    _ => bail!(l.loc, "not an predicate"),
                };
                let (rp, rts) = match &**r {
                    Proposition::Term(Term::FunctionApp(r, rts, _)) => (r, rts),
                    _ => bail!(r.loc, "not an predicate"),
                };
                if lp != rp {
                    bail!(l.loc.till(r.loc), "not the same predicate");
                }
                if lts.len() != rts.len() {
                    bail!(l.loc.till(r.loc), "not same number of arguments");
                }
                for (lt, rt) in lts.iter().zip(rts) {
                    if lt == rt {
                        continue;
                    }
                    if self
                        .ab
                        .contains(&Proposition::equal(lt.clone(), rt.clone()))
                    {
                        continue;
                    }
                    bail!(l.loc.till(r.loc), "the arguments are not proved equal");
                }
                self.proved(r.inner)
            }
            "eq_chain" => {
                let terms = params.var_terms()?;
                if terms.len() < 2 {
                    bail!(loc_args, "wrong number of args, expected at least 2");
                }
                for window in terms.windows(2) {
                    let [l, r] = window else { unreachable!() };
                    if !self.term_equal(l, r) {
                        bail!(l.loc.till(r.loc), "terms are not proved equal");
                    }
                }
                self.proved(Rc::new(Proposition::equal(
                    terms[0].cloned(),
                    terms[terms.len() - 1].cloned(),
                )))
            }
            "prove_by_eval_term" => {
                let t = params.one_term()?;
                let result = self
                    .eval_context()
                    .eval(&t)
                    .map_err(|e| error!(loc_args, e))?;
                self.proved(Proposition::equal(t, result))
            }
            "prove_by_eval" => {
                let prop = params.one_proposition()?;
                self.prove_by_eval(prop)
            }
            _ => unreachable!(),
        }
    }

    fn prove_by_eval(&mut self, p: WithLoc<Rc<Proposition>>) -> InterResult {
        match &**p {
            Proposition::Term(t @ Term::FunctionApp(..)) => {
                let t = self.eval_context().eval(t).map_err(|e| error!(p.loc, e))?;
                if t.is_true() {
                    self.proved(p.inner)
                } else {
                    bail!(p.loc, "prove_by_eval failed because the result is not true")
                }
            }
            Proposition::Not(p1) => match &**p1 {
                Proposition::Term(t @ Term::FunctionApp(..)) => {
                    let t = self.eval_context().eval(t).map_err(|e| error!(p.loc, e))?;
                    if t.is_false() {
                        self.proved(p.inner)
                    } else {
                        bail!(p.loc, "prove_by_eval failed because the result is not true")
                    }
                }
                _ => bail!(p.loc, "cannot prove this proposition with prove_by_eval"),
            },
            _ => bail!(p.loc, "cannot prove this proposition with prove_by_eval"),
        }
    }

    fn proved(&mut self, p: impl Into<Rc<Proposition>>) -> InterResult {
        let p = p.into();
        self.derive(p.clone());
        Ok(InterResultInner::Proved(p))
    }

    fn interpret_params(
        &mut self,
        params: Vec<LocExpr>,
        loc: Loc,
    ) -> Result<(Loc, Params), EvalError> {
        let mut params1 = Vec::with_capacity(params.len());
        for p in params {
            let loc = p.loc;
            params1.push(self.interpret_expr(p)?.with_loc(loc));
        }
        let loc_args = if params1.is_empty() {
            loc
        } else {
            params1[0].loc.till(params1.last().unwrap().loc)
        };
        let params1 = Params {
            inner: params1.into_iter(),
            loc_args,
        };
        Ok((loc_args, params1))
    }

    fn interpret_quantified(
        &mut self,
        e: LocExpr,
        vs: Vec<(String, Option<axi_ast::TypeReference>)>,
        f: fn(Type, Rc<Proposition>) -> Proposition,
    ) -> Result<InterResultInner, EvalError> {
        let loc = e.loc;
        let unifier = self.unifier.clone();
        let is_top = !self.has_type_variables;
        // Clean up unifier when the top level expression that contains
        // quantified variables of unknown types is fully evaluated.
        defer! {
            if is_top {
                *unifier.borrow_mut() = Default::default();
            }
        }
        let mut block = self.block();
        block.has_type_variables = true;
        let mut terms = Vec::with_capacity(vs.len());
        for (v, t) in vs {
            let t = match t {
                Some(t) => Type::from(&t),
                None => Type::new_var(TypeVar(next_var_id())),
            };
            let term = Term::Var(next_var_id(), t);
            block.define(v, Def::Term(term.clone()).into());
            terms.push(term);
        }
        let mut p = block.interpret_expr(e)?.require_proposition(loc)?.inner;
        drop(block);
        let mut has_remaining_type_variables = false;
        for vi in terms.into_iter().rev() {
            let unifier = self.unifier.borrow();
            let actual_type = unifier.reify_term(vi.type_());
            if actual_type.is_var() {
                has_remaining_type_variables = true;
            }
            let inner = de_bruijn(&p, 0, &vi, &unifier, &mut has_remaining_type_variables);
            p = f(actual_type, inner.into()).into();
        }
        if is_top && has_remaining_type_variables {
            bail!(loc, "type of some variables cannot be inferred");
        }
        Ok(InterResultInner::Proposition(p))
    }

    fn term_equal(&self, lt: &Term, rt: &Term) -> bool {
        lt == rt
            || self
                .ab
                .contains(&Proposition::equal(lt.clone(), rt.clone()))
            || self
                .ab
                .contains(&Proposition::equal(rt.clone(), lt.clone()))
            || match (lt, rt) {
                (Term::FunctionApp(fl, lts, _), Term::FunctionApp(fr, rts, _)) => {
                    fl == fr
                        && lts.len() == rts.len()
                        && lts.iter().zip(rts).all(|(lt, rt)| self.term_equal(lt, rt))
                }
                _ => false,
            }
            || try_evalate_field_of_mk(&self.definitions, lt)
                .is_some_and(|lt| self.term_equal(lt, rt))
            || try_evalate_field_of_mk(&self.definitions, rt)
                .is_some_and(|rt| self.term_equal(rt, lt))
    }
}

type LocProposition = WithLoc<Rc<Proposition>>;
type LocTerm = WithLoc<Term>;

impl InterResultInner {
    fn require_proved(self, loc: Loc) -> Result<Rc<Proposition>, EvalError> {
        match self {
            InterResultInner::Proved(p) => Ok(p),
            _ => bail!(loc, "invalid, expected a proved proposition"),
        }
    }

    fn require_proposition(self, loc: Loc) -> Result<LocProposition, EvalError> {
        match self {
            InterResultInner::Proposition(p) => Ok(p.with_loc(loc)),
            InterResultInner::Proved(p) => Ok(p.with_loc(loc)),
            InterResultInner::Term(t) if t.type_().is_boolean() => {
                Ok(Rc::new(Proposition::Term(t)).with_loc(loc))
            }
            _ => bail!(loc, "invalid, expected a proposition"),
        }
    }

    fn require_term(self, loc: Loc) -> Result<Term, EvalError> {
        match self {
            InterResultInner::Term(t) => Ok(t),
            _ => bail!(loc, "invalid, expected a term"),
        }
    }
}

pub struct Params {
    inner: std::vec::IntoIter<WithLoc<InterResultInner>>,
    loc_args: Loc,
}

impl IntoIterator for Params {
    type IntoIter = std::vec::IntoIter<WithLoc<InterResultInner>>;
    type Item = WithLoc<InterResultInner>;

    fn into_iter(self) -> Self::IntoIter {
        self.inner
    }
}

impl Params {
    #[allow(clippy::wrong_self_convention)]
    pub fn is_empty(mut self) -> bool {
        self.inner.next().is_none()
    }

    pub fn loc(&self) -> Loc {
        self.loc_args
    }

    pub fn proposition_and_term(mut self) -> Result<(LocProposition, Term), EvalError> {
        if self.inner.len() != 2 {
            bail!(self.loc_args, "wrong number of arguments, expected two");
        }
        let l = self.inner.next().unwrap();
        let l = l.inner.require_proposition(l.loc)?;
        let r = self.inner.next().unwrap();
        let r = r.inner.require_term(r.loc)?;
        Ok((l, r))
    }

    pub fn one_proposition(mut self) -> Result<LocProposition, EvalError> {
        if self.inner.len() != 1 {
            bail!(self.loc_args, "wrong number of arguments, expected one");
        }
        let r = self.inner.next().unwrap();
        r.inner.require_proposition(r.loc)
    }

    pub fn two_propositions(mut self) -> Result<(LocProposition, LocProposition), EvalError> {
        if self.inner.len() != 2 {
            bail!(self.loc_args, "wrong number of arguments, expected two");
        }
        let l = self.inner.next().unwrap();
        let l = l.inner.require_proposition(l.loc)?;
        let r = self.inner.next().unwrap();
        let r = r.inner.require_proposition(r.loc)?;
        Ok((l, r))
    }

    pub fn one_term(mut self) -> Result<Term, EvalError> {
        if self.inner.len() != 1 {
            bail!(self.loc_args, "wrong number of arguments, expected one");
        }
        let t = self.inner.next().unwrap();
        t.inner.require_term(t.loc)
    }

    pub fn two_terms(mut self) -> Result<(LocTerm, LocTerm), EvalError> {
        if self.inner.len() != 2 {
            bail!(self.loc_args, "wrong number of arguments, expected two");
        }
        let l = self.inner.next().unwrap();
        let l = l.inner.require_term(l.loc)?.with_loc(l.loc);
        let r = self.inner.next().unwrap();
        let r = r.inner.require_term(r.loc)?.with_loc(r.loc);
        Ok((l, r))
    }

    pub fn var_terms(self) -> Result<Vec<LocTerm>, EvalError> {
        let mut terms = Vec::with_capacity(self.inner.len());
        for r in self.inner {
            terms.push(r.inner.require_term(r.loc)?.with_loc(r.loc));
        }
        Ok(terms)
    }
}

fn next_var_id() -> u64 {
    static VAR_ID: AtomicU64 = AtomicU64::new(1);
    VAR_ID.fetch_add(1, Ordering::Relaxed)
}

const NOT_HOLD: &str = "proposition does not hold";

fn parse_literal(expr: &Expr, loc: Loc) -> Result<Term, EvalError> {
    match expr {
        Expr::LitHex(h) => hex::decode(&h[2..])
            .map(Term::BuiltinBytes)
            .map_err(|_| error!(loc, "failed to parse hex bytes")),
        Expr::LitNat(n) => n
            .parse()
            .map(Term::BuiltinNat)
            .map_err(|_| error!(loc, "failed to parse natural number")),
        Expr::LitU8(u) => {
            let u = u
                .strip_suffix("u8")
                .ok_or_else(|| error!(loc, "missing u8 suffix"))?;
            let u = u.strip_suffix('_').unwrap_or(u);
            u.parse()
                .map(Term::BuiltinU8)
                .map_err(|_| error!(loc, "failed to parse u8 literal"))
        }
        _ => Err(error!(loc, "not a literal")),
    }
}

fn as_boolean_term(b: bool) -> Term {
    Term::Constant(
        if b { "true" } else { "false" }.into(),
        Type::boolean().clone(),
    )
}

// If term is Foo { x: tx, ... }.x, then return Some(tx), else return None.
fn try_evalate_field_of_mk<'t>(defs: &DefTable, term: &'t Term) -> Option<&'t Term> {
    match term {
        Term::FunctionApp(lf, lts, _) => {
            if lf.contains('.') && !lf.ends_with(".mk") {
                let field = lf.split('.').last().unwrap();
                match &lts[0] {
                    Term::FunctionApp(lts0f, lts0ts, struct_typ) => {
                        if lts0f.ends_with(".mk") {
                            let struct_typ = defs.get_type(&struct_typ.name).unwrap();
                            let struct_typ = match &*struct_typ {
                                TypeDef::Struct(s) => s,
                                _ => unreachable!(),
                            };
                            let idx = struct_typ
                                .fields
                                .iter()
                                .position(|f| f.name.inner == field)
                                .unwrap();
                            Some(&lts0ts[idx])
                        } else {
                            None
                        }
                    }
                    _ => None,
                }
            } else {
                None
            }
        }
        _ => None,
    }
}
