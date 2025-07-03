// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterAxi",
    products: [
        .library(name: "TreeSitterAxi", targets: ["TreeSitterAxi"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterAxi",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterAxiTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterAxi",
            ],
            path: "bindings/swift/TreeSitterAxiTests"
        )
    ],
    cLanguageStandard: .c11
)
