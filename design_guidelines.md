# Website Audit Tool - Design Guidelines

## Design Approach

**Selected Approach:** Design System with Custom Data Visualization
- Base: Material Design principles for clean, professional foundation
- Custom elements for report scoring, progress indicators, and data presentation
- Rationale: Utility-focused tool requiring information clarity, but output must impress clients

## Typography System

**Font Families:**
- Primary: Inter or DM Sans (headings, UI elements)
- Secondary: System font stack for body text (optimal reading)
- Monospace: JetBrains Mono for URLs, technical data

**Type Scale:**
- Hero/Report Title: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Subsections: text-xl font-semibold
- Body: text-base leading-relaxed
- Captions/Metadata: text-sm
- Technical details: text-sm font-mono

## Layout System

**Spacing Primitives:** Consistent use of 4, 6, 8, 12, 16, 20 units
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-6 to gap-8
- Tight spacing: space-y-2 to space-y-4
- Generous spacing: space-y-8 to space-y-12

**Container Strategy:**
- Input form: max-w-2xl centered
- Report content: max-w-5xl with generous margins
- Full-width sections with inner constraints for readability

## Core Components

### Input Interface
**URL Form:**
- Large, prominent input field with text-lg
- Clear placeholder: "Enter website URL (e.g., https://example.com)"
- Primary action button: "Generate Audit Report"
- Minimal, focused design - no distractions
- Loading state with progress indicator during analysis

### Report Header
**Structure:**
- Company name: text-3xl font-bold
- Website URL: text-lg font-mono
- Audit date and metadata: text-sm
- Overall score prominently displayed: Large circular badge with text-5xl score
- Industry and key details in organized grid

### Executive Summary Card
**Layout:**
- Elevated card with rounded-lg borders
- Key findings as numbered list with text-lg
- Priority actions with numbered badges
- Clear visual separation between findings and actions

### Scoring Components
**Score Display:**
- Overall score: Large circular/rounded badge (120px+) with number
- Category scores: Horizontal rows with label + score + progress bar
- Progress bars: Full-width rounded bars showing fill percentage
- Numerical scores displayed as "X/10" or "X/100"

**Visual Indicators:**
- Checkmarks (✓) and crosses (✗) for feature comparisons
- Filled/unfilled progress indicators (■■■■□□□□□□)
- Priority badges (High/Medium/Low) as small rounded tags
- Impact ratings as inline badges

### Content Sections
**Section Structure:**
- Section number + title in text-2xl font-semibold
- Border-left accent on sections (border-l-4)
- Subsections with text-xl headings
- Consistent py-8 between major sections

**Data Presentation:**
- Two-column grids for comparisons (grid-cols-1 md:grid-cols-2)
- Definition lists for key-value pairs
- Tables for competitive analysis with alternating row treatment
- Quoted content in italic with quotation marks

### Recommendation Cards
**Card Design:**
- Each recommendation as distinct card with rounded-lg
- Title in text-lg font-semibold
- Metadata row: Impact | Effort | Priority badges
- "Why" section in regular weight
- "How" section with numbered steps (pl-4)
- "Expected Outcome" highlighted

### Comparison Tables
**Structure:**
- Sticky header row
- Feature names in left column
- Competitor columns with checkmarks/scores
- Responsive: Stack on mobile, table on desktop

## Navigation & Organization

**Report Navigation:**
- Sticky table of contents sidebar on desktop (hidden on mobile)
- Jump links to major sections
- "Back to Top" button when scrolling
- Section numbering for easy reference

**Print/Export Optimization:**
- Page break controls for PDF export
- Print-friendly spacing and margins
- No fixed backgrounds or complex overlays
- High-contrast text for readability

## Interaction Patterns

**Form Interaction:**
- Auto-focus on input field
- Real-time URL validation
- Disabled submit until valid URL entered
- Loading state with "Analyzing website..." message

**Report Generation:**
- Smooth scroll to report after generation
- Collapsible sections for long content
- Copy-to-clipboard for URLs and specific data points
- Print/PDF export button prominently placed

## Accessibility

**WCAG Compliance:**
- Semantic HTML structure (proper heading hierarchy)
- ARIA labels for score indicators
- Keyboard navigation throughout
- Focus indicators on interactive elements
- High contrast text-to-background ratios

## Responsive Behavior

**Breakpoint Strategy:**
- Mobile (base): Single column, stacked elements
- Tablet (md: 768px): Two-column grids, expanded spacing
- Desktop (lg: 1024px): Full layout with sidebar navigation

**Mobile Optimizations:**
- Simplified score displays
- Collapsed tables to cards
- Touch-friendly button sizes (min-h-12)
- Reduced section padding (py-8 vs py-16)

## Visual Hierarchy

**Emphasis Levels:**
1. Overall score and company name (largest, boldest)
2. Section headers and key findings
3. Category scores and recommendations
4. Supporting details and evidence
5. Technical metadata and timestamps

**Spacing Rhythm:**
- Tight grouping for related items (space-y-2)
- Medium spacing within sections (space-y-6)
- Large spacing between major sections (space-y-12)
- Extra breathing room around hero elements (my-16)

## Special Elements

**Badge System:**
- Priority levels: Small rounded badges (px-3 py-1 rounded-full text-xs)
- Score categories: Inline tags
- Status indicators: Icon + text combinations

**Progress Visualization:**
- Linear progress bars: h-2 rounded-full with fill animation
- Circular progress: SVG-based for overall score
- Comparison bars: Side-by-side for competitor analysis

This tool prioritizes clarity, professionalism, and easy comprehension of complex audit data while maintaining visual appeal for client-facing reports.