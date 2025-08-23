#!/bin/bash
# Auto-generate an Xcode project for RodaAI

set -e
PROJECT_NAME="RodaAI"

# Create structure if missing
mkdir -p Sources/$PROJECT_NAME
mkdir -p Tests/${PROJECT_NAME}Tests

# Add main.swift if missing
if [ ! -f Sources/$PROJECT_NAME/main.swift ]; then
cat > Sources/$PROJECT_NAME/main.swift <<EOL
import Foundation

print("Hello, Roda AI running in Xcode!")
EOL
fi

# Add test if missing
if [ ! -f Tests/${PROJECT_NAME}Tests/TestExample.swift ]; then
cat > Tests/${PROJECT_NAME}Tests/TestExample.swift <<EOL
import XCTest
@testable import $PROJECT_NAME

final class ${PROJECT_NAME}Tests: XCTestCase {
    func testExample() throws {
        XCTAssertEqual(2 + 2, 4)
    }
}
EOL
fi

# Initialize Swift package if not yet
if [ ! -f Package.swift ]; then
    swift package init --type executable --name $PROJECT_NAME
fi

# Generate Xcode project
swift package generate-xcodeproj

echo "✅ Xcode project generated: $PROJECT_NAME.xcodeproj"
