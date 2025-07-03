import XCTest
import SwiftTreeSitter
import TreeSitterAxi

final class TreeSitterAxiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_axi())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Axi grammar")
    }
}
