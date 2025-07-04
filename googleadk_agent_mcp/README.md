# Google ADK MCP Sample

This is a sample project that demonstrates how to use the Google ADK.

## Setup

Create a `.env` file inside the directory with the following environment variables:

```bash
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=[YOUR_GOOGLE_API_KEY]
```

To install the dependencies, run the following command:

```bash
uv sync
```

## Running the project

```bash
uv run adk web
```

```bash
uv run adk run seo_agent
```

## Query
```
Provide a keyword research study for the metrics: [Monthly Search Volume, Competition Level, Cost Per Click, Keyword Difficulty, Search Intent], region: [United States], language: [English] for keyword: "mcp server" in the last 3 months using DataForSEO MCP Server.
```