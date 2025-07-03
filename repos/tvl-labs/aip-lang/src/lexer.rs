use logos::Logos;

#[derive(Logos, Debug, PartialEq)]
#[logos(skip r"[ \t\n\f]+")]
pub enum Token<'a> {
    // Keywords
    #[token("intent")]
    Intent,
    #[token("owns")]
    Owns,
    #[token("desires")]
    Desires,
    #[token("fulfill")]
    Fulfill,
    #[token("at least")]
    AtLeast,
    #[token("to")]
    To,
    #[token("and")]
    And,
    #[token("or")]
    Or,
    #[token(",")]
    Comma,
    #[token("of")]
    Of,

    // Symbols
    #[token("=")]
    Equal,
    #[token(";")]
    Semicolon,
    #[token("{")]
    LBrace,
    #[token("}")]
    RBrace,
    #[token("(")]
    LParen,
    #[token(")")]
    RParen,
    #[token("%")]
    Percent,
    #[token("*")]
    Asterisk,
    #[token("+")]
    Plus,
    #[token("-")]
    Minus,
    #[token("/")]
    Slash,


    // Identifiers and Numbers
    #[regex(r"[a-zA-Z_][a-zA-Z0-9_]*")]
    Identifier    (&'a str),

    #[regex(r"\$[a-zA-Z_][a-zA-Z0-9_]*")]
    Variable(&'a str),

    #[regex(r"[0-9]+(\.[0-9]+)?")]
    Number(&'a str),

    // String literals (e.g., token names)
    #[regex(r#""([^"\\]|\\.)*""#)]
    StringLiteral(&'a str),

   
 

}