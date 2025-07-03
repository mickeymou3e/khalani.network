# Valid GPT

Valid GPT is a Claude powered tool that can be used to generate proofs in a natural language format and to translate natural language proofs into a formal language (currently Athena, in the future Athena & Validity).

## Example

Given the following Athena proof (located in `src/example_queries/example2.ath`):

```athena
declare A,B,C,D,E,F,G,H,I: Boolean

assert p1 := (A | B ==> C & D )
assert p2 := (C | E ==> ~ F & G)
assert p3 := (F | H ==> A & I)

# We will show that the negation of F is a logical consequence
# of these 3 premises. We'll derive (~ F) by contradiction, by
# assuming F: 

(!by-contradiction (~ F)
assume F
  (!chain-> [F
         ==> (F | H)   [alternate]
         ==> (A & I)   [p3]
         ==> A         [left-and]
         ==> (A | B)   [alternate]
         ==> (C & D)   [p1]
         ==> C         [left-and]
         ==> (C | E)   [alternate]
         ==> (~ F & G) [p2]
         ==> (~ F)     [left-and]
         ==> false     [(absurd with F)]]))
```
The PDF generated from this proof can be found [here](test.pdf).


It was generated from the following interaction:

```shell
Welcome to Valid GPT! Type 'exit' to quit.
What would you like to do? [explain, formalize]
> explain
Okay, you've chosen explain

Would you like me to place the results in a file or print them to the screen? [file, stdout]
> file
Okay, I'll write the results to a file. What would you like me to name the file?
> test.tex
And finally, what is the path to the file you'd like me to explain
?
> ./src/example_queries/example2.ath
```

And then running `pdflatex test.tex` to generate the pdf.

