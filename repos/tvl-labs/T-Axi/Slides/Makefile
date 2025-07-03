##
## Makefile for the document, based on:
##
## https://tex.stackexchange.com/questions/40738/how-to-properly-make-a-latex-project
##

PDFLATEX="pdflatex -interaction=nonstopmode -synctex=1"

# Include non-file targets in .PHONY so they are run regardless of any
# file of the given name existing.
.PHONY: all clean install

# -pdf tells latexmk to generate PDF directly (instead of DVI).

# -pdflatex="" tells latexmk to call a specific backend with specific options.

# -use-make tells latexmk to call make for generating missing files.

# -interaction=nonstopmode keeps the pdflatex backend from stopping at a
# missing file reference and interactively asking you for an alternative.

# -synctex=1 enables synchronization between the LaTeX sources and the generated
# PDF so that it is possible to jump to the source file when clicking on the
# PDF, and vice-versa. Note that this option requires that the viewer and the
# editor are properly configured.

all:
	cd Theory; latexmk -pdf -pdflatex=$(PDFLATEX) -use-make
	cd Research; latexmk -pdf -pdflatex=$(PDFLATEX) -use-make
	latexmk -pdf -pdflatex=$(PDFLATEX) -use-make

clean:
	cd Theory; latexmk -CA
	cd Research; latexmk -CA
	latexmk -CA

install:
	mkdir -p ${out}/Research
	cp Research/*.pdf ${out}/Research/
	mkdir -p ${out}/Theory
	cp Theory/*.pdf ${out}/Theory/
	cp *.pdf ${out}/
