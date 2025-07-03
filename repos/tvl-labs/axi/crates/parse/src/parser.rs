use std::{borrow::Cow, cmp::Ordering, iter::Peekable, rc::Rc};

use axi_ast::*;
use lexi_matic::Error as LexicalError;

use crate::lex::Token;

#[derive(Debug)]
pub enum ParseError<'i> {
    LexicalError(LexicalError),
    UnexpectedToken {
        token: (usize, Token<'i>, usize),
        msg: Option<&'static str>,
        expected: Cow<'static, str>,
    },
    UnexpectedEof {
        expected: Cow<'static, str>,
    },
}

#[cfg(feature = "ariadne")]
impl ParseError<'_> {
    pub fn as_ariadne_report(&self, file_len: usize) -> ariadne::Report<'_> {
        use ariadne::*;

        match self {
            ParseError::UnexpectedToken {
                token: (l, _, r),
                msg,
                expected,
            } => {
                let mut r = Report::build(ReportKind::Error, *l..*r)
                    .with_message(msg.unwrap_or("unexpected token"))
                    .with_label(Label::new(*l..*r).with_message("unexpected"));
                if !expected.is_empty() {
                    r = r.with_note(format!("expected {expected}"));
                }
                r.finish()
            }
            ParseError::LexicalError(e) => Report::build(ReportKind::Error, e.0..e.0)
                .with_message("lexical error")
                .with_label(Label::new(e.0..e.0 + 1).with_message("invalid token"))
                .finish(),
            ParseError::UnexpectedEof { expected } => {
                Report::build(ReportKind::Error, file_len..file_len + 1)
                    .with_message("unexpected end of input")
                    .with_label(Label::new(file_len..file_len + 1).with_message(""))
                    .with_note(format!("expected {expected}"))
                    .finish()
            }
        }
    }
}

impl From<LexicalError> for ParseError<'_> {
    fn from(e: LexicalError) -> Self {
        Self::LexicalError(e)
    }
}

type TokenResult<'i> = std::result::Result<(usize, Token<'i>, usize), LexicalError>;
type Result<'i, T> = std::result::Result<T, ParseError<'i>>;

pub fn stmts_all<'i, IT>(tokens: IT) -> Result<'i, Vec<Stmt>>
where
    IT: Iterator<Item = TokenResult<'i>>,
{
    let mut p = Parser {
        tokens: tokens.peekable(),
        restriction: Restriction::NoRestriction,
    };
    let ss = p.stmts()?;
    match p.tokens.next() {
        None => Ok(ss),
        Some(Err(e)) => Err(e)?,
        Some(Ok(token)) => unexpected(token, "statement"),
    }
}

struct Parser<'i, IT: Iterator<Item = TokenResult<'i>>> {
    tokens: Peekable<IT>,
    restriction: Restriction,
}

#[derive(PartialEq, Eq)]
enum Restriction {
    NoRestriction,
    // Like in rust, constructs like assume and match cannot be followed by a
    // struct expression because the braces are for the match arms or the body
    // of the assume block:
    //
    // match e { a => b }
    //
    // See also
    //
    // https://rust-lang.github.io/rfcs/0092-struct-grammar.html
    NoStruct,
}
use Restriction::*;

