#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PhiLambdaPhrase<C> {
    Expr(PhiLambdaExpr<C>),
    Deduction(PhiLambdaDeduction<C>),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PhiLambdaDeduction<C> {
    DedApp {
        op: Box<PhiLambdaExpr<C>>,
        args: Vec<PhiLambdaPhrase<C>>,
    },
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PhiLambdaExpr<C> {
    Const(C),
    Var(Identifier),
    Method {
        bound_var: Identifier,
        body: Box<PhiLambdaPhrase<C>>,
    },
    Func {
        bound_var: Identifier,
        body: Box<PhiLambdaExpr<C>>,
    },
    FuncApp {
        op: Box<PhiLambdaExpr<C>>,
        args: Vec<PhiLambdaPhrase<C>>,
    },
}

impl<T> PhiLambdaPhrase<T> {
    pub fn is_var(&self) -> bool {
        matches!(self, PhiLambdaPhrase::Expr(PhiLambdaExpr::Var(_)))
    }

    pub fn var_ident(&self) -> Option<Identifier> {
        if let PhiLambdaPhrase::Expr(PhiLambdaExpr::Var(i)) = self {
            Some(i.clone())
        } else {
            None
        }
    }

    pub fn to_constant(self) -> Option<T> {
        match self {
            PhiLambdaPhrase::Expr(PhiLambdaExpr::Const(c)) => Some(c),
            _ => None,
        }
    }
}

impl<T> TryFrom<PhiLambdaPhrase<T>> for PhiLambdaExpr<T> {
    type Error = String;

    fn try_from(value: PhiLambdaPhrase<T>) -> Result<Self, Self::Error> {
        match value {
            PhiLambdaPhrase::Deduction(_) => Err("Cannot convert deduction to expression".into()),
            PhiLambdaPhrase::Expr(e) => Ok(e),
        }
    }
}
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Identifier(pub String);

impl From<String> for Identifier {
    fn from(value: String) -> Self {
        Identifier(value)
    }
}

impl From<&str> for Identifier {
    fn from(value: &str) -> Self {
        Identifier(value.into())
    }
}
