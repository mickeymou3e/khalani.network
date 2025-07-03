let files = {
    "/custom-method.axi": {
        fname: "custom-method.axi",
        value: `
const a: Boolean;

let assumption = ~~a;
assume assumption {
    proc my_dn(x) {
        !dn(x)
    }
    let my_dn1 = |x| { !my_dn(x) };
    let scope_2 = |x| {
        let my_dn = || {
            !invalid(
            foo,
            bar,
            baz,
            )
        };
        # Test that my_dn in my_dn1 is referring to the one in the parent scope.
        !my_dn1(assumption)
    };
    let my_dn = || { !invalid() };
    !my_dn1(assumption)
}
!my_dn1(assumption)


`
    },
    "/by-contradiction.axi": {
        fname: "by-contradiction.axi",
        value:
            `const a: Boolean;

      proc by_contradiction(p) {
          !false_elim();
          !mt(p)
      }
      
      # Prove law of excluded-middle
      let ex = a | ~a;
      !dn(!by_contradiction(assume ~ex {
          !by_contradiction(
              assume a {
                  !left_either(a, ~a);
                  !absurd(ex, ~ex)
              }
          );
          !right_either(a, ~a);
          !absurd(ex, ~ex)
      }));
      
      const c: Boolean;
      const d: Boolean;
      
      # c or d => not c => d
      assume c | d {
          assume ~c {
              !dn(!by_contradiction(assume ~d {
                  let if_c_false = assume c {
                      !absurd(c, ~c)
                  };
                  let if_d_false = assume d {
                      !absurd(d, ~d)
                  };
                  !cd(if_c_false, if_d_false)
              }))
          }
      }
      
    `
    },
    "/sets.axi": {
        fname: "sets.axi",
        value: `domain Set;

    function in(a: Set, b: Set) -> Boolean;
    
    # Some useful stuff.
    
    # Procedures can be used as syntax sugars.
    proc notin(a, b) {
        ~a in b
    }
    
    # set_def_is(S, P) is basically S = {x | P(x)}.
    proc set_def_is(S, P) {
        forall x: Set. (x in S <==> P(x))
    }
    
    # x in S then P(x)
    proc by_set_def(S, P, x) {
        !mp(!left_iff(!uspec(set_def_is(S, P), x)))
    }
    
    # P(x) then x in S
    proc member_by_def(S, P, x) {
        !mp(!right_iff(!uspec(set_def_is(S, P), x)))
    }
    
    # End some useful stuff.
    
    # Axiom schema of specification.
    proc spec(P) {
        !assert(forall z: Set. exists y: Set. set_def_is(y, |x| x in z & P(x, z)))
    }
    
    # Exists { x in z | P(x) }
    proc subset(z, P) {
        !uspec(!spec(|x, z| P(x)), z)
    }
    
    # Prove that there doesn't exist the universal set in ZF by Russell's paradox.
    {
        let e_universal = exists s: Set. forall x: Set. x in s;
        !false_elim();
        !mt(assume e_universal {
            pick_witness u. e_universal;
    
            pick_witness y. !subset(u, |x| x notin x);
            let yprop = |x| x in u & x notin x;
    
            # y notin y
            !mt(assume y in y {
                # y notin y.
                !right_and(!by_set_def(y, yprop, y));
                !absurd(y in y, y notin y);
            });
    
            # y in u
            !uspec(forall x: Set. x in u, y);
            !both(y in u, y notin y);
            # y in y.
            !member_by_def(y, yprop, y);
            !absurd(y in y, y notin y);
        });
    }
    
    let ext = !assert(forall x: Set, y: Set. (forall z: Set. (z in x <==> z in y) ==> x = y));
    
    let pair = !assert(forall x: Set, y: Set. exists z: Set. set_def_is(z, |a| a = x | a = y));
    
    let union_axiom = !assert(forall A: Set. exists B: Set. set_def_is(B, |c| exists D: Set. and(c in D, D in A)));
    
    function S(a: Set) -> Set;
    
    let inf = !assert(exists X: Set. (
        exists e: Set. (forall z: Set. z notin e & e in X) &
        forall y: Set. (y in X ==> S(y) in X)
    ));
    
    # TODO: reg, power, replacement.
    
    # Given set_def_is(S, P), prove that
    # forall S1. (set_def_is(S1, P) ==> S1 = S)
    proc prove_unique(S, P) {
        pick_any S1: Set {
            assume set_def_is(S1, P) {
                pick_any x: Set {
                    assume x in S1 {
                        !by_set_def(S1, P, x);
                        !member_by_def(S, P, x);
                    }
                    assume x in S {
                        !by_set_def(S, P, x);
                        !member_by_def(S1, P, x);
                    }
                    !equiv(x in S1, x in S)
                }
                !mp(!uspec(!uspec(ext, S1), S));
                !claim(S1 = S)
            }
        }
    }
    
    proc exists_unique(P) {
        exists x: Set. (P(x) & forall y: Set. (P(y) ==> y = x))
    }
    
    # If S = {x | P(x)}, prove that there exists exactly one such S.
    proc prove_unique_that(P, S) {
        !both(set_def_is(S, P), !prove_unique(S, P));
        !egen(exists_unique(|S| set_def_is(S, P)), S)
    }
    
    # Intersection.
    pick_any a: Set, b: Set {
        pick_witness aIb. !subset(a, |x| x in b);
        !prove_unique_that(|x| x in a & x in b, aIb)
    }
    # Having proved the unique existance, this is an extension by definition.
    function intersection(a: Set, b: Set) -> Set;
    !assert(forall a: Set, b: Set, c: Set. (
        c = intersection(a, b) <==> set_def_is(c, |x| x in a & x in b)
    ));
    
    # Union.
    pick_any a: Set, b: Set {
        pick_witness ab. !uspec(!uspec(pair, a), b);
        let ab_prop = |x| x = a | x = b;
        pick_witness aUb. !uspec(union_axiom, ab);
        let aUb_prop = |x| exists d: Set. (x in d & d in ab);
        pick_any x: Set {
            assume x in a | x in b {
                !cd(assume x in a {
                    !left_either(!reflex(a), a = b);
                    !member_by_def(ab, ab_prop, a);
                    !both(x in a, a in ab);
                    !egen(exists a: Set. (x in a & a in ab), a);
                }, assume x in b {
                    !right_either(b = a, !reflex(b));
                    !member_by_def(ab, ab_prop, b);
                    !both(x in b, b in ab);
                    !egen(exists b: Set. (x in b & b in ab), b);
                });
                !member_by_def(aUb, aUb_prop, x);
            }
            assume x in aUb {
                # x in d & d in ab
                pick_witness d. !by_set_def(aUb, aUb_prop, x);
                !left_and(x in d & d in ab);
                !right_and(x in d & d in ab);
                # d = a | d = b
                !by_set_def(ab, ab_prop, d);
                !cd(assume d = a {
                    !rcong(x in d, x in a);
                    !left_either(x in a, x in b)
                }, assume d = b {
                    !rcong(x in d, x in b);
                    !right_either(x in a, x in b)
                });
            }
            !equiv(x in aUb, x in a | x in b)
        };
        !prove_unique_that(|x| x in a | x in b, aUb)
    }
    # Definition.
    function union(a: Set, b: Set) -> Set;
    !assert(forall a: Set, b: Set, c: Set. (
        c = union(a, b) <==> set_def_is(c, |x| x in a | x in b)
    ));
    
    `
    }
};

