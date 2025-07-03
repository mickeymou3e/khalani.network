package tree_sitter_axi_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_axi "github.com/tvl-labs/t-axi/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_axi.Language())
	if language == nil {
		t.Errorf("Error loading Axi grammar")
	}
}
