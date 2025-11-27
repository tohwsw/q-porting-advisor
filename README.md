# AWS Graviton Compatibility Analysis Tool with Kiro CLI

## Overview
This README documents the LLM prompt methodology used to analyze Node.js applications for AWS Graviton (ARM64) processor compatibility.
It contains a sample nodejs application with compatible and incompatible libaries.


## Setup 

Setup your preferred generative AI-powered assistant. In this example we are using the Kiro CLI
Follow the Arm Install Guide for Kiro CLI here. Recommend install on a Mac laptop.
https://learn.arm.com/install-guides/aws-q-cli/

Add Arm MCP server as tool
https://developer.arm.com/community/arm-community-blogs/b/ai-blog/posts/introducing-the-arm-mcp-server-simplifying-cloud-migration-with-ai

```
docker pull armswdev/arm-mcp:latest
```
Modify the file ~/.kiro/settings/mcp.json to add the Arm MCP server via a docker container

```
{
  "mcpServers": {
    "arm-mcp": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "armswdev/arm-mcp:latest"]
    }
  }
}
```

Run the assistant and make sure the tool is loaded.

```
q chat
```

## Analysis Prompt

Give the assistant this prompt.

```
You are an x86 to ARM64 porting advisor and you help analyze the provided source code for patterns and constructs known to be problematic when porting from x86 to ARM64, focusing on compatibility with AWS Graviton processors. Examine dependency declaration files and build scripts for all supported languages (C/C++, Fortran, Go, Node.js, Java, Python) and identify:

    Architecture-specific code (e.g., inline assembly, intrinsics, build flags, compiler guards)

    Arm64 compatibility in Dockerfiles using the check_image and/or skopeo tools.

    Dependencies or libraries without ARM64 support by running the migrate_ease_scan tool

    Build scripts lacking ARM64 detection or configuration

    Third-party or legacy software that may lack ARM64 binaries

Generate a comprehensive report listing:

    Code-level incompatibilities or portability risk factors (with file and line references where possible)

    Specific dependencies that are missing, unsupported, or require a minimum/recommended version for correct operation on Graviton

    For each incompatibility found, provide:

        Minimal required and/or recommended language runtime versions

        Minimal required and/or recommended library versions

        Where version upgrades are needed, supply version numbers confirmed as compatible with AWS Graviton (arm64)

Include actionable suggestions and reference links (where possible) to AWS Graviton documentation or open-source compatibility lists. The tool should not modify the code or transmit data externally. It must run on both x86 and ARM64 hosts, analyzing only source code (not binaries).
```

## Example Output with Claude Sonnet 4.5

```
I've completed a comprehensive x86 to ARM64 porting analysis for your Node.js application targeting AWS Graviton processors. Here are the key 
findings:

## Critical Issues Found

❌ BLOCKER: node-sass (^7.0.3)
• Native C++ compilation failures on ARM64
• No prebuilt ARM64 binaries available
• Deprecated library in maintenance mode
• **Location**: package.json:6, index.js:2

## Compatible Components

✅ bcrypt (^5.1.1) - Fully ARM64 compatible with prebuilt binaries
✅ Node.js v20.18.0 - Optimal version for Graviton
✅ Source code patterns - No architecture-specific code detected

## Required Migration Steps

1. Replace node-sass:
  bash
   npm uninstall node-sass
   npm install sass@^1.69.5
   

2. Update code (index.js:2):
  javascript
   - const sass = require('node-sass');
   + const sass = require('sass');
   

## Graviton-Ready Versions

| Component | Current | Graviton Minimum | Recommended |
|-----------|---------|------------------|-------------|
| Node.js | v20.18.0 ✅ | v16.0.0+ | v18.17.0+ |
| bcrypt | ^5.1.1 ✅ | v5.0.0+ | ^5.1.1 |
| sass | Missing | v1.32.0+ | ^1.69.5 |

## Expected Benefits Post-Migration

• **Performance**: Up to 40% better price-performance
• **Cost**: Up to 20% lower compute costs
• **Energy**: Up to 60% better efficiency

The detailed analysis report has been saved to x86-to-arm64-porting-report.md with complete migration instructions, testing strategies, and AWS 
Graviton deployment recommendations.

Migration Effort: Low (2-4 hours) - Single dependency replacement required.
```
