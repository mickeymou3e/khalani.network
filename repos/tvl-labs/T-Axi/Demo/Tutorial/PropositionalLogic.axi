// The syntax of propositions is as follows:
// P, Q ::= True | False | P --> Q | P /\ Q | P \/ Q | P <--> Q

// We declare some propositions that we will use in the rest of this file.
declaration P Q R : Prop

// "P implies Q" is written as `P --> Q`.
// `assume p : P in q` proves `P --> Q` provided that `q` proves `Q`
// in the context extended with `p : P`, i.e. assuming `P` is true.
// In other words, `assume` is implication introduction.
theorem impl-refl-term-style : P --> P =
  assume p : P in p

// The above proof was written in proofterm style, like in DPLs/Athena,
// but we can also write proofs in tactic style, like in Coq or Lean.
// Moreover, the tactic style directly corresponds to the proofterm style,
// unlike in Coq or Lean. The mechanism is as follows: if we have a proofterm
// that takes one argument, like `tactic arg`, we can instead write it as a block
// ```
// tactic
// arg
// ```
// If the second argument is preceded by a keyword, like `in` or `by`, we can
// omit the keyword. Note that the proofterm doesn't need to be unary - it
// just needs to be applied enough so that only the last argument is missing.
// Also note that in tactic style, proofs appear in blocks delimited by the
// keywords `proof` and `qed`, and there is no `=` after the theorem statement.
// To make proofs written in tactic style easier to understand, we will annotate
// them with comments of the form `context |- goal`, which show at every step
// what is the current context (i.e. what objects are we dealing with and what
// are our assumptions about them) and the current goal (i.e. what are we trying
// to prove). Sometimes, and in particular the example below, we will also have
// "metacomments" which explain each of these annotations.
theorem impl-refl : P --> P
proof                                  // |- P --> P       // When we start the proof, context is empty and the goal is the theorem statement.
  assume p : P                         // p : P |- P       // When we make an assumption, it gets moved to the context.
  p                                    // Theorem proved!  // When the theorem is proved, the message "Theorem proved!" is displayed.
qed

// Let's see another example. In tactic style:
theorem weakening : P --> Q --> P
proof                                  // |- P --> Q --> P
  assume p : P                         // p : P |- Q --> P
  assume q : Q                         // p : P, q : Q |- P
  p                                    // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem weakening-term-style : P --> Q --> P =
  assume p : P in
    assume q : Q in
      p

// When two or more `assume`s follow each other, we can condense them into one,
// with each assumption going in separate parentheses.
theorem assume-two : P --> Q --> P
proof                                  // |- P --> Q --> P
  assume (p : P) (q : Q)               // p : P, q : Q |- P  // Both assumptions get introduced at once.
  p                                    // Theorem proved!
qed

// When we `assume` the same proposition twice, we don't even need parentheses.
theorem assume-two-same : P --> P --> P
proof
  assume p1 p2 : P
  p1
qed

// When we need to introduce an assumption that won't be used, we can discard
// it by writing an underscore.
theorem assume-discard : P --> Q --> P
proof                                  // |- P --> Q --> P
  assume (p : P) _                     // p : P |- P        // The second assumption is discarded and doesn't make it into the context.
  p                                    // Theorem proved!
qed

// We don't need to write down the proposition we are assuming, since it can be
// inferred from the theorem statement.
theorem assume-no-annotation : P --> Q --> P
proof
  assume p q
  p
qed

// If we want to avoid writing `assume` alltogether, we can put the premises
// before the final colon.
theorem no-assume (p : P) (q : Q) : P =
  p

// If we don't want to bother with recalling assumption names, we can say
// `assumption` instead.
theorem assumption-example :
  P --> Q --> P
proof                                  // |- P --> Q --> P
  assume p q                           // p : P, q : Q |- P
  assumption                           // Theorem proved!
qed

// `apply` is implication elimination, also known as modus ponens.
// `apply f e` proves `Q` provided that
// `f` proves `P --> Q` and that
// `e` proves `P`.
theorem impl-elim :
  (P --> Q) --> P --> Q
proof                                  // |- (P --> Q) --> P --> Q
  assume pq p                          // pq : P --> Q, p : P |- Q
  apply pq p                           // Theorem proved!
qed

