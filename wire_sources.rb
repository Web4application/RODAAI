#!/usr/bin/env ruby
require "xcodeproj"
require "find"

proj_path = "RodaAI.xcodeproj"
project = Xcodeproj::Project.open(File.join(proj_path, "project.pbxproj"))
app_target = project.targets.find { |t| t.name == "RodaAI" }
lib_target = project.targets.find { |t| t.name == "RodaAILibrary" }
abort("RodaAILibrary target not found") unless lib_target

# Ensure the group exists (mapped to Sources folder)
sources_group = project.main_group["RodaAILibrary"] || project.main_group.new_group("RodaAILibrary", "Sources")

# Collect all swift files under Sources/
swift_files = []
Find.find("Sources") do |path|
  next unless path.end_with?(".swift")
  swift_files << path
end

puts "Found #{swift_files.size} Swift files under Sources/"

# Add each file if missing, and add to build phase
swift_files.each do |file_path|
  rel_path = file_path
  file_ref = sources_group.files.find { |f| f.path == rel_path }
  unless file_ref
    file_ref = sources_group.new_file(rel_path)
  end

  # Add to library target's Sources phase if not already added
  already = lib_target.source_build_phase.files_references.include?(file_ref)
  lib_target.add_file_references([file_ref]) unless already
end

# Link the framework to the app (build dependency already exists)
# Ensure the app target links the library product
framework_ref = project.products_group.files.find { |f| f.path == "RodaAILibrary.framework" }
unless framework_ref
  framework_ref = project.products_group.new_file("RodaAILibrary.framework")
end
link_phase = app_target.frameworks_build_phase
unless link_phase.files_references.include?(framework_ref)
  link_phase.add_file_reference(framework_ref)
end

project.save
puts "✅ Wired Sources into RodaAILibrary and linked it to the app."
