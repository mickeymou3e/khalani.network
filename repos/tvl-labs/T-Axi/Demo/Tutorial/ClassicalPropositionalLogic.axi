// We declare some propositions that we will use in the rest of this file.
declaration P Q R : Prop

// The built-in way of classical reasoning is `by-contradiction x : ~ P in e`,
// which proves `P` provided that `e` proves `False` in context extended with
// the assumption `x : ~ P`.
// We can use `by-contradiction` to prove all the classical laws,
// like double negation elimination.
theorem double-negation :
  ~ ~ P --> P
proof                                  // |- ~ ~ P --> P
  assume nnp : ~ ~ P                   // nnp : ~ ~ P |- P
  by-contradiction np : ~ P            // nnp : ~ ~ P, np : ~ P |- False
  contradiction nnp np                 // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem double-negation-term-style : ~ ~ P --> P =
  assume nnp : ~ ~ P in
    by-contradiction np : ~ P in
      contradiction nnp np

// Note that just like for assume, we can omit the annotation.
theorem double-negation-no-annotation :
  ~ ~ P --> P
proof
  assume nnp
  by-contradiction np
  contradiction nnp np
qed

// Law of Excluded Middle.
theorem lem : P \/ ~ P
proof                                  // |- P \/ ~ P
  by-contradiction no : ~ (P \/ ~ P)   // no : ~ (P \/ ~ P) |- False
  apply no                             // no : ~ (P \/ ~ P) |- P \/ ~ P
  or-right                             // no : ~ (P \/ ~ P) |- ~ P
  assume p                             // no : ~ (P \/ ~ P), p : P |- False
  apply no                             // no : ~ (P \/ ~ P), p : P |- P \/ ~ P
  or-left                              // no : ~ (P \/ ~ P), p : P |- P
  assumption                           // Theorem proved!
qed

// You might have already noticed that it's a frequent idiom to first
// use `by-contradiction` and then `apply` right away. This pattern of
// reasoning is called "Consequentia Mirabilis" and can be encapsulated
// in a theorem.
theorem cm : (~ P --> P) --> P
proof                                  // |- (~ P --> P) --> P
  assume npp : ~ P --> P               // npp : (~ P --> P) |- P
  by-contradiction np : ~ P            // npp : (~ P --> P), np : ~ P |- False
  apply np, npp                        // npp : (~ P --> P), np : ~ P |- ~ P
  assumption                           // Theorem proved!
qed

// Peirce's law.
theorem peirce :
  ((P --> Q) --> P) --> P
proof                                  // |- ((P --> Q) --> P) --> P
  assume pqp : (P --> Q) --> P         // pqp : ((P --> Q) --> P) |- P
  by-contradiction np : ~ P            // pqp : ((P --> Q) --> P), np : ~ P |- False
  apply np, pqp                        // pqp : ((P --> Q) --> P), np : ~ P |- P --> Q
  assume p                             // pqp : ((P --> Q) --> P), np : ~ P, p : P |- Q
  absurd                               // pqp : ((P --> Q) --> P), np : ~ P, p : P |- False
  contradiction np p                   // Theorem proved!
qed

// Of the two laws of contraposition, this one is only valid classically.
theorem classic-contraposition :
  (~ Q --> ~ P) --> (P --> Q)
proof                                  // |- (~ Q --> ~ P) --> (P --> Q)
  assume nqnp p                        // nqnp : ~ Q --> ~ P, p : P |- Q
  by-contradiction nq                  // nqnp : ~ Q --> ~ P, p : P, nq : ~ Q |- False
  apply nqnp nq p                      // Theorem proved!
qed

// There's also a funny classic version of contraposition.
theorem classic-funny-contraposition :
  (~ P --> Q) --> (~ Q --> P)
