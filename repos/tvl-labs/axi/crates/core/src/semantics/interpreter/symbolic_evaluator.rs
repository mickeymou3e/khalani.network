use std::rc::Rc;

use axi_ast::{Expr, FunctionDef, LocPattern, MatchExpr, Pattern, PropOp, Stmt};
use rpds::{HashTrieMap, Vector};

use crate::{
    context::{Def, DefTable},
    interpreter::next_var_id,
    proposition::*,
};

pub fn function_to_axioms(definitions: DefTable, f: &FunctionDef) -> Vec<Rc<Proposition>> {
    SymbolicEvaluator {
        definitions,
        params: None,
        substs: Default::default(),
        conditions: Default::default(),
    }
    .function_to_axioms(f)
}

struct SymbolicEvaluator {
    definitions: DefTable,
    params: Option<Rc<Vec<Term>>>,
    // When we follow match arms, we will record the substitutions. E.g. in
    //
    // function f(x, ...) {
    //     match x {
    //         Succ(x1) => match x1 {
    //             Succ(x2) => g(..., x1, ..)
    //
    // We will have
    //
    // x -> Succ(x1)
    // x1 -> Succ(x2)
    //
    // And when generating the terms for the axiom, we will apply these
    // substitutions, so we will have an axiom like
    //
    // f(Succ(Succ(x2)), ...) = g(..., Succ(x2), ...)
    substs: HashTrieMap<Term, Term>,
    // When we see a condition we add it to conditions. When we generate the
    // axiom all the conditions are added (and all the variables in these
    // conditions are substituted).
    conditions: Vector<Proposition>,
}

impl SymbolicEvaluator {
    fn define(&mut self, i: String, d: Rc<Def>) {
        self.definitions.define(i, d);
    }

    fn subst(&mut self, a: Term, b: Term) {
        self.substs.insert_mut(a, b);
    }

    fn block(&self) -> Self {
        Self {
            definitions: self.definitions.clone(),
            params: self.params.clone(),
            substs: self.substs.clone(),
            conditions: self.conditions.clone(),
        }
    }
}

impl SymbolicEvaluator {
    // TODO: This only works when the match arms are not overlapping (and ...)
    fn function_to_axioms(&mut self, f: &FunctionDef) -> Vec<Rc<Proposition>> {
        let Some(body) = &f.body else {
            return Vec::new();
        };

        let mut params = Vec::with_capacity(f.params.len());
        for (p, t) in &f.params {
            let t = Term::Var(next_var_id(), t.into());
            self.define(p.clone(), Def::Term(t.clone()).into());
            params.push(t);
        }
        self.params = Some(params.into());
        if body.len() != 1 {
            return Vec::new();
        }
        let mut axioms = Vec::new();
        match &body[0] {
            Stmt::Expr(e) => {
                self.function_to_axioms_for_expr(&mut axioms, f, e);
            }
            _ => todo!(),
        }
        axioms
    }

