---
description: Standard protocol for starting any new project — audit skills first, then build
---

# New Project Startup Protocol

Every time a new project or major feature is started, follow these steps **before writing any code**.

## Step 1: Audit Installed Skills
// turbo
1. List all skill directories:
   - `.agent/skills/superpowers/skills/`
   - `.agent/skills/ui-ux-pro-max/` (if present)
   - Any other skill folders in `.agent/skills/`

## Step 2: Read Relevant Skills
2. Based on the project requirements, read the `SKILL.md` file from each relevant skill directory. Common matches:
   - **New UI/UX work** → check `ui-ux-pro-max`
   - **Planning phase** → read `superpowers/skills/writing-plans/`
   - **Building phase** → read `superpowers/skills/executing-plans/`
   - **Debugging** → read `superpowers/skills/systematic-debugging/`
   - **Testing** → read `superpowers/skills/test-driven-development/`
   - **Code review** → read `superpowers/skills/requesting-code-review/`
   - **Complex features** → read `superpowers/skills/subagent-driven-development/`
   - **Git workflow** → read `superpowers/skills/finishing-a-development-branch/`
   - **Verification** → read `superpowers/skills/verification-before-completion/`

## Step 3: Apply the Right Skill
3. Follow the instructions from the matched skill(s) as the foundation for how to approach the project.

## Step 4: Begin Building
4. Only after reviewing skills, create the implementation plan and start coding.

## Key Principle
> Skills are the playbook. Always check the playbook before the game starts.