proof                                  // |- (~ P --> Q) --> (~ Q --> P)
  assume (npq : ~ P --> Q) (nq : ~ Q)  // npq : ~ P --> Q, nq : ~ Q |- P
  by-contradiction np : ~ P            // npq : ~ P --> Q, nq : ~ Q, np : ~ P |- False
  apply nq, npq                        // npq : ~ P --> Q, nq : ~ Q, np : ~ P |- ~ P
  assumption                           // Theorem proved!
qed

// In classical logic, if `P` implies `Q`, either `P` is false or `Q` is true.
theorem material-implication-intro :
  (P --> Q) --> ~ P \/ Q
proof                                  // |- (P --> Q) --> ~ P \/ Q
  assume pq : P --> Q                  // pq : P --> Q |- ~ P \/ Q
  by-contradiction no : ~ (~ P \/ Q)   // pq : P --> Q, no : ~ (~ P \/ Q) |- False
  apply no                             // pq : P --> Q, no : ~ (~ P \/ Q) |- ~ P \/ Q
  or-left                              // pq : P --> Q, no : ~ (~ P \/ Q) |- ~ P
  assume p                             // pq : P --> Q, no : ~ (~ P \/ Q), p : P |- False
  apply no                             // pq : P --> Q, no : ~ (~ P \/ Q), p : P |- ~ P \/ Q
  or-right                             // pq : P --> Q, no : ~ (~ P \/ Q), p : P |- Q
  apply pq                             // pq : P --> Q, no : ~ (~ P \/ Q), p : P |- P
  p                                    // Theorem proved!
qed

// In classical logic, when choosing which disjunct to prove,
// we can assume the other disjunct is false.
theorem weak-or-elim :
  (~ P --> Q) --> P \/ Q
proof                                  // |- (~ P --> Q) --> P \/ Q
  assume npq : ~ P --> Q               // npq : ~ P --> Q |- P \/ Q
  by-contradiction no : ~ (P \/ Q)     // npq : ~ P --> Q, no : ~ (P \/ Q) |- False
  apply no                             // npq : ~ P --> Q, no : ~ (P \/ Q) |- P \/ Q
  or-right                             // npq : ~ P --> Q, no : ~ (P \/ Q) |- Q
  apply npq                            // npq : ~ P --> Q, no : ~ (P \/ Q) |- ~ P
  assume p                             // npq : ~ P --> Q, no : ~ (P \/ Q), p : P |- False
  apply no                             // npq : ~ P --> Q, no : ~ (P \/ Q), p : P |- P \/ Q
  or-left                              // npq : ~ P --> Q, no : ~ (P \/ Q), p : P |- P
  p                                    // Theorem proved!
qed

// In classical logic, to prove a conjunction it suffices to prove it's
// impossible that either conjunct is false.
theorem and-from-weak-and :
  ~ (~ P \/ ~ Q) --> P /\ Q
proof                                  // |- ~ (~ P \/ ~ Q) --> P /\ Q
  assume pq : ~ (~ P \/ ~ Q)           // pq : ~ (~ P \/ ~ Q) |- P /\ Q
  by-contradiction npq : ~ (P /\ Q)    // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q) |- False
  apply pq                             // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q) |- ~ P \/ ~ Q
  or-left                              // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q) |- ~ P
  assume p : P                         // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q), p : P |- False
  apply pq                             // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q), p : P |- ~ P \/ ~ Q
  or-right                             // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q), p : P |- ~ Q
  assume q : Q                         // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q), p : P, q : Q |- False
  apply npq                            // pq : ~ (~ P \/ ~ Q), npq : ~ (P /\ Q), p : P, q : Q |- P /\ Q
  both p q                             // Theorem proved!
qed

theorem xor-not-iff-conv :
  ~ ((P /\ ~ Q) \/ (~ P /\ Q)) --> P <--> Q