// We can also use `apply` with more arguments when the implication is longer.
theorem apply-many-args :
  (P --> Q --> R) --> (Q --> P --> R)
proof                                  // |- (P --> Q --> R) --> (Q --> P --> R)
  assume pqr q p                       // pqr : P --> Q --> R, q : Q, p : P |- R
  apply pqr p q                        // Theorem proved!
qed

// The above proof is equivalent to the more primitive one below.
theorem apply-many-args' :
  (P --> Q --> R) --> (Q --> P --> R)
proof
  assume pqr q p
  apply (apply pqr p) q
qed

// Just like for `assume`, `apply` can also be written in tactic style.
theorem impl-trans :
  (P --> Q) --> (Q --> R) --> (P --> R)
proof                                  // |- (P --> Q) --> (Q --> R) --> (P --> R)
  assume pq qr p                       // pq : P --> Q, qr : Q --> R, p : P |- R
  apply qr                             // pq : P --> Q, qr : Q --> R, p : P |- Q
  apply pq                             // pq : P --> Q, qr : Q --> R, p : P |- P
  p                                    // Theorem proved!
qed

// When we need to use `apply` a few times in a row, we can condense it
// into a single line, with arguments separated by commas.
theorem apply-chaining :
  (P --> Q) --> (Q --> R) --> (P --> R)
proof                                  // |- (P --> Q) --> (Q --> R) --> (P --> R)
  assume pq qr p                       // pq : P --> Q, qr : Q --> R, p : P |- R
  apply qr, pq                         // pq : P --> Q, qr : Q --> R, p : P |- P
  p                                    // Theorem proved!
qed

// We can chain many-argument `apply` just like the ordinary one.
theorem impl-dist :
  (P --> Q --> R) --> ((P --> Q) --> (P --> R))
proof                                            // |- (P --> Q --> R) --> ((P --> Q) --> (P --> R))
  assume (pqr : P --> Q --> R) (pq : P --> Q) p  // pqr : P --> Q --> R, pq : P --> Q, p : P |- R
  apply pqr p, pq                                // pqr : P --> Q --> R, pq : P --> Q, p : P |- P
  p                                              // Theorem proved!
qed

// The true proposition is written `True`.
// We can prove `True` with `trivial`.
// There's no `True` elimination, because it would be useless.
theorem true-intro-example : True
proof                                  // |- True
  trivial                              // Theorem proved!
qed

// The false proposition is written `False`.
// `absurd e` proves any proposition `P` provided that `e` proves `False`.
// There's no way to prove `False`.
theorem false-elim-example :
  False --> P
proof                                  // |- False --> P
  assume e : False                     // e : False |- P
  absurd e                             // Theorem proved!
qed

// The negation of `P` is written `~ P`.
// `~ P` is not a primitive, but rather an abbreviation of `P --> False`.
// Negation is therefore proved using `assume`, just like implication.
theorem not-false : ~ False
proof                                  // |- ~ False
  assume e                             // e : False |- False
  e                                    // Theorem proved!
qed

// Negation is eliminated with `apply`, just like implication.
// The below theorem, called `contradiction`, may also be used as an
// eliminator for negation for the purpose of readability.
theorem contradiction :
  ~ P --> P --> False
proof                                  // |- ~ P --> P --> False
  assume (np : ~ P) (p : P)            // np : ~ P, p : P |- False
  apply np p                           // Theorem proved!
qed

// The conjunction of `P` and `Q` is written `P /\ Q`.
// Conjunction introduction is written `both`.
// `both p q` proves `P /\ Q` provided that `p` proves `P` and `q` proves `Q`.
theorem and-intro :
  P --> Q --> P /\ Q
proof                                  // |- P --> Q --> P /\ Q
  assume p q                           // p : P, q : Q |- P /\ Q
  both p q                             // Theorem proved!
qed

// Proofterms that are missing more than one argument can also be turned into
// tactics, but the syntax is a bit different: the tactic blocks must be
// indented and preceded by the symbol `.`, which is called a "bullet"
// (following Coq naming).
theorem tactic-style-bullets-example :
  P --> Q --> P /\ Q
proof                                  // |- P --> Q --> P /\ Q
  assume p q                           // p : P, q : Q |- P /\ Q
  both                                                          // When we use `both`, the goal splits into two, which we'll show separately.
                                       // p : P, q : Q |- P
  . p                                  // Goal solved!          // This message appears when we solved a goal, but not the entire theorem.
                                       // p : P, q : Q |- Q
  . q                                  // Theorem proved!
