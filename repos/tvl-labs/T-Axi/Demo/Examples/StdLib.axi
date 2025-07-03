data type Empty where

data type Unit where
  unit

data type Nat where
  zero : Nat
  succ : Nat -> Nat

data type List A where
  nil  : List A
  cons : A -> List A -> List A

theorem notb-nofix :
  forall b : Bool, ~ b === notb b
proof                                  // |- forall b : Bool, ~ b === notb b
  pick-any b : Bool                    // b : Bool |- ~ b === notb b
  assume heq : b === notb b            // b : Bool, heq : b === notb b |- False
  let goal : Prop =
    match false with
    | false => False
    | true  => True
  proving goal                         // b : Bool, heq : false === notb false, goal : Prop = ... |- goal
  cases b with
  | false =>                           // b : Bool, heq : false === notb false, goal : Prop = ... |- goal
    unfold goal
    rewrite heq
    simpl                              // b : Bool, heq : false === notb false, goal : Prop = ... |- True
    trivial                            // Goal solved!
  | true =>                            // b : Bool, heq : true === notb true, goal : Prop = ... |- goal
    simpl at heq                       // b : Bool, heq : true === false, goal : Prop = ... |- goal
    unfold goal
    rewrite <- heq
    simpl                              // b : Bool, heq : true === false, goal : Prop = ... |- True
    trivial                            // Theorem proved!
qed