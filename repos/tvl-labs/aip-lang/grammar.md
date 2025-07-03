(* Top-level structure *)
Program ::= Intent

(* Intent definition *)
Intent ::= "intent" Identifier ["(" Parameters ")"] "{" Statement* "}"
Parameters ::= [Variable ("," Variable)*]

(* Statements *)
Statement ::= FactStatement | OutcomeStatement | FulfillStatement

FactStatement ::= Identifier "=" "owns" Expression "of" Expression ";"
OutcomeStatement ::= Identifier "=" "desires" Desire ";"
FulfillStatement ::= "fulfill" FulfillList ";"

(* Desires *)
Desire ::= AtLeastDesire | RangeDesire | AmountDesire
AtLeastDesire ::= "at" "least" Expression "of" Expression
RangeDesire ::= Expression "to" Expression "of" Expression
AmountDesire ::= Expression "of" Expression

(* Fulfill lists *)
FulfillList ::= Identifier (AndList | OrList)?
AndList ::= ("and" Identifier)+
OrList ::= ("or" Identifier)+

(* Expressions *)
Expression ::= Term (BinaryOp Term)*
Term ::= Factor (MulOp Factor)*
Factor ::= UnaryExpression | Primary
UnaryExpression ::= "-" Primary
Primary ::= Number | Variable | FunctionCall | "(" Expression ")"
FunctionCall ::= Identifier "(" [Expression ("," Expression)*] ")"

(* Operators *)
BinaryOp ::= "+" | "-" | "*" | "/" | "%"
MulOp ::= "*" | "/" | "%"

(* Terminals *)
Identifier ::= [a-zA-Z_][a-zA-Z0-9_]*
Variable ::= "$" Identifier
Number ::= [0-9]+ ("." [0-9]+)?