impl<'i, IT: Iterator<Item = TokenResult<'i>>> Parser<'i, IT> {
    fn stmts(&mut self) -> Result<'i, Vec<Stmt>> {
        let mut ss = Vec::new();
        loop {
            match self.peek()? {
                None => break,
                Some((_, t, _)) => match t {
                    Token::Let => {
                        self.tokens.next();
                        let ident = self.ident()?;
                        self.expect(Token::ColonEqual)?;
                        let rhs = self.expr()?;
                        self.expect(Token::Semicolon)?;
                        ss.push(Stmt::LetBinding(ident, rhs));
                    }
                    Token::Const => {
                        self.tokens.next();
                        let ident = self.loc_ident()?;
                        self.expect(Token::Colon)?;
                        let tp = self.type_reference()?;
                        self.expect(Token::Semicolon)?;
                        ss.push(Stmt::ConstDec(ident, tp));
                    }
                    Token::Inductive => {
                        ss.push(Stmt::InductiveEnum(self.inductive_enum()?.into()));
                    }
                    Token::Struct => {
                        ss.push(Stmt::Struct(self.struct_()?.into()));
                    }
                    Token::Domain => {
                        self.tokens.next();
                        let name = self.loc_ident()?;
                        self.expect(Token::Semicolon)?;
                        ss.push(Stmt::Domain(name));
                    }
                    Token::PickWitness => {
                        self.tokens.next();
                        let idents = self.comma1_idents()?;
                        self.expect(Token::Period)?;
                        let e = self.expr()?;
                        self.expect(Token::Semicolon)?;
                        ss.push(Stmt::PickWitness(idents, e));
                    }
                    Token::Function => {
                        self.tokens.next();
                        let name = self.loc_ident()?;
                        self.expect(Token::ParenOpen)?;
                        let params = self.comma_separated(|this| {
                            if let Some(i) = this.try_ident()? {
                                this.expect(Token::Colon)?;
                                let t = this.type_reference()?;
                                Ok(Some((i, t)))
                            } else {
                                Ok(None)
                            }
                        })?;
                        self.expect(Token::ParenClose)?;
                        self.expect(Token::RightArrow)?;
                        let return_type = self.type_reference()?;
                        let body = if self.try_token(Token::BraceOpen)?.is_some() {
                            let body = self.stmts()?;
                            self.expect(Token::BraceClose)?;
                            Some(body)
                        } else {
                            self.expect(Token::Semicolon)?;
                            None
                        };
                        ss.push(Stmt::FunctionDef(
                            FunctionDef {
                                name,
                                params,
                                return_type,
                                body,
                            }
                            .into(),
                        ));
                    }
                    Token::Proc => {
                        self.tokens.next();
                        let name = self.ident()?;
                        self.expect(Token::ParenOpen)?;
                        let args = self.comma_idents()?;
                        self.expect(Token::ParenClose)?;
                        let l = self.expect(Token::BraceOpen)?.loc;
                        let body = self.stmts()?;
                        let r = self.expect(Token::BraceClose)?.loc;
                        ss.push(Stmt::ProcDef(
                            name,
                            args,
                            Expr::Stmts(body).with_loc(l.till(r)),
                        ));
                    }
                    _ if is_expr(t) => {
                        let is_block = is_block(t);
                        let e_loc = self.expr()?;
                        ss.push(Stmt::Expr(e_loc));
                        if self.try_token(Token::Semicolon)?.is_none() && !is_block {
                            break;
                        }
                    }
                    _ => break,
                },
            }
        }
        Ok(ss)
    }

    /// Parse an expression with no restriction.
    fn expr(&mut self) -> Result<'i, LocExpr> {
        self.expr_res(NoRestriction)
    }

    /// Parse an expression with some restriction. The restriction is restored afterwards.
    fn expr_res(&mut self, res: Restriction) -> Result<'i, LocExpr> {
        let old_res = core::mem::replace(&mut self.restriction, res);
        let r = self.expr_bp(0);
        self.restriction = old_res;
        r
    }

    // expr_bp maintains the current restriction.
    fn expr_bp(
        &mut self,
        /* pratt parsing binding power */ min_bp: u8,
    ) -> Result<'i, LocExpr> {
        // Pratt parsing.
        let mut lhs = match self.tokens.next() {
            None => eof_error("expression")?,
            Some(Err(e)) => Err(e)?,
            Some(Ok((l, t, r))) => match t {
                // Closure, OrS is also the vertical bar |.
                Token::OrS => {
                    let formal_params = self.comma_idents()?;
                    self.expect(Token::OrS)?;
                    let e = self.expr_bp(0)?;
                    let r = e.loc.right;
                    Expr::Proc(formal_params, e.into()).with_loc((l, r))
                }
                Token::Excl => {
                    let method_name = self.ident()?;
                    self.expect(Token::ParenOpen)?;
                    let args = self.comma_exprs()?;
                    let r = self.expect(Token::ParenClose)?.loc.right;
                    Expr::MethodApp(method_name, args).with_loc((l, r))
                }
                Token::Identifier(ident) => {
                    if self.try_token(Token::ParenOpen)?.is_some() {
                        let args = self.comma_exprs()?;
                        let r = self.expect(Token::ParenClose)?.loc.right;
                        Expr::App(ident.into(), args).with_loc((l, r))
                    } else if self.restriction != NoStruct
                        && self.try_token(Token::BraceOpen)?.is_some()
                    {
                        let fields = self.comma_separated(|this| {
                            if this.peek()?.is_some_and(|(_, t, _)| is_ident(t)) {
                                let name = this.loc_ident()?;
                                this.expect(Token::Colon)?;
                                let value = this.expr()?;
                                Ok(Some((name, value)))
                            } else {
                                Ok(None)
                            }
                        })?;
                        let r1 = self.expect(Token::BraceClose)?.loc.right;
                        Expr::StructExpr(StructExpr {
                            name: Identifier::from(ident).with_loc((l, r)),
                            fields,
                        })
                        .with_loc((l, r1))
                    } else {
                        Expr::Ident(ident.into()).with_loc((l, r))
                    }
                }
                Token::True => Expr::True.with_loc((l, r)),
                Token::False => Expr::False.with_loc((l, r)),
                Token::LitNat(n) => Expr::LitNat(n.into()).with_loc((l, r)),
                Token::LitHex(h) => Expr::LitHex(h.into()).with_loc((l, r)),
                Token::LitU8(u) => Expr::LitU8(u.into()).with_loc((l, r)),
                Token::NegateS => {
                    // binding power 10.
                    let rhs = self.expr_bp(10)?;
                    let r = rhs.loc.right;
                    Expr::PropApp(axi_ast::PropOp::Not, vec![rhs]).with_loc((l, r))
                }
                Token::Negate | Token::And | Token::Or | Token::Implies | Token::Bicond => {
                    let op = match t {
                        Token::Negate => PropOp::Not,
                        Token::And => PropOp::And,
                        Token::Or => PropOp::Or,
                        Token::Implies => PropOp::If,
                        Token::Bicond => PropOp::Iff,
                        _ => unreachable!(),
                    };
                    self.expect(Token::ParenOpen)?;
                    let args = self.comma_exprs()?;
                    let r = self.expect(Token::ParenClose)?.loc.right;
                    Expr::PropApp(op, args).with_loc((l, r))
                }
                Token::ForAll | Token::Exists => {
                    let vars = self.comma_separated(|this| {
                        let Some(i) = this.try_ident()? else {
                            return Ok(None);
                        };
                        let t = if this.try_token(Token::Colon)?.is_some() {
                            Some(this.type_reference()?)
                        } else {
                            None
                        };
                        Ok(Some((i, t)))
                    })?;
                    if vars.is_empty() {
                        // Use ident to report error.
                        self.ident()?;
                    }
                    self.expect(Token::Period)?;
                    // binding power 10.
                    let body = self.expr_bp(10)?;
                    let r = body.loc.right;
                    let f = match t {
                        Token::ForAll => Expr::ForAll,
                        Token::Exists => Expr::Exists,
                        _ => unreachable!(),
                    };
                    f(vars, body.into()).with_loc((l, r))
                }
                Token::Assume => {
                    let assumption = self.expr_res(NoStruct)?.into();
                    self.expect(Token::BraceOpen)?;
                    let body = self.stmts()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    // We don't allow infix operators after block exprs, so return directly.
                    return Ok(Expr::Assume { assumption, body }.with_loc((l, r)));
                }
                Token::ByInduction => {
                    let var = self.ident()?;
                    self.expect(Token::Colon)?;
                    let type_ = self.type_reference()?;
                    self.expect(Token::Period)?;
                    let goal = self.expr_res(NoStruct)?.into();
                    self.expect(Token::BraceOpen)?;
                    let cases = self.match_arms()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    return Ok(Expr::ByInduction(ByInductionExpr {
                        var,
                        type_,
                        goal,
                        cases,
                    })
                    .with_loc((l, r)));
                }
                Token::PickAny => {
                    let vars = self.comma_separated(|this| {
                        let Some(i) = this.try_ident()? else {
                            return Ok(None);
                        };
                        this.expect(Token::Colon)?;
                        let t = this.type_reference()?;
                        Ok(Some((i, t)))
                    })?;
                    if vars.is_empty() {
                        // Use ident to report error.
                        self.ident()?;
                    }
                    self.expect(Token::BraceOpen)?;
                    let body = self.stmts()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    return Ok(Expr::PickAny(vars, body).with_loc((l, r)));
                }
                Token::BraceOpen => {
                    let body = self.stmts()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    return Ok(Expr::Stmts(body).with_loc((l, r)));
                }
                Token::ParenOpen => {
                    // No restriction in parens. Struct expressions are allowed:
                    //
                    // match (Foo {a : b}) & c { ... }
                    let e = self.expr()?;
                    let r = self.expect(Token::ParenClose)?.loc.right;
                    e.inner.with_loc((l, r))
                }
                Token::Match => {
                    let scrutinee = self.expr_res(NoStruct)?;
                    self.expect(Token::BraceOpen)?;
                    let match_arms = self.match_arms()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    return Ok(Expr::Match(MatchExpr {
                        scrutinee: scrutinee.into(),
                        match_arms,
                    })
                    .with_loc((l, r)));
                }
                Token::If => {
                    let condition = self.expr_res(NoStruct)?;
                    self.expect(Token::BraceOpen)?;
                    let true_branch = self.stmts()?;
                    self.expect(Token::BraceClose)?;
                    self.expect(Token::Else)?;
                    self.expect(Token::BraceOpen)?;
                    let false_branch = self.stmts()?;
                    let r = self.expect(Token::BraceClose)?.loc.right;
                    return Ok(Expr::IfElse(IfElseExpr {
                        condition: condition.into(),
                        true_branch,
                        false_branch,
                    })
                    .with_loc((l, r)));
                }
                t => unexpected((l, t, r), "expression")?,
            },
        };
        loop {
            match self.peek()? {
                None => break,
                Some((l, t, r)) => {
                    // Field access
                    if matches!(t, Token::Period) {
                        self.tokens.next();
                        let field = self.loc_ident()?;
                        let loc = lhs.loc.till(field.loc);
                        lhs = Expr::FieldAccess(lhs.into(), field).with_loc(loc);
                        continue;
                    }
                    enum PropOpOrFp {
                        PropOp(PropOp),
                        Fp(String),
                    }
                    let (op, l_bp, r_bp) = match t {
                        // Left assoc, high binding power.
                        Token::Identifier(op) => (PropOpOrFp::Fp(op.to_string()), 13, 14),
                        // No assoc, higher binding power than ~, forall, exists.
                        Token::Equal => (PropOpOrFp::Fp("=".into()), 11, 11),
                        // Left assoc, higher binding power.
                        Token::AndS => (PropOpOrFp::PropOp(PropOp::And), 7, 8),
                        // Left assoc, higher binding power.
                        Token::OrS => (PropOpOrFp::PropOp(PropOp::Or), 5, 6),
                        // Right assoc, lower binding power.
                        Token::ImpliesS => (PropOpOrFp::PropOp(PropOp::If), 4, 3),
                        // No assoc, lower binding power.
                        Token::BicondS => (PropOpOrFp::PropOp(PropOp::Iff), 2, 2),
                        _ => break,
                    };
                    match l_bp.cmp(&min_bp) {
                        Ordering::Less => break,
                        Ordering::Equal => Err(ParseError::UnexpectedToken {
                            token: (l, t.clone(), r),
                            msg: Some("operator is non-associative"),
                            expected: "".into(),
                        })?,
                        _ => {}
                    }
                    self.tokens.next();
                    let rhs = self.expr_bp(r_bp)?;
                    let l = lhs.loc.left;
                    let r = rhs.loc.right;
                    lhs = match op {
                        PropOpOrFp::Fp(fp) => Expr::App(fp, vec![lhs, rhs]),
                        PropOpOrFp::PropOp(op) => Expr::PropApp(op, vec![lhs, rhs]),
                    }
                    .with_loc((l, r));
                }
            }
        }
        Ok(lhs)
    }

    fn inductive_enum(&mut self) -> Result<'i, InductiveEnum> {
        self.expect(Token::Inductive)?;
        let name = self.loc_ident()?;
        self.expect(Token::BraceOpen)?;
        let variants = self.comma_separated(|this| {
            if this.peek()?.is_some_and(|(_, t, _)| is_ident(t)) {
                Ok(Some(Rc::new(this.enum_variant()?)))
            } else {
                Ok(None)
            }
        })?;
        self.expect(Token::BraceClose)?;
        Ok(InductiveEnum { name, variants })
    }

    fn struct_(&mut self) -> Result<'i, StructDecl> {
        self.expect(Token::Struct)?;
        let name = self.loc_ident()?;
        self.expect(Token::BraceOpen)?;
        let fields = self.comma_separated(|this| {
            if this.peek()?.is_some_and(|(_, t, _)| is_ident(t)) {
                let name = this.loc_ident()?;
                this.expect(Token::Colon)?;
                let type_ = this.type_reference()?;
                Ok(Some(Field { name, type_ }))
            } else {
                Ok(None)
            }
        })?;
        self.expect(Token::BraceClose)?;
        Ok(StructDecl { name, fields })
    }

    fn enum_variant(&mut self) -> Result<'i, EnumVariant> {
        let name = self.loc_ident()?;
        let fields = if self.try_token(Token::ParenOpen)?.is_some() {
            let fields = self.comma_separated(|this| {
                if this.peek()?.is_some_and(|(_, t, _)| is_ident(t)) {
                    let t = this.type_reference()?;
                    Ok(Some(t))
                } else {
                    Ok(None)
                }
            })?;
            self.expect(Token::ParenClose)?;
            fields
        } else {
            Vec::new()
        };
        Ok(EnumVariant { name, fields })
    }

    fn match_arms(&mut self) -> Result<'i, Vec<(LocPattern, LocExpr)>> {
        let mut arms = Vec::new();
        while let Some(pattern) = self.try_pattern()? {
            self.expect(Token::FatRightArrow)?;
            let is_block = self.peek()?.is_some_and(|(_, t, _)| is_block(t));
            let expr = self.expr()?;
            arms.push((pattern, expr));
            if self.try_token(Token::Comma)?.is_none() && !is_block {
                break;
            }
        }
        Ok(arms)
    }

    fn try_pattern(&mut self) -> Result<'i, Option<LocPattern>> {
        let ident = if self.peek()?.is_some_and(|(_, t, _)| is_ident(t)) {
            self.loc_ident()?
        } else {
            return Ok(None);
        };
        Ok(Some(if self.try_token(Token::ParenOpen)?.is_some() {
            let pts = self.comma_separated(Self::try_pattern)?;
            let l = ident.loc.left;
            let r = self.expect(Token::ParenClose)?.loc.right;
            Pattern::TupleStruct(ident, pts).with_loc((l, r))
        } else {
            Pattern::Identifier(ident.inner).with_loc(ident.loc)
        }))
    }

    fn comma1_idents(&mut self) -> Result<'i, Vec<Identifier>> {
        let mut idents = Vec::new();
        idents.push(self.ident()?);
        loop {
            if self.try_token(Token::Comma)?.is_none() {
                break;
            }
            if let Some(i) = self.try_ident()? {
                idents.push(i);
            } else {
                break;
            }
        }
        Ok(idents)
    }

    fn comma_separated<T, F>(&mut self, sub_parser: F) -> Result<'i, Vec<T>>
    where
        F: Fn(&mut Self) -> Result<'i, Option<T>>,
    {
        let mut items = Vec::new();
        loop {
            match sub_parser(self)? {
                Some(t) => items.push(t),
                None => break,
            }
            if self.try_token(Token::Comma)?.is_none() {
                break;
            }
        }
        Ok(items)
    }

    fn comma_idents(&mut self) -> Result<'i, Vec<Identifier>> {
        self.comma_separated(Self::try_ident)
    }

    fn comma_exprs(&mut self) -> Result<'i, Vec<LocExpr>> {
        self.comma_separated(|this| {
            if this.peek()?.is_some_and(|(_, t, _)| is_expr(t)) {
                Ok(Some(this.expr()?))
            } else {
                Ok(None)
            }
        })
    }

    fn expect(&mut self, expected: Token<'i>) -> Result<'i, WithLoc<Token<'i>>> {
        match self.tokens.next() {
            None => eof_error(format!("{expected:?}")),
            Some(Err(e)) => Err(e)?,
            Some(Ok((l, t, r))) => {
                if t == expected {
                    Ok(t.with_loc((l, r)))
                } else {
                    unexpected((l, t, r), format!("{expected:?}"))
                }
            }
        }
    }

    fn peek(&mut self) -> Result<'i, Option<(usize, &'_ Token<'i>, usize)>> {
        match self.tokens.peek() {
            None => Ok(None),
            Some(Err(e)) => Err(LexicalError(e.0))?,
            Some(Ok((l, t, r))) => Ok(Some((*l, t, *r))),
        }
    }

    fn try_matches<F>(&mut self, f: F) -> Result<'i, Option<(usize, Token<'i>, usize)>>
    where
        F: FnOnce(&Token<'i>) -> bool,
    {
        match self.peek()? {
            None => Ok(None),
            Some((_, t, _)) => {
                if f(t) {
                    match self.tokens.next() {
                        Some(Ok(t)) => Ok(Some(t)),
                        _ => unreachable!(),
                    }
                } else {
                    Ok(None)
                }
            }
        }
    }

    fn try_token(&mut self, t: Token<'_>) -> Result<'i, Option<(usize, Token<'i>, usize)>> {
        self.try_matches(|t1| *t1 == t)
    }

    fn try_ident(&mut self) -> Result<'i, Option<String>> {
        match self.try_matches(is_ident)? {
            Some((_, Token::Identifier(i), _)) => Ok(Some(i.into())),
            _ => Ok(None),
        }
    }

    fn type_reference(&mut self) -> Result<'i, TypeReference> {
        Ok(TypeReference {
            name: self.loc_ident()?,
        })
    }

    fn loc_ident(&mut self) -> Result<'i, LocIdentifier> {
        match self.tokens.next() {
            None => eof_error("identifier"),
            Some(Err(e)) => Err(e)?,
            Some(Ok((l, t, r))) => {
                if let Token::Identifier(i) = t {
                    Ok(Identifier::from(i).with_loc((l, r)))
                } else {
                    unexpected((l, t, r), "identifier")
                }
            }
        }
    }

    fn ident(&mut self) -> Result<'i, String> {
        match self.tokens.next() {
            None => eof_error("identifier"),
            Some(Err(e)) => Err(e)?,
            Some(Ok((l, t, r))) => {
                if let Token::Identifier(i) = t {
                    Ok(i.into())
                } else {
                    unexpected((l, t, r), "identifier")
                }
            }
        }
    }
}

