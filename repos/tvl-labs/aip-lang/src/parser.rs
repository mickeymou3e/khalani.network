use crate::ast::*;
use crate::lexer::Token;

pub struct Parser<'a> {
    tokens: &'a [Token<'a>],
    position: usize,
}

impl<'a> Parser<'a> {
    pub fn new(tokens: &'a [Token<'a>]) -> Self {
        Parser { tokens, position: 0 }
    }

    fn consume_token(&mut self) -> Option<&'a Token<'a>> {
        if self.position < self.tokens.len() {
            let token = &self.tokens[self.position];
            self.position += 1;
            Some(token)
        } else {
            None
        }
    }

    fn current_token(&self) -> Option<&'a Token<'a>> {
        if self.position < self.tokens.len() {
            Some(&self.tokens[self.position])
        } else {
            None
        }
    }

    fn expect_token(&mut self, expected: &Token) -> Result<(), String> {
        match self.current_token() {
            Some(token) if token == expected => {
                self.consume_token();
                Ok(())
            }
            Some(token) => Err(format!("Expected {:?}, found {:?}", expected, token)),
            None => Err("Unexpected end of input".into()),
        }
    }

    fn expect_identifier(&mut self) -> Result<String, String> {
        match self.consume_token() {
            Some(Token::Identifier(ident)) => Ok(ident.to_string()),
            Some(token) => Err(format!("Expected identifier, found {:?}", token)),
            None => Err("Unexpected end of input".into()),
        }
    }

    pub fn parse_intent(&mut self) -> Result<Intent, String> {
        self.expect_token(&Token::Intent)?;
        let name = self.expect_identifier()?;

        let params = if matches!(self.current_token(), Some(Token::LParen)) {
            self.consume_token(); // Consume '('
            let params = self.parse_parameters()?;
            self.expect_token(&Token::RParen)?;
            params
        } else {
            vec![]
        };

        self.expect_token(&Token::LBrace)?;

        let mut body = vec![];
        while !matches!(self.current_token(), Some(Token::RBrace)) {
            body.push(self.parse_statement()?);
        }

        self.expect_token(&Token::RBrace)?;

        Ok(Intent { name, params, body })
    }

    fn parse_parameters(&mut self) -> Result<Vec<String>, String> {
        let mut params = vec![];
        loop {
            match self.current_token() {
                Some(Token::Variable(var)) => {
                    self.consume_token();
                    params.push(var.to_string());
                    if matches!(self.current_token(), Some(Token::Comma)) {
                        self.consume_token();
                    } else {
                        break;
                    }
                }
                _ => break,
            }
        }
        Ok(params)
    }

    pub fn parse_statement(&mut self) -> Result<Statement, String> {
        match self.consume_token() {
            Some(Token::Identifier(ident)) => {
                let name = ident.to_string();
                self.expect_token(&Token::Equal)?;
                
                match self.consume_token() {
                    Some(Token::Owns) => {
                        let amount = self.parse_expression()?;
                        self.expect_token(&Token::Of)?;
                        let token = self.parse_expression()?;
                        self.expect_token(&Token::Semicolon)?;
                        Ok(Statement::Fact {
                            name,
                            amount,
                            token,
                        })
                    }
                    Some(Token::Desires) => {
                        let desire = self.parse_desire()?;
                        self.expect_token(&Token::Semicolon)?;
                        Ok(Statement::Outcome {
                            name,
                            desire,
                        })
                    }
                    Some(token) => Err(format!("Expected 'owns' or 'desires', found {:?}", token)),
                    None => Err("Unexpected end of input".into()),
                }
            }
            Some(Token::Fulfill) => {
                let outcomes = self.parse_fulfill_list()?;
                self.expect_token(&Token::Semicolon)?;
                Ok(Statement::Fulfill {
                    outcomes: outcomes.0,
                    logic: outcomes.1,
                })
            }
            Some(token) => Err(format!("Unexpected token in statement: {:?}", token)),
            None => Err("Unexpected end of input".into()),
        }
    }

    fn parse_desire(&mut self) -> Result<Desire, String> {
        eprintln!("parse_desire");
        match self.current_token() {
            Some(Token::AtLeast) => {
                self.consume_token(); // Consume 'at least'
                let amount = self.parse_expression()?;
                self.expect_token(&Token::Of)?;
                let token = self.parse_expression()?;
                Ok(Desire::AtLeastAmount { amount, token })
            }
       
            _ => {
                eprintln!("GOT WILDCARD IN DESIRE");
                let amount = self.parse_expression()?;
                eprintln!("EXPRESSION: {:#?}", amount);
                match self.current_token() {
                    Some(Token::To) => {
                        self.consume_token(); // Consume 'to'
                        let max = self.parse_expression()?;
                        self.expect_token(&Token::Of)?;
                        let token = self.parse_expression()?;
                        Ok(Desire::RangeOfToken {
                            min: amount,
                            max,
                            token,
                        })
                    }
                    _ => {
                        self.expect_token(&Token::Of)?;
                        eprintln!("GOT TO TOKEN OF IN DESIRE");
                        let token = self.parse_expression()?;
                        Ok(Desire::AmountOfToken { amount, token })
                    }
                }
            }
        }
    }

    fn parse_fulfill_list(&mut self) -> Result<(Vec<String>, FulfillmentLogic), String> {
        let mut outcomes = vec![];
        let mut logic = FulfillmentLogic::And;

        let name = self.expect_identifier()?;
        outcomes.push(name);

        while let Some(token) = self.current_token() {
            match token {
                Token::And => {
                    self.consume_token();
                    logic = FulfillmentLogic::And;
                    let name = self.expect_identifier()?;
                    outcomes.push(name);
                }
                Token::Or => {
                    if matches!(logic, FulfillmentLogic::And) && outcomes.len() > 1 {
                        return Err("Cannot mix 'and' and 'or' without parentheses".into());
                    }
                    self.consume_token();
                    logic = FulfillmentLogic::Or;
                    let name = self.expect_identifier()?;
                    outcomes.push(name);
                }
                _ => break,
            }
        }

        Ok((outcomes, logic))
    }

    fn parse_expression(&mut self) -> Result<Expression, String> {
        self.parse_term()
    }

    fn parse_term(&mut self) -> Result<Expression, String> {
        let mut node = self.parse_factor()?;

        while let Some(op) = self.parse_binary_op()? {
            let right = self.parse_factor()?;
            node = Expression::BinaryOp {
                left: Box::new(node),
                op,
                right: Box::new(right),
            };
        }

       

        Ok(node)
    }

    fn parse_factor(&mut self) -> Result<Expression, String> {
        let mut node = self.parse_unary()?;

        while let Some(op) = self.parse_mul_op()? {
            let right = self.parse_unary()?;
            node = Expression::BinaryOp {
                left: Box::new(node),
                op,
                right: Box::new(right),
            };
        }

        Ok(node)
    }

    fn parse_unary(&mut self) -> Result<Expression, String> {
        match self.current_token() {
            Some(Token::Minus) => {
                self.consume_token();
                let expr = self.parse_unary()?;
                Ok(Expression::BinaryOp {
                    left: Box::new(Expression::Number(FixedPointNumber::from(0))),
                    op: BinaryOperator::Minus,
                    right: Box::new(expr),
                })
            }
            _ => self.parse_primary(),
        }
    }

    fn parse_primary(&mut self) -> Result<Expression, String> {
        match self.consume_token() {
            Some(Token::Number(n)) => {
                Ok(Expression::Number(FixedPointNumber::parse(n)?))
            }
            Some(Token::Variable(var)) => {
                eprintln!("VARIABLE IN PARSE PRIMARY: {}", var);
                Ok(Expression::Variable(var.to_string()))
            }
            Some(Token::Identifier(ident)) => {
                if matches!(self.current_token(), Some(Token::LParen)) {
                    self.consume_token(); // Consume '('
                    let args = self.parse_argument_list()?;
                    self.expect_token(&Token::RParen)?;
                    Ok(Expression::FunctionCall {
                        name: ident.to_string(),
                        args,
                    })
                } else {
                    Ok(Expression::Variable(ident.to_string()))
                }
            }
            Some(Token::LParen) => {
                let expr = self.parse_expression()?;
                self.expect_token(&Token::RParen)?;
                Ok(expr)
            }
            Some(token) => Err(format!("Unexpected token in primary expression: {:?}", token)),
            None => Err("Unexpected end of input".into()),
        }
    }

    fn parse_argument_list(&mut self) -> Result<Vec<Expression>, String> {
        let mut args = vec![];
        
        if !matches!(self.current_token(), Some(Token::RParen)) {
            args.push(self.parse_expression()?);
            while matches!(self.current_token(), Some(Token::Comma)) {
                self.consume_token(); // Consume comma
                args.push(self.parse_expression()?);
            }
        }
        
        Ok(args)
    }

    fn parse_binary_op(&mut self) -> Result<Option<BinaryOperator>, String> {
        match self.current_token() {
            Some(Token::Plus) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Plus))
            }
            Some(Token::Minus) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Minus))
            }
            Some(Token::Asterisk) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Multiply))
            }
            Some(Token::Slash) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Divide))
            }
            _ => Ok(None),
        }
    }

    fn parse_add_op(&mut self) -> Result<Option<BinaryOperator>, String> {
        match self.current_token() {
            Some(Token::Plus) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Plus))
            }
            Some(Token::Minus) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Minus))
            }
            _ => Ok(None),
        }
    }

    fn parse_mul_op(&mut self) -> Result<Option<BinaryOperator>, String> {
        match self.current_token() {
            Some(Token::Asterisk) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Multiply))
            }
            Some(Token::Slash) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Divide))
            }
            Some(Token::Percent) => {
                self.consume_token();
                Ok(Some(BinaryOperator::Percentage))
            }
            _ => Ok(None),
        }
    }
}