qed

// Conjunction elimination is `and-left` and `and-right`.
// `and-left e` proves `P` provided that `e` proves `P /\ Q`.
// `and-right e` proves `Q` provided that `e` proves `P /\ Q`.
theorem conjunction-elimination-example :
  P /\ Q --> P
proof                                  // |- P /\ Q --> P
  assume pq                            // pq : P /\ Q |- P
  and-left pq                          // Theorem proved!
qed

// We can also eliminate conjunction by pattern matching directly in `assume`.
theorem assume-pattern-matching :
  P /\ Q --> P
proof                                  // |- P /\ Q --> P
  assume (both p q)                    // p : P, q : Q |- P
  p                                    // Theorem proved!
qed

// When eliminating conjunction in this way, we can use annotations too.
theorem assume-pattern-matching-annotated :
  P /\ Q --> P
proof                                  // |- P /\ Q --> P
  assume (both p q : P /\ Q)           // p : P, q : Q |- P
  p                                    // Theorem proved!
qed

// We can also annotate the variables, not just the entire pattern.
theorem assume-pattern-matching-annotated-var :
  P /\ Q --> P
proof                                  // |- P /\ Q --> P
  assume (both (p : P) (q : Q))        // p : P, q : Q |- P
  p                                    // Theorem proved!
qed

// This pattern-matching elimination can be nested, of course.
// Also note that we can use partially applied `both` in tactic style.
theorem and-assoc :
  (P /\ Q) /\ R --> P /\ (Q /\ R)
proof                                  // |- (P /\ Q) /\ R --> P /\ (Q /\ R)
  assume (both (both p q) r)           // p : P, q : Q, r : R |- P /\ (Q /\ R)
  both p                               // p : P, q : Q, r : R |- Q /\ R
  both q r                             // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem and-assoc-term-style : (P /\ Q) /\ R --> P /\ (Q /\ R) =
  assume (both (both p q) r) in
    both p (both q r)

// The biconditional is written `P <--> Q`.
// `P <--> Q` is not a primitive, but an abbreviation of `(P --> Q) /\ (Q --> P)`.
// Therefore, biconditional introduction is `both`, just as for conjunction.
theorem iff-intro :
  (P --> Q) --> (Q --> P) --> P <--> Q
proof                                  // |- (P --> Q) --> (Q --> P) --> P <--> Q
  assume pq qp                         // pq : P --> Q, qp : Q --> P |- P <--> Q
  both pq qp                           // Theorem proved!
qed

// Biconditional elimination is `and-left` and `and-right`,
// just as for conjunction.
theorem iff-elim-l :
  (P <--> Q) --> (P --> Q)
proof                                  // |- (P <--> Q) --> (P --> Q)
  assume pq : P <--> Q                 // pq : P <--> Q |- P --> Q
  and-left pq                          // Theorem proved!
qed

// Similarly to conjunction, biconditionals can be eliminated by pattern
// matching directly in `assume`.
theorem iff-elim-r-pattern-matching :
  (P <--> Q) --> (Q --> P)
proof                                  // |- (P <--> Q) --> (Q --> P)
  assume (both pq qp)                  // pq : P --> Q, qp : Q --> P |- Q --> P
  qp                                   // Theorem proved!
qed

// The disjunction of `P` and `Q` is written `P \/ Q`.
// Disjunction introduction is written `or-left` and `or-right`.
// `or-left e` proves `P \/ Q` provided that `e` proves `P`.
// `or-right e` proves `P \/ Q` provided that `e` proves `Q`.
theorem or-intro-l :
  P --> P \/ Q
proof                                  // |- P --> P \/ Q
  assume p                             // p : P |- P \/ Q
  or-left p                            // Theorem proved!
qed

// Disjunction elimination is written `cases`.
// `cases e1 e2 e3` proves `R` provided that
// `e1` proves `P \/ Q`,
// `e2` proves `P --> R` and
// `e3` proves `Q --> R`.
// Note that similarly to `both`, in tactic style we can use `cases`
// partially applied.
theorem or-comm :
  P \/ Q --> Q \/ P