    fn function_to_axioms_for_expr(
        &mut self,
        axioms: &mut Vec<Rc<Proposition>>,
        f: &FunctionDef,
        expr: &Expr,
    ) {
        match expr {
            e @ Expr::App(_, _)
            | e @ Expr::Ident(_)
            | e @ Expr::PropApp(_, _)
            | e @ Expr::True
            | e @ Expr::False
            | e @ Expr::LitNat(..)
            | e @ Expr::LitHex(..)
            | e @ Expr::LitU8(..) => {
                let lterm_ps = self.current_params();
                let mut p = if &**f.return_type.name == "Boolean" {
                    let lprop = Proposition::Term(Term::FunctionApp(
                        f.name.cloned(),
                        lterm_ps,
                        Type::boolean().clone(),
                    ));
                    let rprop: Proposition = self.function_to_axioms_expr_to_prop(e);
                    match rprop {
                        Proposition::False => Proposition::Not(lprop.into()),
                        Proposition::True => lprop,
                        _ => Proposition::Iff(lprop.into(), rprop.into()),
                    }
                } else {
                    let lterm =
                        Term::FunctionApp(f.name.cloned(), lterm_ps, (&f.return_type).into());
                    let rterm = &self.function_to_axioms_expr_to_term(e);
                    let rterm = self.subst_term(rterm);
                    Proposition::equal(lterm, rterm)
                };
                for c in self.conditions.clone().iter().rev() {
                    p = Proposition::If(self.subst_prop(c).into(), p.into());
                }
                let p = all_universal(p);
                axioms.push(p.into());
            }
            Expr::Match(MatchExpr {
                scrutinee,
                match_arms,
            }) => {
                for (pattern, expr) in match_arms {
                    // Set scrutinee to pattern and go on with expr.
                    match &***scrutinee {
                        Expr::Ident(i) => {
                            let def = self.definitions.get(i);
                            let orig = match def.as_deref() {
                                Some(Def::Term(t)) => t,
                                _ => todo!(),
                            };
                            let mut b = self.block();
                            let pt = b.pattern_to_term(pattern, orig.type_());
                            b.subst(orig.clone(), pt);
                            b.function_to_axioms_for_expr(axioms, f, expr);
                        }
                        _ => todo!(),
                    }
                }
            }
            Expr::Stmts(stmts) => {
                assert_eq!(stmts.len(), 1);
                match &stmts[0] {
                    Stmt::Expr(e) => {
                        self.function_to_axioms_for_expr(axioms, f, e);
                    }
                    _ => todo!(),
                }
            }
            Expr::IfElse(if_else) => {
                let condition = self.function_to_axioms_expr_to_prop(&if_else.condition);
                {
                    let mut true_block = self.block();
                    true_block.conditions.push_back_mut(condition.clone());
                    let true_expr = stmts_as_expr(&if_else.true_branch);
                    true_block.function_to_axioms_for_expr(axioms, f, true_expr);
                }
                {
                    let mut false_block = self.block();
                    false_block
                        .conditions
                        .push_back_mut(Proposition::Not(condition.into()));
                    let false_expr = stmts_as_expr(&if_else.false_branch);
                    false_block.function_to_axioms_for_expr(axioms, f, false_expr);
                }
            }
            _ => todo!(),
        }
    }

    fn function_to_axioms_expr_to_term(&mut self, expr: &Expr) -> Term {
        match expr {
            Expr::Ident(i) => {
                let def = self.definitions.get(i).unwrap();
                match &*def {
                    Def::EnumVariant(e, type_) if e.fields.is_empty() => {
                        Term::Constant(i.into(), Type::new(type_.clone()))
                    }
                    Def::Term(t) => t.clone(),
                    _ => todo!(),
                }
            }
            Expr::App(f, ps) => {
                let return_type = match &*self.definitions.get(f).unwrap() {
                    Def::Function(f) => (&f.return_type).into(),
                    Def::EnumVariant(_, t) => Type::new(t.clone()),
                    _ => todo!(),
                };
                let ps = ps
                    .iter()
                    .map(|p| self.function_to_axioms_expr_to_term(p))
                    .collect();
                Term::FunctionApp(f.clone(), ps, return_type)
            }
            Expr::LitHex(h) => Term::BuiltinBytes(hex::decode(&h[2..]).unwrap()),
            Expr::LitNat(n) => Term::BuiltinNat(n.parse().unwrap()),
            Expr::LitU8(u) => Term::BuiltinU8(
                {
                    let u = u.strip_suffix("u8").unwrap();
                    u.strip_suffix('_').unwrap_or(u)
                }
                .parse()
                .unwrap(),
            ),
            _ => todo!(),
        }
    }

