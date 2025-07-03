pub mod lambda;
pub mod util;
use lambda::*;

fn main() {
    println!("Hello, world!");
    // let pgm = "\\ a . (a b)";

    // let expected = vec![
    //     Token::Lambda,
    //     Token::Var("a".into()),
    //     Token::LParen,
    //     Token::Var("a".into()),
    //     Token::Var("b".into()),
    //     Token::RParen,
    // ];
    // let results = tokenize(pgm);
    // assert!(results.is_ok());
    // let results = results.unwrap();
    // assert_eq!(expected, results);
    // println!("TOKENS: {:#?}", results);

    // let parser_result = parse(&mut results.into_iter().peekable());
    // assert!(parser_result.is_ok());
    // let expected = abs("a", fn_app(var("a"), var("b")));
    // assert_eq!(parser_result.unwrap(), expected);
}
