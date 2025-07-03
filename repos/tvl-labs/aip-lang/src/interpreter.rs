use crate::ast::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct IntentData {
    pub src_token: String,
    pub src_amount: FixedPointNumber,
    pub outcomes: Vec<OutcomeData>,
    pub fulfillment_logic: Option<String>, // "AND" or "OR"
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OutcomeData {
    pub tokens: Vec<String>,
    pub amounts: Vec<String>, // Amounts as expressions or ranges
    pub asset_structure: String,
    pub fill_structure: String,
}

pub struct Interpreter {
    variables: HashMap<String, String>,
    intents: Vec<IntentData>,
}

pub enum ExprPrimitive {
    Number(FixedPointNumber),
    Variable(String),
}

impl ExprPrimitive {
    pub fn to_var_prim(&self) -> String {
        match self {
            ExprPrimitive::Number(n) => panic!("Cannot convert number to variable: {}", n),
            ExprPrimitive::Variable(var) => var.clone(),
        }
    }

    pub fn to_number(&self) -> FixedPointNumber {
        match self {
            ExprPrimitive::Number(n) => n.clone(),
            ExprPrimitive::Variable(var) => panic!("Cannot convert variable to number: {}", var),
        }
    }
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            variables: HashMap::new(),
            intents: vec![],
        }
    }

    pub fn interpret(&mut self, intent: Intent, args: HashMap<String, String>) -> Result<(), String> {
        // Substitute parameters
        for (param, value) in args {
            self.variables.insert(param, value);
        }

        let mut src_token = String::new();
        let mut src_amount = FixedPointNumber::default();
        let mut outcomes = vec![];
        let mut fulfillment_logic = None;

        for stmt in intent.body {
            match stmt {
                Statement::Fact { name, amount, token } => {
                    let amount_value = self.evaluate_expression(&amount)?;
                    let token_value = self.evaluate_expression(&token)?;
                    src_token = token_value.to_var_prim();
                    src_amount = amount_value.to_number();
                }
                Statement::Outcome { name, desire } => {
                    let outcome_data = self.process_desire(desire)?;
                    outcomes.push(outcome_data);
                }
                Statement::Fulfill { outcomes: outc, logic } => {
                    fulfillment_logic = Some(match logic {
                        FulfillmentLogic::And => "AND".to_string(),
                        FulfillmentLogic::Or => "OR".to_string(),
                    });
                }
            }
        }

        let intent_data = IntentData {
            src_token,
            src_amount,
            outcomes,
            fulfillment_logic,
        };

        self.intents.push(intent_data);
        Ok(())
    }

    fn evaluate_expression(&self, expr: &Expression) -> Result<ExprPrimitive, String> {
        match expr {
            Expression::Number(n) => Ok(ExprPrimitive::Number(n.clone())),
            Expression::Variable(var) => {
                if let Some(value) = self.variables.get(var) {
                   Ok(ExprPrimitive::Variable(value.clone()))
                } else {
                    Err(format!("Undefined variable: {}", var))
                }
            }
            Expression::BinaryOp { left, op, right } => {
                let left_val = self.evaluate_expression(left)?;
                let right_val = self.evaluate_expression(right)?;
                let left_val = left_val.to_number();
                let right_val = right_val.to_number();  
                match op {
                    BinaryOperator::Plus => Ok(ExprPrimitive::Number(left_val + right_val)),
                    BinaryOperator::Minus => Ok(ExprPrimitive::Number(left_val - right_val)),
                    BinaryOperator::Multiply => Ok(ExprPrimitive::Number(left_val * right_val)),
                    BinaryOperator::Divide => Ok(ExprPrimitive::Number(left_val / right_val)),
                    BinaryOperator::Percentage => Ok(ExprPrimitive::Number((left_val * right_val) / FixedPointNumber::from(100))),
                }
            }
            Expression::FunctionCall { name, args } => {
                if name == "spent" {
                    // Placeholder: return the amount intended to spend
                    Ok(ExprPrimitive::Number(FixedPointNumber::from(100)))
                } else {
                    Err(format!("Unknown function: {}", name))
                }
            }
        }
    }

    fn process_desire(&self, desire: Desire) -> Result<OutcomeData, String> {
        match desire {
            Desire::AmountOfToken { amount, token } => {
                let amount_str = self.expression_to_string(&amount);
                let token_value = self.evaluate_expression_to_string(&token)?;
                Ok(OutcomeData {
                    tokens: vec![token_value],
                    amounts: vec![amount_str],
                    asset_structure: "AnySingle".to_string(),
                    fill_structure: "Exactly".to_string(),
                })
            }
            Desire::RangeOfToken { min, max, token } => {
                let min_str = self.expression_to_string(&min);
                let max_str = self.expression_to_string(&max);
                let token_value = self.evaluate_expression_to_string(&token)?;
                Ok(OutcomeData {
                    tokens: vec![token_value],
                    amounts: vec![format!("{}-{}", min_str, max_str)],
                    asset_structure: "AnySingle".to_string(),
                    fill_structure: "ConcreteRange".to_string(),
                })
            }
            Desire::AtLeastAmount { amount, token } => {
                let amount_str = self.expression_to_string(&amount);
                let token_value = self.evaluate_expression_to_string(&token)?;
                Ok(OutcomeData {
                    tokens: vec![token_value],
                    amounts: vec![amount_str],
                    asset_structure: "AnySingle".to_string(),
                    fill_structure: "Minimum".to_string(),
                })
            }
        }
    }

    fn expression_to_string(&self, expr: &Expression) -> String {
        match expr {
            Expression::Number(n) => n.to_string(),
            Expression::Variable(var) => var.clone(),
            Expression::BinaryOp { left, op, right } => {
                let left_str = self.expression_to_string(left);
                let right_str = self.expression_to_string(right);
                let op_str = match op {
                    BinaryOperator::Plus => "+",
                    BinaryOperator::Minus => "-",
                    BinaryOperator::Multiply => "*",
                    BinaryOperator::Divide => "/",
                    BinaryOperator::Percentage => "%",
                };
                format!("{} {} {}", left_str, op_str, right_str)
            }
            Expression::FunctionCall { name, args } => {
                let args_str = args
                    .iter()
                    .map(|arg| self.expression_to_string(arg))
                    .collect::<Vec<_>>()
                    .join(", ");
                format!("{}({})", name, args_str)
            }
        }
    }

    fn evaluate_expression_to_string(&self, expr: &Expression) -> Result<String, String> {
        match expr {
            Expression::Variable(var) => {
                if let Some(value) = self.variables.get(var) {
                    Ok(value.clone())
                } else {
                    Err(format!("Undefined variable: {}", var))
                }
            }
            _ => Ok(self.expression_to_string(expr)),
        }
    }

    pub fn get_intents(&self) -> &Vec<IntentData> {
        &self.intents
    }
}