    fn function_to_axioms_expr_to_prop(&mut self, expr: &Expr) -> Proposition {
        match expr {
            Expr::True => Proposition::True,
            Expr::False => Proposition::False,
            Expr::PropApp(prop_op, ps) => {
                let mut ps1 = Vec::with_capacity(ps.len());
                for p in ps {
                    ps1.push(self.function_to_axioms_expr_to_prop(p));
                }
                let mut ps1 = ps1.into_iter();
                match prop_op {
                    PropOp::Not => Proposition::Not(ps1.next().unwrap().into()),
                    PropOp::And => {
                        Proposition::And(ps1.next().unwrap().into(), ps1.next().unwrap().into())
                    }
                    PropOp::Or => {
                        Proposition::Or(ps1.next().unwrap().into(), ps1.next().unwrap().into())
                    }
                    PropOp::If => {
                        Proposition::If(ps1.next().unwrap().into(), ps1.next().unwrap().into())
                    }
                    PropOp::Iff => {
                        Proposition::Iff(ps1.next().unwrap().into(), ps1.next().unwrap().into())
                    }
                }
            }
            Expr::App(f, ps) => {
                let is_boolean_func = f == "="
                    || matches!(&*self.definitions.get(f).unwrap(),
                        Def::Function(f) if &**f.return_type.name == "Boolean");
                assert!(is_boolean_func);
                let ps = ps
                    .iter()
                    .map(|p| {
                        let t = self.function_to_axioms_expr_to_term(p);
                        self.subst_term(&t)
                    })
                    .collect();
                Proposition::Term(Term::FunctionApp(f.clone(), ps, Type::boolean().clone()))
            }
            _ => todo!(),
        }
    }

    fn pattern_to_term(&mut self, pat: &LocPattern, type_: &Type) -> Term {
        match &**pat {
            Pattern::TupleStruct(f, ps) => {
                let def = self.definitions.get(f);
                let (variant, type_) = match def.as_deref() {
                    Some(Def::EnumVariant(e, t)) => (e, t),
                    _ => todo!(),
                };
                let mut ts = Vec::with_capacity(ps.len());
                assert_eq!(ps.len(), variant.fields.len());
                for (p, t) in ps.iter().zip(&variant.fields) {
                    ts.push(self.pattern_to_term(p, &t.into()));
                }
                Term::FunctionApp(f.cloned(), ts, Type::new(type_.clone()))
            }
            Pattern::Identifier(i) => {
                let def = self.definitions.get(i);
                match def.as_deref() {
                    Some(Def::EnumVariant(_, t)) => Term::Constant(i.clone(), Type::new(t.clone())),
                    _ => {
                        let t = Term::Var(next_var_id(), type_.clone());
                        self.define(i.clone(), Def::Term(t.clone()).into());
                        t
                    }
                }
            }
        }
    }

    fn current_params(&mut self) -> Vec<Term> {
        self.params
            .clone()
            .unwrap()
            .iter()
            .map(|p| self.subst_term(p))
            .collect()
    }

    fn subst_prop(&mut self, p: &Proposition) -> Proposition {
        let mut f = |p| Rc::new(self.subst_prop(p));
        use Proposition::*;
        match p {
            Not(p) => Not(f(p)),
            And(p, q) => And(f(p), f(q)),
            Or(p, q) => Or(f(p), f(q)),
            If(p, q) => If(f(p), f(q)),
            Iff(p, q) => Iff(f(p), f(q)),
            Term(t) => Term(self.subst_term(t)),
            p => p.clone(),
        }
    }

    fn subst_term(&mut self, t: &Term) -> Term {
        match self.substs.get(t).cloned() {
            Some(p) => self.subst_term(&p),
            None => match t {
                Term::FunctionApp(f, ts, tp) => Term::FunctionApp(
                    f.clone(),
                    ts.iter().map(|p| self.subst_term(p)).collect(),
                    tp.clone(),
                ),
                _ => t.clone(),
            },
        }
    }
}

fn stmts_as_expr(stmts: &[Stmt]) -> &Expr {
    assert_eq!(stmts.len(), 1);
    match &stmts[0] {
        Stmt::Expr(e) => e,
        _ => todo!("unsupported statement"),
    }
}

#[test]
fn test_subst_param() {
    let typ = Type::nat().clone();
    let var = |v| Term::Var(v, typ.clone());
    let succ = |t| Term::FunctionApp("Succ".into(), vec![t], typ.clone());
    let mut e0 = SymbolicEvaluator {
        definitions: DefTable::with_builtins(),
        params: Some(vec![var(3), var(4)].into()),
        substs: Default::default(),
        conditions: Default::default(),
    };
    let mut e = e0.block();

    e.subst(var(4), succ(var(5)));
    e.subst(var(5), succ(var(6)));

    assert_eq!(e.current_params(), vec![var(3), succ(succ(var(6)))]);
    drop(e);
    assert_eq!(e0.current_params(), vec![var(3), var(4)]);
}