// let tutorialFiles = {
//     "/step1_inductive_proof.axi": {
//         fname: "step1_inductive_proof.axi",
//         value: `load "nat-minus"
// load "nat-minus"
// module Factorial {

//   define [< - * one <=] := [N.< N.- N.* N.one N.<= ]

//   declare factorial: [N] -> N [[int->nat]]
//   (transform-output eval [nat->int])

//   assert f_zero := (forall x . x = zero ==> factorial x = one)

//   assert f_x := (forall x . one < x ==> (factorial x) = (x * (factorial (x - one))))

//   assert f_one := (forall x . one = x ==> (factorial x) = one)

//   (eval (factorial 4))
//   (eval (factorial 5))

//   define nothing-less-than-zero := (forall x . ~ x < zero)

//   define f_x_less_than := (forall x . factorial (x - one) <= factorial x )
//   define lte-def := (forall x y . (x <= y <==> x < y | x = y))

//   by-induction f_x_less_than {
//       zero => conclude base_case := (factorial (zero - one) <= factorial zero)
//                   (!force base_case)


//       | (m as (S n)) => conclude inductive_step := ((factorial (m - one)) <= (factorial m))
//                   (!force inductive_step)
//   }
// }`
//     },
//     "/step2_inductive_proof.axi": {
//         fname: "step2_inductive_proof.axi",
//         value: `load "nat-minus"
// module Factorial {