fn is_expr(t: &Token<'_>) -> bool {
    matches!(
        t,
        Token::Excl
            | Token::OrS /* really vertical bar | */
            | Token::Identifier(_)
            | Token::True
            | Token::False
            | Token::LitNat(_)
            | Token::LitHex(_)
            | Token::LitU8(_)
            | Token::NegateS
            | Token::Negate
            | Token::And
            | Token::Or
            | Token::Implies
            | Token::Bicond
            | Token::ForAll
            | Token::Exists
            | Token::PickAny
            | Token::Assume
            | Token::ByInduction
            | Token::Match
            | Token::If
            | Token::BraceOpen
            | Token::ParenOpen
    )
}

fn is_ident(t: &Token<'_>) -> bool {
    matches!(t, Token::Identifier(_))
}

fn is_block(t: &Token<'_>) -> bool {
    matches!(
        t,
        Token::Assume | Token::BraceOpen | Token::PickAny | Token::Match | Token::ByInduction
    )
}

fn unexpected<T>(
    token: (usize, Token<'_>, usize),
    expected: impl Into<Cow<'static, str>>,
) -> Result<'_, T> {
    Err(ParseError::UnexpectedToken {
        token,
        msg: None,
        expected: expected.into(),
    })
}

fn eof_error<'i, T>(expected: impl Into<Cow<'static, str>>) -> Result<'i, T> {
    Err(ParseError::UnexpectedEof {
        expected: expected.into(),
    })
}
