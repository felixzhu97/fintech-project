# Atlassian MCP Integration

This project uses `plugin-atlassian-atlassian` MCP Server for Jira operations.

## Configuration

| Property | Value |
|----------|-------|
| Site URL | https://felixzhu.atlassian.net |
| Cloud ID | `75684fb5-daf5-4962-9581-c4948b9c12cf` |
| User Account ID | `62ee247ff15eecaf500efa39` |
| Primary Project | `AI` (FinPulse) |

### Available Projects

| Project Key | Name | Issue Types |
|-------------|------|-------------|
| `AI` | FinPulse | Epic, Story, Task, Subtask, Bug, Feature |
| `FVXI` | Support | Service Request, Incident, Task, Subtask |

> Always include `cloudId` when calling Jira MCP tools.

## Available Tools

| Tool | Purpose |
|------|---------|
| `getVisibleJiraProjects` | List projects visible to the current user |
| `getJiraIssue` | Get issue details by key |
| `createJiraIssue` | Create a new issue |
| `editJiraIssue` | Edit an existing issue |
| `addCommentToJiraIssue` | Add a comment |
| `transitionJiraIssue` | Transition issue status |
| `searchJiraIssuesUsingJql` | Search issues using JQL |
| `getTransitionsForJiraIssue` | Get available status transitions |
| `lookupJiraAccountId` | Look up user account ID |

## Quick Reference

### Create Issue

```json
{
  "server": "plugin-atlassian-atlassian",
  "toolName": "createJiraIssue",
  "arguments": {
    "cloudId": "75684fb5-daf5-4962-9581-c4948b9c12cf",
    "projectKey": "AI",
    "issueTypeName": "任务",
    "summary": "As a user I want … so that …",
    "description": "Full description (markdown supported)",
    "assignee_account_id": "62ee247ff15eecaf500efa39"
  }
}
```

### Search Issues

```json
{
  "server": "plugin-atlassian-atlassian",
  "toolName": "searchJiraIssuesUsingJql",
  "arguments": {
    "cloudId": "75684fb5-daf5-4962-9581-c4948b9c12cf",
    "jql": "project = AI ORDER BY created DESC",
    "maxResults": 20
  }
}
```

### Add Comment

```json
{
  "server": "plugin-atlassian-atlassian",
  "toolName": "addCommentToJiraIssue",
  "arguments": {
    "cloudId": "75684fb5-daf5-4962-9581-c4948b9c12cf",
    "issueIdOrKey": "AI-123",
    "comment": "Comment content"
  }
}
```

## Workflow

1. Call `getVisibleJiraProjects` with `cloudId: "75684fb5-daf5-4962-9581-c4948b9c12cf"` to get project information
2. Use `createJiraIssue` to create work (use `AI` for FinPulse software delivery)
3. Use `transitionJiraIssue` to advance the workflow
4. Use `addCommentToJiraIssue` to record progress

## MCP Tool Usage (Important)

**Required parameters:**
- `cloudId` — from `getAccessibleAtlassianResources` (or fixed value `75684fb5-daf5-4962-9581-c4948b9c12cf`)
- `issueTypeName` — **must use the site’s localized name** (this Jira site uses Chinese labels, e.g. `任务` not `Task`)

**Common issue types:**

| English | API value (localized on this site) |
|---------|--------------------------------------|
| Epic | 长篇故事 |
| Story | 故事 |
| Task | 任务 |
| Subtask | Subtask |
| Bug | 缺陷 |
| Feature | 功能 |

> **Important:** Passing English names like `"Task"` fails with an invalid issue-type error on this site. Always use the localized API values above when creating issues.

**Workflow:**
1. Call `getAccessibleAtlassianResources` to get `cloudId` (or use the fixed value)
2. Use `cloudId` for all subsequent Jira operations
3. Use localized `issueTypeName` when creating issues
4. For `projectKey`, use `AI` for FinPulse delivery work
