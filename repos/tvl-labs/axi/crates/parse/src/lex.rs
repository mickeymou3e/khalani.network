pub fn lexer(input: &str) -> TokenIterator<'_> {
    use lexi_matic::Lexer;

    Token::lex(input)
}

#[derive(Debug, PartialEq, Eq, Clone, lexi_matic::Lexer)]
#[lexer(skip = r"[ \t\r\n\f]+", skip = r"#[^\n]*\n")]
pub enum Token<'a> {
    #[token("assume")]
    Assume,
    #[token("proc")]
    Proc,
    #[token("!")]
    Excl,
    #[token("and")]
    And,
    #[token("&")]
    AndS,
    #[token("or")]
    Or,
    #[token("|")]
    OrS,
    #[token("not")]
    Negate,
    #[token("~")]
    NegateS,
    #[token("implies")]
    Implies,
    #[token("==>")]
    ImpliesS,
    #[token("bicond")]
    Bicond,
    #[token("<==>")]
    BicondS,
    #[token("->")]
    RightArrow,
    #[token("=>")]
    FatRightArrow,
    #[token("=")]
    Equal,
    #[token(":=")]
    ColonEqual,
    #[token("true")]
    True,
    #[token("false")]
    False,
    #[token("(")]
    ParenOpen,
    #[token(")")]
    ParenClose,
    #[token("{")]
    BraceOpen,
    #[token("}")]
    BraceClose,
    #[token(";")]
    Semicolon,
    #[token(",")]
    Comma,
    #[token(".")]
    Period,
    #[token(":")]
    Colon,
    #[token("forall")]
    ForAll,
    #[token("exists")]
    Exists,
    #[token("pick_any")]
    PickAny,
    #[token("pick_witness")]
    PickWitness,
    #[token("let")]
    Let,
    #[token("const")]
    Const,
    #[token("inductive")]
    Inductive,
    #[token("struct")]
    Struct,
    #[token("domain")]
    Domain,
    #[token("function")]
    Function,
    #[token("match")]
    Match,
    #[token("by_induction")]
    ByInduction,
    #[token("if")]
    If,
    #[token("else")]
    Else,
    #[regex("[a-zA-Z_][a-zA-Z0-9_]*")]
    Identifier(&'a str),
    #[regex("0|[1-9][0-9]*")]
    LitNat(&'a str),
    #[regex("0|[1-9][0-9]*_?u8")]
    LitU8(&'a str),
    #[regex("0x[0-9a-fA-F]+")]
    LitHex(&'a str),
}