proof                                  // |- P \/ Q --> Q \/ P
  assume pq                            // pq : P \/ Q |- Q \/ P
  cases pq
                                       // pq : P \/ Q |- P --> Q \/ P
  . assume p                           // pq : P \/ Q, p : P |- Q \/ P
    or-right p                         // Goal solved!
                                       // pq : P \/ Q |- Q --> Q \/ P
  . assume q                           // pq : P \/ Q, q : Q |- Q \/ P
    or-left q                          // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem or-comm-term-style : P \/ Q --> Q \/ P =
  assume pq in
    cases pq (assume p in or-right p) (assume q in or-left q)

// Note: we don't have to prove `P --> Q \/ P` inline with
// `assume p in or-right p` (and analogously for `Q --> Q \/ P`),
// because we can use `or-right` (respectively, `or-left`) directly.
// Also note that theorem names can contain an apostrophe.
theorem or-comm-term-style' : P \/ Q --> Q \/ P =
  assume pq in
    cases pp or-right or-left

// We can prove a lemma inline with the construct `lemma x : P by p in q`,
// where `x` is the lemma name, `P` is a proposition, `p` is its proof
// and `q` is the proof of the main theorem.
theorem lemma-example :
  P \/ P --> P
proof                                  // |- P \/ P --> P
  assume orpp                          // orpp : P \/ P |- P
  lemma implpp : P --> P by            // orpp : P \/ P |- P --> P     // When we start proving a lemma, the goal becomes the lemma statement.
    assume p                           // orpp : P \/ P, p : P |- P
    p                                  // Lemma proved!                // When we prove the lemma, the final message reflects it.
                                       // orpp : P \/ P, implpp : P --> P |- P  // After the lemma is proved, it gets added to the context.
  cases orpp implpp implpp             // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem lemma-term-style : P \/ P --> P =
  assume orpp in
    lemma implpp : P --> P by
      assume p in p
    in
      cases orpp implpp implpp

// Lemmas can also be proved after they were used. In such a case, when first
// referring to the lemma name, we need to precede it with a question mark `?`.
// This usage is called a "reverse lemma". Note that reverse lemmas cannot be
// used in term style!
theorem reverse-lemma :
  P \/ P --> P
proof                                  // |- P \/ P --> P
  assume orpp                          // orpp : P \/ P |- P
  cases orpp ?implpp ?implpp           // Lemmas remaining: ?implpp : P --> P  // The goal has been "solved", but now we must prove `?implpp`.
  lemma implpp : P --> P by            // orpp : P \/ P |- P --> P
    assume p                           // orpp : P \/ P, p : P |- P
    p                                  // Theorem proved!            // In this case, proving the lemma means proving the entire theorem.
qed

// Lemmas can be proved in term style, even inside tactic-style proofs.
theorem term-style-lemma-example :
  P --> Q --> P /\ Q
proof                                  // |- P --> Q --> P /\ Q
  assume p q                           // p : P, q : Q |- P /\ Q
  both ?x ?y                           // Lemmas remaining: ?x : P, ?y : Q
  lemma x : P = p                      // Lemmas remaining: ?y : Q          // We got ?x, so only ?y remains.
  lemma y : Q = q                      // Theorem proved!
qed

// Note that these lemmas don't need to be proved in the order they
// were introduced in the proof. Below, we prove `?y` first, even though we
// first introduced `?x`.
theorem term-style-lemma-not-in-order-example :
  P --> Q --> P /\ Q
proof                                  // |- P --> Q --> P /\ Q
  assume p q                           // p : P, q : Q |- P /\ Q
  both ?x ?y                           // Lemmas remaining: ?x : P, ?y : Q
  lemma y : Q = q                      // Lemmas remaining: ?x : P          // This time, only ?x remains.
  lemma x : P = p                      // Theorem proved!
qed

// Reverse lemmas don't need annotations, neither in term style nor in tactic
// style. This is because the lemma statement gets inferred from its usage.
theorem term-style-lemma-no-annotation :
  P --> Q --> P /\ Q
proof                                  // |- P --> Q --> P /\ Q
  assume p q                           // p : P, q : Q |- P /\ Q
  both ?x ?y                           // Lemmas remaining: ?x : P, ?y : Q
  lemma x = p                          // Lemmas remaining: ?y : Q
  lemma y by q                         // Theorem proved!
qed