proof                                  // |- ~ ((P /\ ~ Q) \/ (~ P /\ Q)) --> P <--> Q
  assume nxor                          // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)) |- P <--> Q
  both
                                       // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)) |- P --> Q
  . assume p                           // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), p : P |- Q
    by-contradiction nq                // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), p : P, nq : ~ Q |- False
    apply nxor                         // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), p : P, nq : ~ Q |- (P /\ ~ Q) \/ (~ P /\ Q)
    or-left                            // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), p : P, nq : ~ Q |- P /\ ~ Q
    both p nq                          // Goal solved!
                                       // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)) |- Q --> P
  . assume q                           // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), q : Q |- P
    by-contradiction np                // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), q : Q, np : ~ P |- False
    apply nxor                         // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), q : Q, np : ~ P |- (P /\ ~ Q) \/ (~ P /\ Q)
    or-right                           // nxor : ~ ((P /\ ~ Q) \/ (~ P /\ Q)), q : Q, np : ~ P |- ~ P /\ Q
    both np q                          // Theorem proved!
qed

// In classical logic, `P xor Q` follows from the fact that they aren't
// logically equivalent.
theorem xor-not-iff :
  ~ (P <--> Q) --> (P /\ ~ Q) \/ (~ P /\ Q)
proof                                  // |- ~ (P <--> Q) --> (P /\ ~ Q) \/ (~ P /\ Q)
  classic-funny-contraposition         // |- ~ ((P /\ ~ Q) \/ (~ P /\ Q)) --> P <--> Q
  xor-not-iff-conv                     // Theorem proved!
qed

// In classical logic, propositions are linearly ordered by implication.
theorem godel-dummet :
  (P --> Q) \/ (Q --> P)
proof                                  // |- (P --> Q) \/ (Q --> P)
  by-contradiction h                   // h : ~ ((P --> Q) \/ (Q --> P)) |- False
  apply h                              // h : ~ ((P --> Q) \/ (Q --> P)) |- (P --> Q) \/ (Q --> P)
  or-left                              // h : ~ ((P --> Q) \/ (Q --> P)) |- P --> Q
  assume p                             // h : ~ ((P --> Q) \/ (Q --> P)), p : P |- Q
  absurd                               // h : ~ ((P --> Q) \/ (Q --> P)), p : P |- False
  apply h                              // h : ~ ((P --> Q) \/ (Q --> P)), p : P |- (P --> Q) \/ (Q --> P)
  or-right                             // h : ~ ((P --> Q) \/ (Q --> P)), p : P |- Q --> P
  assume _                             // h : ~ ((P --> Q) \/ (Q --> P)), p : P |- P
  assumption                           // Theorem proved!
qed

// Premise independence for disjunction.
theorem premise-independence :
  (P --> Q \/ R) --> (P --> Q) \/ (P --> R)
proof                                  // |- (P --> Q \/ R) --> (P --> Q) \/ (P --> R)
  assume pqr : P --> Q \/ R            // pqr : P --> Q \/ R |- (P --> Q) \/ (P --> R)
  by-contradiction no                  // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)) |- False
  apply no                             // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)) |- (P --> Q) \/ (P --> R)
  or-left                              // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)) |- P --> Q
  assume p                             // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P |- Q
  absurd                               // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P |- False
  apply no                             // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P |- (P --> Q) \/ (P --> R)
  cases (apply pqr p)
                                       // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P |- Q --> (P --> Q) \/ (P --> R)
  . assume q                           // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, q : Q |- (P --> Q) \/ (P --> R)
    or-left                            // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, q : Q |- P --> Q
    assume _                           // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, q : Q |- Q
    assumption                         // Goal solved!
                                       // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P |- R --> (P --> Q) \/ (P --> R)
  . assume r                           // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, r : R |- (P --> Q) \/ (P --> R)
    or-right                           // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, r : R |- P --> R
    assume _                           // pqr : P --> Q \/ R, no : ~ ((P --> Q) \/ (P --> R)), p : P, r : R |- R
    assumption                         // Theorem proved!
qed