//   define [< - * one <=] := [N.< N.- N.* N.one N.<= ]

//   declare factorial: [N] -> N [[int->nat]]
//   (transform-output eval [nat->int])

//   assert f_zero := (forall x . x = zero ==> factorial x = one)

//   assert f_x := (forall x . one < x ==> (factorial x) = (x * (factorial (x - one))))

//   assert f_one := (forall x . one = x ==> (factorial x) = one)

//   (eval (factorial 4))
//   (eval (factorial 5))

//   define nothing-less-than-zero := (forall x . ~ x < zero)

//   define f_x_less_than := (forall x . factorial (x - one) <= factorial x )
//   define [lte-def] := N.Less=.<=-def

//   by-induction f_x_less_than {
//       zero => conclude base_case := (factorial (zero - one) <= factorial zero)
//                       let {
//                           zero-lt-one := (!chain-> [true ==> (zero < (S zero)) [N.Less.zero<S] ==> (zero < one) [(one = (S zero))]]);
//                           zero<one_or_zero=one := (!left-either (zero < one) (zero = one));
//                           f_zero-1_eq_f_zero := (!chain [
//                               (factorial (zero - one))
//                                   = (factorial zero)  [N.Minus.zero-left] 
//                           ]);
//                           f_zero-1_eq_or_lt_f_zero := (!right-either (factorial (zero - one) < (factorial zero))  f_zero-1_eq_f_zero)
//                       }
//                       (!mp (!right-iff (!uspec* lte-def [(factorial (zero - one)) (factorial zero) ])) f_zero-1_eq_or_lt_f_zero)


//       | (m as (S n)) => conclude inductive_step := ((factorial (m - one)) <= (factorial m))
//                   let {
//                       ih := ((factorial (n - one)) <= (factorial n));
//                       _ := (!claim ih)
//                   }
//                   (!force inductive_step)
//   }
// }`
//     }
// }

let rootFiles = {
    "/scratchpad.axi": {
        fname: "scratchpad.axi",
        value: ` assume not(not(?a)) {
        !dn(not(not(?a)))
    };
    
    assume ?a {
        assume ?b {
            !both(?a, ?b)
        }
    };
    
    assume ?a {
        assume ?b {
            !left-and(!both(?b, ?a))
        }
    };
    
    assume and(?a, ?b) {
        !left-and(and(?a, ?b));
        !left-either(?a, ?c)
    };
    
    assume implies(or(?a, ?c), ?d) {
        assume and(?a, ?b) {
            !left-and(and(?a, ?b));
            !left-either(?a, ?c);
            !mp(implies(or(?a, ?c), ?d))
        }
    };
    
    assume implies(?a, ?b) {
        assume implies(?b, ?a) {
            !equiv(?a, ?b)
        }
    };
    
    assume bicond(?a, ?b) {
        let x = !left-iff(bicond(?a, ?b));
        let y = !right-iff(bicond(?a, ?b));
        !both(x, y)
    };
    
    # Test duplicated assume.
    assume ?a {
        assume ?a {
            !claim(?a)
        };
        !right-either(?b, ?a)
    }
    
      `
    }
}

