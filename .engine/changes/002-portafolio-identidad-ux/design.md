---
type: design
domain: web-infrastructure
status: draft
author: gemini-2.5-flash
created_at: 2026-04-06
spec: specs/web-infrastructure/spec.md
tags:
  - area:portafolio
  - feature:identidad-ux
  - tool:mkdocs
---

## Summary
The technical approach centers on extending the existing `mkdocs.yml` configuration to leverage Material for MkDocs' built-in presentation layer capabilities. Instead of writing custom CSS or JS, all styling, layout, and UX features (dark mode slate scheme, advanced navigation features like tabs, and SEO metadata) will be defined declaratively in YAML. This ensures a maintainable, high-performance static site generation process that projects a professional technical profile.

## Technical Context
| Field | Value |
| --- | --- |
| Language/Version | YAML / MkDocs Material |
| Primary Dependencies | `mkdocs-material` |
| Storage | N/A |
| Testing | Automated schema validation via MkDocs build check |
| Target Platform | Web Browsers (Static Site) |
| Project Type | Static Documentation / Portfolio |
| Performance Goals | High Lighthouse score (fast LCP, SEO-compliant) |
| Constraints | No custom `.css` or `.js` allowed. All config must be declarative. |
| Scale/Scope | Portfolio presentation layer (UX/UI identity only) |

## Architecture
The architecture involves modifying the MkDocs configuration file (`mkdocs.yml`) which drives the static site generation process. The key integration points are:
- **Theme Configuration (`theme`):** Modifying the theme to use `material` and injecting the `palette` configuration for the dark mode identity (`scheme: slate`).
- **Features (`theme.features`):** Enabling navigation enhancements such as `navigation.tabs`, `navigation.sections`, and `navigation.top`.
- **Site Metadata (root level):** Adding `site_name`, `site_author`, and `site_description` for foundational SEO.
- **Social Integration (`extra.social`):** Adding specific links for GitHub and LinkedIn to be rendered natively in the footer.

No new modules or abstractions will be added, relying purely on the declarative API exposed by Material for MkDocs.

## Data Model
Since the change is purely declarative configuration, no new application-level Pydantic data models or data structures are introduced.
The primary data structure being modified is the MkDocs YAML configuration schema:
- `theme.palette`: Object containing `scheme: slate`, `primary` color, and `accent` color.
- `theme.features`: Array of strings specifying enabled UI capabilities.
- `extra.social`: Array of objects, each containing `icon`, `link`, and optionally `name` strings.

## Key Decisions
- **Decision:** Use declarative `mkdocs.yml` configuration over custom CSS/JS.
  - **Alternatives considered:** Writing custom `.css` and integrating it via `extra_css` to fine-tune the look.
  - **Rationale:** Strict adherence to the portfolio's goal of sobriety and technical pragmatism. Material for MkDocs provides a highly optimized, accessible, and responsive baseline out-of-the-box, ensuring long-term maintainability.

- **Decision:** Adopt the "slate" scheme for Dark Mode by default.
  - **Alternatives considered:** Providing a theme toggle with "default" (light) as the baseline.
  - **Rationale:** A dark scheme ("slate") aligns strongly with developer-centric environments, establishing a technical and comfortable identity instantly without requiring user interaction.

- **Decision:** Use specific branding colors and hardcoded social links.
  - **Alternatives considered:** Using generic default colors and placeholder links.
  - **Rationale:** The user provided explicit values: `primary: black` and `accent: cyan` for the palette, and specific GitHub (`https://github.com/Bajmein`) and LinkedIn (`https://linkedin.com/in/benjamin-criado`) URLs to immediately personalize the portfolio identity.

## Project Structure
```text
/
└── mkdocs.yml (modified)
```

## Open Questions
*(None at this time)*