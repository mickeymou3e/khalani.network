/**
 * @file Axi grammar for tree-sitter
 * @author Mateusz Pyzik <mateusz@tunnelvisionlabs.xyz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// brackets
const lparen = "(";
const rparen = ")";
const lbracket = "[";
const rbracket = "]";
const lbrace = "{";
const rbrace = "}";

// punctuation
const colon = ":";
const comma = ",";
const dot = ".";
const lambda = "\\";
const pipe = "|";
const semicolon = ";";

// operators
const amp = "&";
const and = "/\\";
const eq = "=";
const equality = "===";
const equivalence = "<-->";
const laarrow = "<--";
const Larrow = "<=";
const larrow = "<-";
const negation = "~";
const or = "\\/";
const raarrow = "-->";
const Rarrow = "=>";
const rarrow = "->";
const sub = "<:";

// anonymous keyword nodes
const apply = "apply";
const assume = "assume";
const axiom = "axiom";
const by = "by";
const by_contradiction = "by-contradiction";
const case_ = "case";
const cases = "cases";
const chaining = "chaining";
const declaration = "declaration";
const exists = "exists";
const for_ = "for";
const forall = "forall";
const in_ = "in";
const ind = "ind";
const induction = "induction";
const instance = "instance";
const instantiate = "instantiate";
const lemma = "lemma";
const let_ = "let";
const match = "match";
const noncomputable = "noncomputable";
const of = "of";
const open = "open";
const pick_any = "pick-any";
const pick_witness = "pick-witness";
const proof = "proof";
const proving = "proving";
const rewrite = "rewrite";
const such_that = "such-that";
const suffices = "suffices";
const qed = "qed";
const theorem = "theorem";
const unfold = "unfold";
const where = "where";
const with_ = "with";
const witness = "witness";

// named keyword nodes
const assumption = "assumption";
const class_ = "class";
const data = "data";
const module_ = "module";
const proposition = "proposition";
const record = "record";
const type = "type";

// subtokens
const char = /[^'"\\]|\\([abefnrtv\\'"?]|[0-7]{1,3}|x[0-9a-fA-F]+|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/;
const word = /[a-zA-Z_][-a-zA-Z0-9_']*/;