let tutorialFiles = {
    "/1-basics-and-propositional-logic.axi": {
        fname: "1-basics-and-propositional-logic.axi",
        value: `
# Axi supports reasoning in the natural deduction style.
#
# We will declare some opaque propositions to reason about. Later we'll see that
# they are actually constant terms of a special type Boolean when we talk about
# first-order logic.

const a: Boolean;
const b: Boolean;
const c: Boolean;
const d: Boolean;

# There is a global assumption base that contains all the axioms and all the
# theorems that has been proved so far.
#
# An assume block
#
# # This proves p ==> q.
# assume p {
#     ...
#     !claim(q)
# }
#
# inserts p into the assumption base and run the proofs in the block. After the
# block is finished, p and anything proved in the block will be removed from the
# assumption base. A final conclusion should be proved by the block. Let's say
# it's q, then p ==> q is proved by the whole assume block and added to the
# assumption base.

assume ~~a {
    # Expressions that start with a bang (!) is a deduction procedure
    # invocation. It will prove something, return it, and add it to the
    # assumption base.
    #
    # dn is double-negation, dn(~~a) proves a, given that ~~a is in the
    # assumption base.
    #
    # Like rust, the result of the last expression of a block is the result of
    # the whole block. You should not add a semicolon to the last expression.
    !dn(~~a)
}

assume a {
    assume b {
        # both proves a & b, given that a and b are both in the assumption base.
        !both(a, b)
    }
}

assume a {
    assume b {
        # left_and(b & a) proves b, given that b & a is in the assumption base.
        #
        # You can probably guess that there's also right_and(b & a) which proves
        # a.
        #
        # A deduction procedure invocation will return its conclusion, so we can
        # pass it to other deduction procedures. Here the conclusion of both(b,
        # a), (b & a) is passed to left_and.
        !left_and(!both(b, a))
    }
}

assume a & b {
    !left_and(a & b);
    # left_either(a, c) prove a || c, given that a is in the assumption base.
    #
    # There's also right_either.
    !left_either(a, c)
}

assume a | c ==> d {
    assume a & b {
        !left_and(a & b);
        !left_either(a, c);
        # mp(p ==> q) proves q, given that both p and p ==> q are in the
        # assumption base.
        !mp(a | c ==> d)
    }
}

assume a ==> b {
    assume b ==> a {
        # equiv(a, b)assumption block proves a <==> b, given that both a ==> b and b ==> a are
        # in the assumption base.
        !equiv(a, b)
    }
}

assume a <==> b {
    # left_iff(a <==> b) proves a ==> b from a <==> b.
    #
    # Let bindings can be used to bind propositions to identifiers.
    let x = !left_iff(a <==> b);
    # reft_iff(a <==> b) proves b ==> a from a <==> b.
    let y = !right_iff(a <==> b);
    !both(x, y)
}        
`
    },
    "/2-procedures.axi": {
        fname: "2-procedures.axi",
        value: `
# User defined procedures

const a: Boolean;
const b: Boolean;
const c: Boolean;
const d: Boolean;

# Procedures can take propositions and return a proposition:

proc and3(x, y, z) {
    x & y & z
}

and3(a, b, c); # a & b & c

# They can also perform deductions and prove a conclusion. In this case, the
# procedure is a deduction procedure. All the deductions inside the procedure
# must be valid according to the assumption base at the time of invocation.

# This procedures proves a & b & c from a, b and c:

proc prove_and3(x, y, z) {
    !both(!both(x, y), z)
}

assume a {
    assume b {
        assume c {
            !prove_and3(a, b, c)
        }
    }
}

# Procedures can be nested and they follow the usual lexical scoping rules:

proc and3_nested(x, y, z) {
    proc xy() {
        x & y
    }

    xy() & z
}

and3_nested(a, b, c);

# Procedures can also take other procedures:
proc and3_higher_order(xy, x, y, z) {
    xy(x, y) & z
}

# Anonymous procedures can be defined with a syntax similar to rust closures and
# passed to higher order procedures:
and3_higher_order(|x, y| x & y, a, b, c);

        `
    },
    "/3-first-order-logic.axi": {
        fname: "3-first-order-logic.axi",
        value: `
# Besides propositional logic, Axi also supports (many-sorted) first-order
# logic.
#
# There are some builtin sorts like Boolean and Nat (natural numbers), you can
# declare other sorts with the domain keyword:

domain N;

# You can declare functions and predicates. Predicates are functions whose
# return type is Boolean.

function P(x: N) -> Boolean;
function Q(x: N) -> Boolean;
function R(x: N, y: N) -> Boolean;

# The syntax for universal and existential quantified propositions is like this:

let all_p = forall x: N. P(x);
exists x: N. (Q(x) & R(x, x));

# You can prove a universal quantified proposition with pick_any, and use a
# universal quantified proposition with uspec:
assume forall x: N. P(x) {
    pick_any y: N {
        !uspec(all_p, y) # Proves P(y).
    }
}

# The above expression proves that:
!claim(forall x: N. P(x) ==> forall y: N. P(y));

# Which is the same as
!claim(forall x: N. P(x) ==> forall x: N. P(x));
# because they are alpha-equivalent.

# The following proves that if a relation is irreflexive and transitive, it is
# not symmetrical:
let irreflex = forall x: N. ~R(x, x);
let trans = forall x: N, y: N, z: N. (R(x, y) & R(y, z) ==> R(x, z));
let not_sym = forall x: N, y: N. (R(x, y) ==> ~R(y, x));
assume irreflex {
    assume trans {
        pick_any a: N, b: N {
            assume R(a, b) {
                !false_elim();
                !mt(assume R(b, a) {
                    !both(R(a, b), R(b, a));
                    let a_less_a = !mp(!uspec(!uspec(!uspec(trans, a), b), a));
                    !absurd(!uspec(irreflex, a), a_less_a)
                })
            }
        }
    }
}
!claim(irreflex ==> trans ==> not_sym);

# You can prove and use existential quantified propositions with egen and pick_witness:
assume exists x: N. P(x) {
    pick_witness y . exists x: N. P(x);
    # egen(exists z. P(z), y) checks that P(y) is in the assumption base.
    !egen(exists z: N. P(z), y);
}
!claim(exists x: N. P(x) ==> exists x: N. P(x));

# Procedures can take terms and return terms or propositions:
proc pq(x) {
    P(x) & Q(x)
}
forall x: N. pq(x);

function f(x: N) -> N;
proc ff(x) {
    f(f(x))
}
forall x: N. P(ff(x));

        `
    },
    "/4-equational-reasoning.axi": {
        fname: "4-equational-reasoning.axi",
        value: `
# The equality relation = is builtin in Axi, and the usual axiom (schemas) for
# equality are provided as builtin deduction procedures.

domain N;

function f(x: N) -> N;
function g(x: N, y: N) -> N;
function h(x: N) -> N;

# The primitive deduction procedures for working with equality are fcong and
# rcong.

pick_any a: N, b: N, c: N, d: N {
    assume a = c {
        assume b = d {
            # fcong(f(a1, a2, ..., an), f(b1, b2, ..., bn)) proves that the two
            # terms are equal by checking that a1 = b1, a2 = b2, ..., an = bn.
            !fcong(a g b, c g d)
        }
    }
}

pick_any a: N, b: N, c: N {
    assume a = b {
        assume b = c {
            # rcong(R(a1, a2, ..., an), R(b1, b2, ..., bn)) proves R(b1, b2,
            # ..., bn) by checking that R(a1, a2, ..., an) is in the assumption
            # base and that a1 = b1, a2 = b2, ..., an = bn.
            !rcong(a = b, a = c)
        }
    }
}

# There is also eq_chain that performs equality chaining. It's often more
# convenient than fcong and rcong.

pick_any a: N {
    # You can prove that anything is equal to itself with eq_chain.
    !eq_chain(a, a)
}

pick_any a: N, b: N, c: N, d: N {
    assume a = c {
        assume b = d {
            # You can prove that terms are equal because the arguments are equal.
            !eq_chain(c g d, a g b)
        }
    }
}

pick_any a: N, b: N, c: N {
    assume g(a, b) = f(b) {
        assume b = h(c) {
            # eq_chain(A, B, C) proves A = C if it can prove that A = B and B = C.
            !eq_chain(
                g(a, b),
                f(b),
                f(h(c)),
            )
        }
    }
}
`

    },
    "/5-inductive-types-and-functions.axi": {
        fname: "5-inductive-types-and-functions.axi",
        value: `
# In addition to opaque domains, you can also declare inductive types.
#
# There is a builtin inductive type Nat:

# inductive Nat {
#     Zero,
#     Succ(Nat),
# }

# You can define (recursive) functions for inductive types with pattern
# matching. This is how the builtin addition function is defined:

# function add(x: Nat, y: Nat) -> Nat {
#     match y {
#         Zero => x,
#         Succ(z) => Succ(x add z),
#     }
# }

# This function will be translated to the following axioms:

let add_zero = forall x: Nat. x add Zero = x;
let add_succ = forall x: Nat, y: Nat. x add Succ(y) = Succ(x add y);
!claim(add_zero);
!claim(add_succ);

# You can prove theorems about these recursive functions with proof by
# induction:

let zero_add = by_induction x: Nat. Zero add x = x {
    Zero => !uspec(add_zero, Zero),
    Succ(y) => {
        # Here you have the induction hypothesis Zero add y = y,
        # and you need to prove Zero add Succ(y) = Succ(y).
        !uspec(!uspec(add_succ, Zero), y);
        !eq_chain(
            Zero add Succ(y),
            Succ(Zero add y), # proved last step
            Succ(y), # induction hypothesis
        )
    }
};
!claim(zero_add);
        
`
    }

}

let dirs = {
    "Examples": files,
    "Logic-Tutorial": tutorialFiles,
    "/": rootFiles,
};

export default dirs;
