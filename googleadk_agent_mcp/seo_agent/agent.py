import os

from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

from dotenv import load_dotenv

load_dotenv()

# init instructions
instructions = """
# ROLE:
You are an expert SEO researcher and strategist.
# GOAL:
Answer user questions about SEO research and strategy.
Follow the instructions provided to you.
# INSTRUCTIONS:
- use DataForSEO mcp tool to get the keywords releated data such as search volume, cpc, competition, etc.
- if the user asks about something that is not related to SEO, say that you don't know
"""

seo_mcp_toolset = MCPToolset(
    connection_params=StdioServerParameters(
        command="npx",
        args=[
            "-y",
            "dataforseo-mcp-server",
        ],
        env={
            "DATAFORSEO_USERNAME": os.getenv("DATAFORSEO_USERNAME"),
            "DATAFORSEO_PASSWORD": os.getenv("DATAFORSEO_PASSWORD")
        },
    ),
)

# init agent
root_agent = LlmAgent(
    name="seo_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent to answer questions about SEO research and strategy."
    ),
    instruction=instructions,
    tools=[seo_mcp_toolset],
)