// When using `lemma`, we first prove the lemma and then the main goal.
// But we can also do this in the opposite order: we first prove the
// main goal and then the lemma.
// `suffices P by e in e'` proves `Q` provided that
// `e` proves `P --> Q` and that `e'` proves `P`.
theorem suffices-example :
  (P --> Q) --> (Q --> R) --> P --> R
proof                                  // |- (P --> Q) --> (Q --> R) --> P --> R
  assume pq qr p                       // pq : P --> Q, qr : Q --> R, p : P |- R
  suffices Q by                        // pq : P --> Q, qr : Q --> R, p : P |- Q --> R  // `Q` suffices to prove `R`, so the goal is `Q --> R`.
    qr                                 // Goal solved!
                                       // pq : P --> Q, qr : Q --> R, p : P |- Q  // We're now left to prove `Q`.
  suffices P by                        // pq : P --> Q, qr : Q --> R, p : P |- P --> Q
    pq                                 // Goal solved!
                                       // pq : P --> Q, qr : Q --> R, p : P |- P
  assumption                           // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem suffices-example-term-style : (P --> Q) --> (Q --> R) --> P --> R =
  assume pq qr p in
    suffices Q by qr in
    suffices P by pq in
      assumption

// We can prove the goals generated by `suffices` inline to reduce hassle.
theorem suffices-example-no-inline :
  (P --> Q) --> (Q --> R) --> P --> R
proof                                  // |- (P --> Q) --> (Q --> R) --> P --> R
  assume pq qr p                       // pq : P --> Q, qr : Q --> R, p : P |- R
  suffices Q by qr                     // pq : P --> Q, qr : Q --> R, p : P |- Q
  suffices P by pq                     // pq : P --> Q, qr : Q --> R, p : P |- P
  assumption                           // Theorem proved!
qed

// If at any point in the proof it's not clear what the goal is, we can
// provide a conclusion annotation to make this obvious. The syntax is
// `proving P by e`, where `P` is a proposition and `e` proves `P`.
theorem conclusion-annotation-example :
  Q --> P \/ (Q \/ R)
proof                                  // |- Q --> P \/ (Q \/ R)
  assume q                             // q : Q |- P \/ (Q \/ R)
  proving (P \/ (Q \/ R))              // q : Q |- P \/ (Q \/ R)
  or-right                             // q : Q |- Q \/ R
  proving (Q \/ R)                     // q : Q |- Q \/ R
  or-left                              // q : Q |- Q
  proving Q                            // q : Q |- Q
  assumption                           // Theorem proved!
qed

// In proofterm style, the above proof looks as follows.
theorem conclusion-annotation-example-term-style : Q --> P \/ (Q \/ R) =
  assume q in
    proving (P \/ (Q \/ R)) by or-right
      (proving (Q \/ R) by or-left
        (proving Q by assumption))

// Alternatively, we can also use an annotation of the form
// `proving P by e1 in e2`, where we assert the goal and then
// give a single-step tactic on the same line.
theorem conclusion-annotation-alternative :
  Q --> P \/ (Q \/ R)
proof                                  // |- Q --> P \/ (Q \/ R)
  assume q                             // q : Q |- P \/ (Q \/ R)
  proving (P \/ (Q \/ R)) by or-right  // q : Q |- Q \/ R
  proving (Q \/ R) by or-left          // q : Q |- Q
  proving Q by assumption              // Theorem proved!
qed

// Example theorems and proofs (only constructive logic).

// Currying is when we change one big conjunctive premise into a bunch
// of premises connected with implications.
theorem curry :
  (P /\ Q --> R) --> P --> Q --> R
proof                                  // |- (P /\ Q --> R) --> P --> Q --> R
  assume pqr p q                       // pqr : P /\ Q --> R, p : P, q : Q |- R
  apply pqr                            // pqr : P /\ Q --> R, p : P, q : Q |- P /\ Q
  both p q                             // Theorem proved!
qed

// Uncurrying is the reverse of currying.
theorem uncurry :
  (P --> Q --> R) --> (P /\ Q --> R)
proof                                  // |- (P --> Q --> R) --> (P /\ Q --> R)
  assume pqr (both p q)                // pqr : P --> Q --> R, p : P, q : Q |- R
  apply pqr p q                        // Theorem proved!
qed

// Disjunction is idempotent.
theorem or-idempotent:
  P \/ P --> P
