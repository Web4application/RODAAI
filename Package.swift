// swift-tools-version:5.6
import PackageDescription

let package = Package(
  name: "roda",
  platforms: [.macOS(.v13)],
  dependencies: [
    .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.6.1"),
    .package(name: "GoogleGenerativeAI", path: "../../")
  ],
  targets: [
    .executableTarget(
      name: "generate-content",
      dependencies: [
        .product(name: "ArgumentParser", package: "swift-argument-parser"),
        .product(name: "GoogleGenerativeAI", package: "GoogleGenerativeAI")
      ],
      path: "Sources"
    )
  ]
)