module.exports = grammar({
  name: "axi",

  word: $ => $.identifier,

  externals: $ => [
    $.error_recovery,
    $.begin,
    $.separator,
    $.end
  ],

  extras: $ => [
    /\s/,
    $.block_comment,
    $.line_comment,
  ],

  conflicts: $ => [],

  rules: {
    // start rule
    source_file: $ => seq(
      optional(seq(
        $.separator,
        $.shebang,
      )),
      repeat(seq(
        $.separator,
        $._declaration
      )),
      optional($.separator),
    ),

    // comments
    block_comment: $ => /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
    line_comment: $ => /\/\/(.|\\\n)*/,

    // tokens
    shebang: $ => /#!.*/,
    identifier: $ => token(seq(repeat(seq(word, ".")), choice(word, /[-+/*^]/))),
    direction: $ => /<===|===>/,
    hole_identifier: $ => token(seq("?", word)),
    number: $ => /-?\d+(\.\d*)?(e-?\d+)?/,
    char: $ => token(seq("'", choice(char, "\""), "'")),
    string: $ => token(seq("\"", repeat(choice(char, "'")), "\"")),

    _declaration: $ => choice(
      $.structure_declaration,
      $.instance_declaration,
      $.constant_declaration,
      $.unpack_declaration,
      $.theorem_declaration,
      $.axiom_declaration,
      $.declaration,
      $.pipe_clause,
    ),

    structure_declaration: $ => seq(
      $._structure_specifier,
      optional($._sort_specifier),
      $.identifier,
      optional($.parameters),
      optional(choice(
        $._struct_ann,
      )),
      $.where_block
    ),

    instance_declaration: $ => seq(
      instance,
      $._nested_pattern,
      optional(seq(Larrow, $._term, repeat(seq(comma, $._term)))),
      $.where_block,
    ),

    constant_declaration: $ => seq(
      optional($._sort_specifier),
      $.identifier,
      optional($.parameters),
      choice(
        $.ctor_ann,
        seq(optional($.type_ann), optional($.value))
      ),
    ),

    unpack_declaration: $ => seq(
      choice($.record_pattern, $.tuple_pattern),
      $.value
    ),

    theorem_declaration: $ => seq(
      theorem,
      $.identifier,
      optional($.parameters),
      $.type_ann,
      $._definition
    ),

    lemma_declaration: $ => seq(
      lemma,
      $.identifier,
      optional($.parameters),
      optional($.type_ann),
      $._definition
    ),

    axiom_declaration: $ => seq(
      axiom,
      $.identifier,
      optional($.parameters),
      $.type_ann
    ),

    declaration: $ => seq(
      declaration,
      $.parameters,
      optional($.type_ann)
    ),

    _structure_specifier: $ => choice(
      $.class,
      $.data,
      $.module,
      $.record,
    ),

    class: $ => class_,

    data: $ => data,

    module: $ => module_,

    record: $ => record,

    _sort_specifier: $ => choice(
      $.type,
      $.proposition
    ),

    type: $ => type,

    proposition: $ => proposition,

    parameters: $ => repeat1($._parameter_group),

    _parameter_group: $ => choice(
      $.identifier,
      $._ctor_parameter,
      $.explicit_parameters,
      $.instance_parameters,
      $.implicit_parameters
    ),

    _ctor_parameter: $ => seq(lparen, $.ctor_pattern, rparen),
    explicit_parameters: $ => seq(lparen, repeat1($._atomic_pattern), $.type_ann, rparen),
    instance_parameters: $ => seq(lbracket, $._term, repeat(seq(comma, $._term)), rbracket),
    implicit_parameters: $ => seq(lbrace, repeat1($._atomic_pattern), optional($.type_ann), rbrace),

    where_block: $ => seq(
      where,
      $.begin,
      repeat(seq(
        $.separator,
        $._declaration
      )),
      $.end
    ),

    _definition: $ => choice(
      $.by_block,
      $.proof_block,
      $.value
    ),

    bullet_block: $ => seq(
      dot,
      $.begin,
      repeat(seq(
        $.separator,
        $._proof_step
      )),
      $.end
    ),

    by_block: $ => seq(
      by,
      $.begin,
      repeat(seq(
        $.separator,
        $._proof_step
      )),
      $.end
    ),

    proof_block: $ => seq(
      proof,
      $.begin,
      repeat(seq(
        $.separator,
        $._proof_step
      )),
      $.end,
      qed
    ),

    _proof_step: $ => choice(
      $._proof_decl,
      $.bullet_block,
      $.cases,
      $.induction,
      $.pipe_clause,
      $.proving,
      $.instantiate,
      $.intro,
      $.witness,
      $._term,
    ),

    _proof_decl: $ => choice(
      $.assume,
      $.by_contradiction,
      seq(let_, optional(noncomputable), $._declaration),
      $.lemma_declaration,
      $.open,
      $.pick_any,
      $.pick_witness,
      $.chaining,
      $.rewrite,
      $.unfold,
    ),

    assume: $ => seq(assume, $.patterns),

    by_contradiction: $ => seq(by_contradiction, $._atomic_pattern, optional($.type_ann)),

    open: $ => seq(open, $.identifier),

    pick_any: $ => seq(pick_any, $.patterns),

    pick_witness: $ => seq(pick_witness, $.patterns, for_, $._term),

    patterns: $ => seq(
      repeat1($._atomic_pattern),
      optional($.type_ann),
    ),

    _atomic_pattern: $ => choice(
      $.identifier,
      $.direction,
      $.record_pattern,
      $.tuple_pattern,
      seq(lparen, $.witness_pattern, rparen),
      seq(lparen, $._nested_pattern, rparen)
    ),

    record_pattern: $ => prec.right(seq(
      record,
      lbrace,
      optional($.record_pattern_entry),
      repeat(seq(semicolon, optional($.record_pattern_entry))),
      rbrace
    )),

    record_pattern_entry: $ => seq($.identifier, optional(seq(eq, $._nested_pattern))),

    tuple_pattern: $ => prec.right(seq(
      lparen,
      $._nested_pattern,
      comma,
      $._nested_pattern,
      rparen
    )),

    witness_pattern: $ => seq(
      witness,
      $._nested_pattern,
      such_that,
      $._nested_pattern
    ),

    _nested_pattern: $ => choice(
      $._atomic_pattern,
      $.ctor_pattern,
      $.and_pattern,
      $.ind_pattern,
      $.ann_pattern,
    ),

    ctor_pattern: $ => seq(
      repeat1($._atomic_pattern),
      $._atomic_pattern,
    ),

    and_pattern: $ => prec.right(seq(
      $._nested_pattern,
      amp,
      $._nested_pattern
    )),

    ind_pattern: $ => prec.right(seq(ind, $._nested_pattern)),

    ann_pattern: $ => seq(
      $._nested_pattern,
      $.type_ann,
    ),

    _struct_ann: $ => choice(
      $.sub_ann,
      $.type_ann,
    ),

    sub_ann: $ => seq(sub, $._term, repeat(seq(comma, $._term))),

    ctor_ann: $ => prec(1, seq(of, $._term, repeat(seq(comma, prec(1, $._term))))),

    type_ann: $ => seq(colon, prec.left(2, $._term)),

    chaining: $ => seq(chaining, $.begin, repeat($.chain_link), $.end),

    chain_link: $ => prec.left(seq(choice(
      laarrow,
      larrow,
      raarrow,
      rarrow,
      eq,
      equality,
      equivalence,
      prec(11, $._term),
    ), $._term, optional($.by_block))),

    rewrite: $ => seq(rewrite, optional($._direction), $._term, repeat(seq(comma, optional($._direction), $._term))),

    unfold: $ => seq(unfold, $._atomic_pattern, repeat(seq(comma, $._atomic_pattern))),

    _direction: $ => choice(larrow, rarrow),

    cases: $ => seq(cases, $._term, repeat(seq(comma, $._term)), optional(with_)),

    induction: $ => seq(induction, $._term, with_),

    proving: $ => seq(proving, $._term),

    instantiate: $ => seq(instantiate, $._term),

    intro: $ => seq(lambda, optional($.patterns)),

    witness: $ => seq(witness, optional($._term)),

    value: $ => seq(eq, $._term),

    _term: $ => choice(
      $.ann_term,
      $.decl_in,
      $.witness_such_that,
      $.lambda,
      $.case,
      $.clauses,
      $.match_with,
      $.apply,
      $.proving_by,
      $.suffices_by,
      $.exists,
      $.forall,
      $.arrow,
      $.implication,
      $.equivalence,
      $.disjunction,
      $.conjunction,
      $.negation,
      $.equality,
      $.call,
      $.instantiate_with,
      $.tuple,
      $.record_term,
      $.assumption,
      $.number,
      $.char,
      $.string,
      $.identifier,
      $.hole_identifier,
      prec(11, seq(lparen, prec(0, $._term), rparen)),
    ),

    lambda: $ => prec.right(seq(
      lambda,
      optional($.patterns),
      rarrow,
      $._term
    )),

    case: $ => prec.right(seq(
      case_,
      $._term,
      where,  
      $.begin,
      repeat(seq(
        $.separator,
        $.clause
      )),
      $.end
    )),

    clauses: $ => prec.right(seq(
      lambda,
      optional($.patterns),
      where,
      $.begin,
      repeat(seq(
        $.separator,
        $.clause
      )),
      $.end
    )),

    clause: $ => seq($.patterns, rarrow, $._term),

    match_with: $ => prec.right(seq(match, $._term, with_, repeat($.pipe_clause))),

    pipe_clause: $ => seq(pipe, $._nested_pattern, repeat(seq(comma, $._nested_pattern)), Rarrow, $.begin, repeat(seq($.separator, $._proof_step)), $.end),

    ann_term: $ => prec.left(1, seq($._term, colon, $._term)),

    decl_in: $ => prec.right(seq($._proof_decl, in_, $._term)),

    witness_such_that: $ => prec.right(seq(witness, $._term, such_that, $._term)),

    apply: $ => prec.left(seq(apply, $._term, repeat(seq(comma, prec.left($._term))))),

    proving_by: $ => seq(proving, optional($._term), $.by_block),

    suffices_by: $ => seq(suffices, $._term, $.by_block),

    exists: $ => prec.right(seq(exists, optional($.parameters), optional($.type_ann), comma, $._term)),

    forall: $ => prec.right(seq(forall, optional($.parameters), optional($.type_ann), comma, $._term)),

    arrow: $ => prec.right(1, seq($._term, rarrow, $._term)),

    implication: $ => prec.right(1, seq($._term, raarrow, $._term)),

    equivalence: $ => prec.right(2, seq($._term, equivalence, $._term)),

    disjunction: $ => prec.right(3, seq($._term, or, $._term)),

    conjunction: $ => prec.right(4, seq($._term, and, $._term)),

    negation: $ => prec.right(5, seq(negation, $._term)),

    equality: $ => prec.right(seq($._term, choice(eq, equality), $._term)),

    call: $ => prec(10, seq($._term, $._args)),

    _args: $ => prec(11, seq(optional($._args), choice($._term, seq(lbrace, $._term, rbrace)))),

    instantiate_with: $ => prec(11, seq(instantiate, $._term, with_)),

    tuple: $ => prec(11, seq(lparen, optional(seq($._term, repeat1(seq(comma, $._term)))), rparen)),

    record_term: $ => prec(11, seq(
      record,
      optional(seq($._term, with_)),
      choice(
        seq(
          lbrace,
          optional($._declaration),
          repeat(seq(semicolon, optional($._declaration))),
          rbrace
        ),
        $.where_block
      )
    )),

    assumption: $ => assumption,
  }
});
