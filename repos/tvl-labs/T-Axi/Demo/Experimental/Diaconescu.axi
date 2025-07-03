declaration P : Prop

U (b : Bool) : Prop =
  P \/ b === false

V (b : Bool) : Prop =
  P \/ b === true

theorem P-implies-U-iff-V :
  P --> forall b : Bool, U b <--> V b
proof                                  // |- P --> forall b : Bool, U b <--> V b
  assume p : P                         // p : P |- forall b : Bool, U b <--> V b
  pick-any b : Bool                    // p : P, b : Bool |- U b <--> V b
  both
  . assume _                           // p : P, b : Bool |- V b
    unfold V                           // p : P, b : Bool |- P \/ b === true
    or-left                            // p : P, b : Bool |- P
    assumption                         // Goal solved!
  . assume _                           // p : P, b : Bool |- U b
    unfold U                           // p : P, b : Bool |- P \/ b === false
    or-left                            // p : P, b : Bool |- P
    assumption                         // Theorem proved!
qed

theorem P-implies-U-eq-V :
  P --> U === V
proof                                  // |- P --> U === V
  assume p : P                         // p : P |- U === V
  funext b : Bool                      // p : P, b : Bool |- U b === V b
  propext                              // p : P, b : Bool |- U b <--> V b
  apply (P-implies-U-iff-V p b)        // Theorem proved!
qed

theorem ex-U :
  exists b : Bool, U b
proof                                  // |- exists b : Bool, U b
  witness false                        // |- U false
  or-right                             // |- false === false
  refl                                 // Theorem proved!
qed

theorem ex-V :
  exists b : Bool, V b
proof                                  // |- exists b : Bool, V b
  witness true                         // |- V true
  or-right                             // |- true === true
  refl                                 // Theorem proved!
qed

let noncomputable cu = choose ex-U
let noncomputable cv = choose ex-V

theorem cu-spec : U cu
proof                                  // |- U cu
  unfold cu                            // |- U (choose ex-U)
  choose-spec ex-U                     // Theorem proved!
qed

theorem cv-spec : V cv
proof                                  // |- V cv
  unfold cv                            // |- V (choose ex-V)
  choose-spec ex-V                     // Theorem proved!
qed

theorem main-lemma :
  P \/ (~ cu === cv)
proof                                  // |- P \/ (~ cu === cv)
  cases cu-spec
                                       // |- P --> P \/ (~ cu === cv)
  . assume p                           // p : P |- P \/ (~ cu === cv)
    or-left                            // p : P |- P
    assumption                         // Goal solved!
                                       // |- cu === false --> P \/ (~ cu === cv)
  . cases cv-spec
                                       // |- P --> cu === false --> P \/ (~ cu === cv)
    . assume p _                       // p : P |- P \/ (~ cu === cv)
      or-left                          // p : P |- P
      assumption                       // Goal solved!
                                       // |- cv === true --> cu === false --> P \/ (~ cu === cv)
    . assume ===> ===>                 // P \/ (~ false === true)
      or-right                         // ~ false === true
      false-not-true                   // Goal solved!
qed

theorem main-lemma-impl : cu === cv --> P
proof                                  // |- cu === cv --> P
  assume h                             // h : cu === cv |- P
  cases main-lemma
                                       // h : cu === cv |- P --> P
  . assume p                           // h : cu === cv, p : P |- P
    assumption                         // Goal solved!
                                       // h : cu === cv |- ~ cu === cv --> P
  . assume nh                          // h : cu === cv, nh : ~ cu === cv |- P
    absurd                             // h : cu === cv, nh : ~ cu === cv |- False
    contradiction nh h                 // Theorem proved!
qed

theorem np-cu : ~ P --> cu === false
proof                                  // |- ~ P --> cu === false
  assume np                            // np : ~ P |- cu === false
  cases cu-spec
                                       // np : ~ P |- P --> cu === false
  . assume p                           // np : ~ P, p : P |- cu === false
    absurd                             // np : ~ P, p : P |- False
    contradiction np p                 // Goal solved!
                                       // np : ~ P |- cu === false --> cu === false
  . assume h                           // np : ~ P, h : cu === false |- cu === false
    assumption                         // Theorem proved!
qed

theorem np-cv : ~ P --> cv === true
proof                                  // |- ~ P --> cv === true
  assume np                            // np : ~ P |- cv === true
  cases cv-spec
                                       // np : ~ P |- P --> cv === true
  . assume p                           // np : ~ P, p : P |- cv === true
    absurd                             // np : ~ P, p : P |- False
    contradiction np p                 // Goal solved!
                                       // np : ~ P |- cv === true --> cv === true
  . assume h                           // np : ~ P, h : cv === true |- cv === true
    assumption                         // Theorem proved!
qed

theorem excluded-middle : P \/ ~ P
proof                                  // |- P \/ ~ P
  cases main-lemma
                                       // |- P --> P \/ ~ P
  . or-left                            // Goal solved!
                                       // |- ~ cu === cv --> P \/ ~ P
  . assume h p                         // h : ~ cu === cv, p : P |- False
qed