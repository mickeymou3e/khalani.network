use std::{borrow::Cow, cell::RefCell, collections::HashMap, rc::Rc};

use axi_ast::{Expr, FunctionDef, Pattern, PropOp, Stmt, WithLoc};
use num_bigint::BigUint;

use super::{as_boolean_term, parse_literal, try_evalate_field_of_mk};
use crate::{
    context::{Def, DefTable, ExternalEval},
    proposition::{Term, Type},
};

/// Term evaluation context.
#[derive(Clone)]
pub struct Eval {
    pub(super) definitions: DefTable,
    pub(super) extern_function_eval: Rc<RefCell<HashMap<String, Box<dyn ExternalEval>>>>,
}

impl Eval {
    /// Evaluate a term to normal form.
    pub fn eval(&mut self, t: &Term) -> Result<Term, Cow<'static, str>> {
        match t {
            Term::BuiltinNat(_) | Term::BuiltinBytes(_) | Term::BuiltinU8(_) => Ok(t.clone()),
            Term::FunctionApp(f, ts, typ) => {
                let ts: Vec<Term> = ts.iter().map(|t| self.eval(t)).collect::<Result<_, _>>()?;
                if f.ends_with(".mk") {
                    // Constructor.
                    return Ok(Term::FunctionApp(f.clone(), ts, typ.clone()));
                } else if f.contains('.') {
                    // Field access.
                    let t = Term::FunctionApp(f.clone(), ts, typ.clone());
                    return Ok(try_evalate_field_of_mk(&self.definitions, &t)
                        .cloned()
                        .unwrap_or(t));
                }
                Ok(match &**f {
                    "Succ" => {
                        let [Term::BuiltinNat(ref x)] = &ts[..] else {
                            return Err("wrong arguments for function Succ".into());
                        };
                        Term::BuiltinNat(x + 1_u32)
                    }
                    "add" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function add".into());
                        };
                        Term::BuiltinNat(a + b)
                    }
                    "sub" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function sub".into());
                        };
                        Term::BuiltinNat(if a >= b {
                            a - b
                        } else {
                            // This is how it is defined.
                            BigUint::ZERO
                        })
                    }
                    "mul" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function mul".into());
                        };
                        Term::BuiltinNat(a * b)
                    }
                    "div" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function div".into());
                        };
                        Term::BuiltinNat(if *b != BigUint::ZERO {
                            a / b
                        } else {
                            // This is how it is defined.
                            BigUint::ZERO
                        })
                    }
                    "BytesCons" => {
                        let [Term::BuiltinU8(ref b), Term::BuiltinBytes(ref bs)] = &ts[..] else {
                            return Err("wrong arguments for function BytesCons".into());
                        };
                        Term::BuiltinBytes([*b].into_iter().chain(bs.iter().cloned()).collect())
                    }
                    "bytes_len" => {
                        let [Term::BuiltinBytes(ref bs)] = &ts[..] else {
                            return Err("wrong arguments for function bytes_len".into());
                        };
                        Term::BuiltinNat(bs.len().into())
                    }
                    "=" => {
                        let [a, b] = &ts[..] else {
                            return Err("wrong number of arguments for =".into());
                        };
                        as_boolean_term(a == b)
                    }
                    "lt" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function lt".into());
                        };
                        as_boolean_term(a < b)
                    }
                    "le" => {
                        let [Term::BuiltinNat(ref a), Term::BuiltinNat(ref b)] = &ts[..] else {
                            return Err("wrong arguments for function le".into());
                        };
                        as_boolean_term(a <= b)
                    }
                    _ => match self.extern_function_eval.borrow().get(f) {
                        Some(e) => e.eval(&ts)?,
                        None => match self.definitions.get(f) {
                            None => return Err(format!("undefined: {f}").into()),
                            Some(d) => match &*d {
                                Def::Function(f) => self.eval_function_app(f, &ts)?,
                                Def::EnumVariant(..) => {
                                    Term::FunctionApp(f.clone(), ts, typ.clone())
                                }
                                _ => return Err(format!("not a function: {f}").into()),
                            },
                        },
                    },
                })
            }
            Term::Constant(c, _) => match &**c {
                "Zero" => Ok(Term::BuiltinNat(BigUint::ZERO)),
                "BytesNil" => Ok(Term::BuiltinBytes(vec![])),
                _ => Ok(t.clone()),
            },
            _ => Err("unsupported term for prove_by_eval".into()),
        }
    }

    /// Boolean return values are also constant terms for evaluation.
    fn eval_function_app(
        &self,
        f: &FunctionDef,
        params: &[Term],
    ) -> Result<Term, Cow<'static, str>> {
        let mut block = self.clone();
        for ((param_name, _param_type), actual_param) in f.params.iter().zip(params) {
            block.define(param_name.clone(), Def::Term(actual_param.clone()).into());
        }

        let mut last_result = None;
        for stmt in f.body.as_ref().unwrap() {
            match stmt {
                Stmt::Expr(e) => {
                    last_result = Some(block.eval_expr(e)?);
                }
                Stmt::LetBinding(i, e) => {
                    let t = block.eval_expr(e)?;
                    block.define(i.clone(), Def::Term(t).into());
                }
                _ => return Err("invalid statement in function body".into()),
            }
        }

        Ok(last_result.unwrap())
    }

    fn eval_expr(&mut self, e: &WithLoc<Expr>) -> Result<Term, Cow<'static, str>> {
        match &**e {
            Expr::Ident(i) => match self.definitions.get(i).as_deref() {
                Some(Def::Term(t)) => Ok(t.clone()),
                Some(Def::EnumVariant(v, _)) => {
                    if !v.fields.is_empty() {
                        return Err(format!("cannot be used as a term: {i}").into());
                    }
                    Ok(Term::Constant(i.clone(), Type::new(i.clone())))
                }
                _ => Err(format!("undefined identifier {i}").into()),
            },
            Expr::True => Ok(Term::Constant("true".into(), Type::boolean().clone())),
            Expr::False => Ok(Term::Constant("false".into(), Type::boolean().clone())),
            Expr::PropApp(op, params) => {
                let params: Vec<Term> = params
                    .iter()
                    .map(|p| self.eval_expr(p))
                    .collect::<Result<_, _>>()?;
                match op {
                    PropOp::Not => Ok(as_boolean_term(params[0].is_false())),
                    PropOp::And => Ok(as_boolean_term(params.iter().all(|p| p.is_true()))),
                    PropOp::Or => Ok(as_boolean_term(params.iter().any(|p| p.is_true()))),
                    _ => Err("unsupported proposition connective for evaluation".into()),
                }
            }
            Expr::App(f, params) => {
                let mut param_terms = Vec::with_capacity(params.len());
                for p in params {
                    param_terms.push(self.eval_expr(p)?);
                }
                let return_type = match self.definitions.get(f).as_deref() {
                    Some(Def::Function(f)) => (&f.return_type).into(),
                    Some(Def::EnumVariant(_, tp)) => Type::new(tp.clone()),
                    Some(Def::BuiltInEq) => Type::boolean().clone(),
                    _ => Err(format!("not a function: {f}"))?,
                };
                let fterm = Term::FunctionApp(f.clone(), param_terms, return_type);
                self.eval(&fterm)
            }
            Expr::Match(match_expr) => {
                let scrutinee = self.eval_expr(&match_expr.scrutinee)?;
                for (pattern, body) in &match_expr.match_arms {
                    match self.match_pattern(&scrutinee, pattern) {
                        MatchResult::Ok(bindings) => {
                            let mut block = self.clone();
                            for (i, t) in bindings {
                                block.define(i.clone(), Def::Term(t).into());
                            }
                            return block.eval_expr(body);
                        }
                        MatchResult::NoMatch => continue,
                    }
                }
                Err("no match".into())
            }
            Expr::LitNat(_) | Expr::LitHex(_) | Expr::LitU8(_) => {
                parse_literal(&e.inner, e.loc).map_err(|e| e.message)
            }
            _ => Err("unsupported expression".into()),
        }
    }

    /// Match a term against a pattern. Returns new bindings if successful.
    fn match_pattern(&mut self, term: &Term, pattern: &Pattern) -> MatchResult {
        // XXX: edge cases, e.g. bindings with the same name should not be allowed.
        match pattern {
            Pattern::Identifier(i) => {
                if self.definitions.get(i).is_some_and(|d| d.is_enum_variant()) {
                    match term {
                        // Term is the enum variant. No new bindings.
                        Term::Constant(c, _) if c == i => MatchResult::Ok(Default::default()),
                        // It matches if term is 0 and pattern is Zero. No new bindings.
                        Term::BuiltinNat(ref n) if i == "Zero" && n == &BigUint::ZERO => {
                            MatchResult::Ok(Default::default())
                        }
                        _ => MatchResult::NoMatch,
                    }
                } else {
                    // Bind i to the term.
                    let mut bindings = HashMap::new();
                    bindings.insert(i.clone(), term.clone());
                    MatchResult::Ok(bindings)
                }
            }
            Pattern::TupleStruct(constructor, sub_patterns) => {
                // Check if term is a function application of the constructor.
                match term {
                    Term::FunctionApp(ref term_fun, ref term_ps, _)
                        if term_fun == &**constructor =>
                    {
                        // Match params.
                        let mut bindings = HashMap::new();
                        for (sub_pattern, sub_term) in sub_patterns.iter().zip(term_ps) {
                            match self.match_pattern(sub_term, sub_pattern) {
                                MatchResult::Ok(sub_bindings) => {
                                    bindings.extend(sub_bindings);
                                }
                                r => return r,
                            }
                        }
                        MatchResult::Ok(bindings)
                    }
                    // Special case about builtin Nats.
                    Term::BuiltinNat(ref n) if **constructor == "Succ" && n > &BigUint::ZERO => {
                        let mut bindings = HashMap::new();
                        let sub_pattern = &sub_patterns[0];
                        match self
                            .match_pattern(&Term::BuiltinNat(n - BigUint::from(1_u32)), sub_pattern)
                        {
                            MatchResult::Ok(sub_bindings) => {
                                bindings.extend(sub_bindings);
                            }
                            r => return r,
                        }
                        MatchResult::Ok(bindings)
                    }
                    _ => MatchResult::NoMatch,
                }
            }
        }
    }
}

impl Eval {
    fn define(&mut self, ident: String, def: Rc<Def>) {
        self.definitions.define(ident, def);
    }
}

enum MatchResult {
    Ok(HashMap<String, Term>),
    NoMatch,
}
