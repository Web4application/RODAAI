// swift-tools-version:5.6
import PackageDescription

let package = Package(
  name: "kubu-hai",
  platforms: [.macOS(.v13)],
  dependencies: [
    .package(url: "https://github.com/vapor/vapor.git", from: "4.115.0"),
    .package(url: "https://github.com/vapor/queues.git", from: "1.17.2")
  ],
  targets: [
    .target(
      name: "App",
      dependencies: [
        .product(name: "Vapor", package: "vapor"),
        .product(name: "Queues", package: "queues")
      ]
    ),
    .target(
      name: "Run",
      dependencies: ["App"]
    )
  ]
)
