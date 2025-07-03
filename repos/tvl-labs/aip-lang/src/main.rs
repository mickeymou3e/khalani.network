mod ast;
mod interpreter;
mod lexer;
mod parser;

use interpreter::Interpreter;
use lexer::Token;
use logos::Logos;
use std::collections::HashMap;

fn main() {
    let input = r#"
    intent OneToTwoLP($x, $y, $amount, $feePercent1, $feePercent2) {
        fact_one = owns $amount of $x;
        outcome_a = desires $feePercent1% * spent($x) + spent($x) of $y;
        outcome_b = desires $feePercent2% * spent($x) + spent($x) of $y;

        fulfill outcome_a or outcome_b;
    }
    "#;

    // Lexing
    let lex = Token::lexer(input);
    let tokens: Vec<_> = lex.into_iter().map(|t| t.unwrap()).collect();

    // Parsing
    let mut parser = parser::Parser::new(tokens.as_slice());
    match parser.parse_intent() {
        Ok(intent_ast) => {
            // Interpretation
            let mut interpreter = Interpreter::new();

            let args = HashMap::from([
                ("$x".to_string(), "TokenA".to_string()),
                ("$y".to_string(), "TokenB".to_string()),
                ("$amount".to_string(), "100".to_string()),
                ("$feePercent1".to_string(), "10".to_string()),
                ("$feePercent2".to_string(), "20".to_string()),
            ]);

            match interpreter.interpret(intent_ast, args) {
                Ok(_) => {
                    let intents = interpreter.get_intents();
                    for intent in intents {
                        println!("{}", serde_json::to_string_pretty(&intent).unwrap());
                    }
                }
                Err(e) => eprintln!("Interpretation error: {}", e),
            }
        }
        Err(e) => eprintln!("Parsing error: {}", e),
    }
}