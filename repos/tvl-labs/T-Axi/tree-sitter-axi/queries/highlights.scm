(hole_identifier) @function

(identifier) @function

((identifier) @type
 (#match? @type "^[A-Z]"))

((identifier) @keyword
 (#match? @keyword "^absurd|and-left|and-right|both|cases|or-left|or-right|refl|simpl|symmetry|transitivity|trivial$"))

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ":"
  ","
  "."
  "\\"
  "|"
  ";"
] @punctuation.delimiter

[
  "&"
  "/\\"
  "="
  "==="
  "<-->"
  "<--"
  "<="
  "<-"
  "~"
  "\\/"
  "-->"
  "=>"
  "->"
  "<:"
] @operator

[
  "apply"
  "assume"
  "axiom"
  "by-contradiction"
  "by"
  "case"
  "cases"
  "chaining"
  "declaration"
  "exists"
  "for"
  "forall"
  "in"
  "ind"
  "induction"
  "instance"
  "instantiate"
  "lemma"
  "let"
  "match"
  "noncomputable"
  "of"
  "open"
  "pick-any"
  "pick-witness"
  "proof"
  "proving"
  "qed"
  "rewrite"
  "such-that"
  "suffices"
  "theorem"
  "unfold"
  "where"
  "with"
  "witness"
] @keyword

[
  (assumption)
  (class)
  (data)
  (module)
  (proposition)
  (record)
  (type)
] @keyword

[
  (block_comment)
  (line_comment)
  (shebang)
] @comment

(number) @number

(char) @string

(string) @string
