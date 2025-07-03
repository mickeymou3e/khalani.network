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

let add_zero := forall x: Nat. x add Zero = x;
let add_succ := forall x: Nat, y: Nat. x add Succ(y) = Succ(x add y);
!claim(add_zero);
!claim(add_succ);

# You can prove theorems about these recursive functions with proof by
# induction:

let zero_add := by_induction x: Nat. Zero add x = x {
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