proof                                       // |- P \/ P --> P
  assume pp                                 // pp : P \/ P |- P
  cases pp (assume p in p) (assume p in p)  // Theorem proved!
qed

// Note that we don't need to prove `P --> P` inline, because we have already
// proved it before (it's called `impl-refl`), so we can use that instead.
theorem or-idempotent' : P \/ P --> P
proof
  assume pp
  cases pp impl-refl impl-refl
qed

// Conjunction is commutative.
theorem and-comm :
  P /\ Q --> Q /\ P
proof                                  // |- P /\ Q --> Q /\ P
  assume pq                            // pq : P /\ Q |- Q /\ P
  both
                                       // pq : P /\ Q |- Q
  . and-right pq                       // Goal solved!
                                       // pq : P /\ Q |- P
  . and-left pq                        // Theorem proved!
qed

// The above proof gets much shorter when pattern matching
// directly in `assume`.
theorem and-comm' :
  P /\ Q --> Q /\ P
proof                                  // |- P /\ Q --> Q /\ P
  assume (both p q)                    // p : P, q : Q |- Q /\ P
  both q p                             // Theorem proved!
qed

// `~ P \/ Q` is classically equivalent to `P --> Q`, but only one
// direction is constructive, the other being classical.
theorem impl-or-neg :
  ~ P \/ Q --> (P --> Q)
proof                                  // |- ~ P \/ Q --> (P --> Q)
  assume (npq : ~ P \/ Q) (p : P)      // npq : ~ P \/ Q, p : P |- Q
  cases npq
                                       // npq : ~ P \/ Q, p : P |- ~ P --> Q
  . assume np : ~ P                    // npq : ~ P \/ Q, p : P, np : ~ P |- Q
    absurd                             // npq : ~ P \/ Q, p : P, np : ~ P |- False
    contradiction np p                 // Goal solved!
                                       // npq : ~ P \/ Q, p : P |- Q --> Q
  . assume q : Q                       // npq : ~ P \/ Q, p : P, q : Q |- Q
    assumption                         // Theorem proved!
qed

theorem noncontradiction :
  ~ (P /\ ~ P)
proof                                  // |- ~ (P /\ ~ P)
  assume (both p np)                   // p : P, np : ~ P |- False
  contradiction np p                   // Theorem proved!
qed

theorem contraposition :
  (P --> Q) --> (~ Q --> ~ P)
proof                                  // |- (P --> Q) --> (~ Q --> ~ P)
  assume pq nq p                       // pq : P --> Q, nq : ~ Q, p : P |- False
  apply nq, pq                         // pq : P --> Q, nq : ~ Q, p : P |- P
  assumption                           // Theorem proved!
qed

theorem funny-contraposition :
  (P --> ~ Q) --> (Q --> ~ P)
proof                                  // |- (P --> ~ Q) --> (Q --> ~ P)
  assume pnq q p                       // pnq : P --> ~ Q, q : Q, p : P |- False
  apply pnq p q                        // Theorem proved!
qed

theorem iff-elim :
  ((P --> Q) --> (Q --> P) --> R) --> ((P <--> Q) --> R)
proof                                  // |- ((P --> Q) --> (Q --> P) --> R) --> ((P <--> Q) --> R)
  assume f (both pq qp)                // f : (P --> Q) --> (Q --> P) --> R, pq : P --> Q, qp : Q --> P |- R
  apply f pq qp                        // Theorem proved!
qed

theorem iff-not :
  (P <--> Q) --> (~ P <--> ~ Q)
proof                                  // |- (P <--> Q) --> (~ P <--> ~ Q)
  assume (both pq qp)                  // pq : P --> Q, qp : Q --> P |- ~ P <--> ~ Q
  both
                                       // pq : P --> Q, qp : Q --> P |- ~ P --> ~ Q
  . contraposition qp                  // Goal solved!
                                       // pq : P --> Q, qp : Q --> P |- ~ Q --> ~ P
  . contraposition pq                  // Theorem proved!
qed

theorem resolution :
  (P \/ Q) /\ (~ P \/ R) --> Q \/ R
proof                                  // |- (P \/ Q) /\ (~ P \/ R) --> Q \/ R
  assume (both pq npr)                 // pq : P \/ Q, npr : ~ P \/ R |- Q \/ R
  cases pq ?pr ?qq                     // Lemmas remaining: ?pr : P --> Q \/ R, ?qq : Q --> Q \/ R
  lemma qq by                          // pq : P \/ Q, npr : ~ P \/ R |- Q --> Q \/ R
    assume q                           // pq : P \/ Q, npr : ~ P \/ R, q : Q |- Q \/ R
    or-left q                          // Lemma proved!
  lemma pr by                          // pq : P \/ Q, npr : ~ P \/ R |- P --> Q \/ R
    cases npr
                                       // pq : P \/ Q, npr : ~ P \/ R |- ~ P --> P --> Q \/ R
    . assume np p                      // pq : P \/ Q, npr : ~ P \/ R, np : ~ P, p : P |- Q \/ R
      absurd                           // pq : P \/ Q, npr : ~ P \/ R, np : ~ P, p : P |- False
      contradiction np p               // Goal solved!
                                       // pq : P \/ Q, npr : ~ P \/ R |- R --> P --> Q \/ R
    . assume r _                       // pq : P \/ Q, npr : ~ P \/ R, r : R |- Q \/ R
      or-right r                       // Theorem proved!
qed

theorem resolution' :
  (P \/ Q) /\ (~ P \/ R) --> Q \/ R
proof                                           // |- (P \/ Q) /\ (~ P \/ R) --> Q \/ R
  assume (both pq npr)                          // pq : P \/ Q, npr : ~ P \/ R |- Q \/ R
  cases pq (assume p in ?pr) (assume q in ?qq)  // Lemmas remaining: ?pr : Q \/ R, ?qq : Q \/ R
  lemma qq by                                   // pq : P \/ Q, npr : ~ P \/ R, q : Q |- Q \/ R
    or-left q                                   // Lemma proved!
  lemma pr by                                   // pq : P \/ Q, npr : ~ P \/ R, p : P |- Q \/ R
    cases npr
                                                // pq : P \/ Q, npr : ~ P \/ R, p : P |- ~ P --> Q \/ R
    . assume np                                 // pq : P \/ Q, npr : ~ P \/ R, p : P, np : ~ P |- Q \/ R
      absurd                                    // pq : P \/ Q, npr : ~ P \/ R, p : P, np : ~ P |- False
      contradiction np p                        // Goal solved!
                                                // pq : P \/ Q, npr : ~ P \/ R, p : P |- R --> Q \/ R
    . assume r                                  // pq : P \/ Q, npr : ~ P \/ R, p : P, r : R |- Q \/ R
      or-right r                                // Theorem proved!
qed

theorem not-or-intro :
  ~ P /\ ~ Q --> ~ (P \/ Q)
proof                                  // |- ~ P /\ ~ Q --> ~ (P \/ Q)
  assume (both np nq) npq              // np : ~ P, nq : ~ Q, npq : P \/ Q |- False
  cases npq
                                       // np : ~ P, nq : ~ Q, npq : P \/ Q |- P --> False
  . assume p                           // np : ~ P, nq : ~ Q, npq : P \/ Q, p : P |- False
    contradiction np p                 // Goal solved!
                                       // np : ~ P, nq : ~ Q, npq : P \/ Q |- Q --> False
  . assume q                           // np : ~ P, nq : ~ Q, npq : P \/ Q, q : Q |- False
    contradiction nq q                 // Theorem proved!
qed

theorem not-or-elim :
  ~ (P \/ Q) --> ~ P /\ ~ Q
proof                                  // |- ~ (P \/ Q) --> ~ P /\ ~ Q
  assume npq : ~ (P \/ Q)              // npq : ~ (P \/ Q) |- ~ P /\ ~ Q
  both
                                       // npq : ~ (P \/ Q) |- ~ P
  . assume p                           // npq : ~ (P \/ Q), p : P |- False
    apply npq                          // npq : ~ (P \/ Q), p : P |- P \/ Q
    or-left                            // npq : ~ (P \/ Q), p : P |- P
    p                                  // Goal solved!
                                       // npq : ~ (P \/ Q) |- ~ Q
  . assume q                           // npq : ~ (P \/ Q), q : Q |- False
    apply npq                          // npq : ~ (P \/ Q), q : Q |- P \/ Q
    or-right                           // npq : ~ (P \/ Q), q : Q |- Q
    q                                  // Theorem proved!
qed