---
version: '1.0'
design:
  colors:
    primary:
      accent: '#1a6b3c'
      accent-hover: '#2d9e60'
      accent-light: '#e8f5ee'
      ink: '#0a0a0f'
      ink-light: '#1a1a2e'
    secondary:
      amber: '#c8800a'
      amber-light: '#fef3e0'
      blue: '#1a3a6b'
      blue-light: '#e8eef8'
      sand: '#d4c9a8'
      sand-dark: '#b8a87a'
    background:
      cream: '#faf8f3'
      surface: '#f5f3ee'
      surface-alt: '#eceae3'
    text:
      primary: '#0a0a0f'
      mid: '#3d3d4a'
      muted: '#6b6b7a'
      inverse: '#ffffff'
    sdg:
      goal-1: '#E5243B'
      goal-2: '#DDA63A'
      goal-3: '#4C9F38'
      goal-4: '#C5192D'
      goal-5: '#FF3A21'
      goal-6: '#26BDE2'
      goal-7: '#FCC30B'
      goal-8: '#A21942'
      goal-9: '#FD6925'
      goal-10: '#DD1367'
      goal-11: '#FD9D24'
      goal-12: '#BF8B2E'
      goal-13: '#3F7E44'
      goal-14: '#0A97D9'
      goal-15: '#56C02B'
      goal-16: '#00689D'
      goal-17: '#19486A'
  typography:
    fonts:
      display: '''Syne'', sans-serif'
      body: '''DM Sans'', sans-serif'
      mono: '''DM Mono'', monospace'
    letter-spacing:
      tight: -0.03em
      normal: -0.01em
      wide: 0.1em
    line-height:
      body: '1.6'
  spacing:
    container-padding: 2.5rem
    header-height: 64px
    input-padding: 16px 24px
    btn-padding: 14px 32px
  radii:
    md: 12px
    lg: 16px
    xl: 20px
    xxl: 28px
    pill: 40px
  breakpoints:
    sm: 640px
    md: 768px
    lg: 1024px
    xl: 1280px
  shadows:
    sm: 0 2px 4px rgba(10, 10, 15, 0.05)
    md: 0 12px 24px -8px rgba(10, 10, 15, 0.08), 0 4px 6px -2px rgba(10, 10, 15, 0.03)
    lg: 0 25px 50px -12px rgba(10, 10, 15, 0.12), 0 8px 15px -5px rgba(10, 10, 15,
      0.05)
    xl: 0 35px 70px -15px rgba(10, 10, 15, 0.18), 0 10px 20px -5px rgba(10, 10, 15,
      0.08)
    focus-ring: 0 0 0 4px rgba(26, 107, 60, 0.08)
  motion:
    fast: all 0.2s ease
    smooth: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)
    float: float 6s ease-in-out infinite
  effects:
    glass:
      background: rgba(255, 255, 255, 0.65)
      backdrop-filter: blur(12px)
      border: 1px solid rgba(180, 168, 130, 0.15)
name: SDGSync Design System
colors:
  surface: '#f5f3ee'
  surface-dim: '#dcd9e0'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2fa'
  surface-container: '#f0ecf4'
  surface-container-high: '#eae7ee'
  surface-container-highest: '#e4e1e9'
  on-surface: '#1b1b20'
  on-surface-variant: '#404940'
  inverse-surface: '#303036'
  inverse-on-surface: '#f3eff7'
  outline: '#707a70'
  outline-variant: '#bfc9be'
  surface-tint: '#1b6c3d'
  primary: '#005129'
  on-primary: '#ffffff'
  primary-container: '#1a6b3c'
  on-primary-container: '#9ae9ae'
  inverse-primary: '#89d89e'
  secondary: '#865300'
  on-secondary: '#ffffff'
  secondary-container: '#fead3e'
  on-secondary-container: '#6e4400'
  tertiary: '#782c38'
  on-tertiary: '#ffffff'
  tertiary-container: '#96434f'
  on-tertiary-container: '#ffcace'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a5f4b8'
  primary-fixed-dim: '#89d89e'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#005229'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb960'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2b9'
  on-tertiary-fixed: '#3f0110'
  on-tertiary-fixed-variant: '#792d39'
  background: '#fcf8ff'
  on-background: '#1b1b20'
  surface-variant: '#e4e1e9'
  accent-hover: '#2d9e60'
  accent-light: '#e8f5ee'
  ink-light: '#1a1a2e'
  amber-light: '#fef3e0'
  blue: '#1a3a6b'
  blue-light: '#e8eef8'
  sand: '#d4c9a8'
  sand-dark: '#b8a87a'
  cream: '#faf8f3'
  surface-alt: '#eceae3'
  text-mid: '#3d3d4a'
  text-muted: '#6b6b7a'
  sdg-1: '#E5243B'
  sdg-2: '#DDA63A'
  sdg-3: '#4C9F38'
  sdg-4: '#C5192D'
  sdg-5: '#FF3A21'
  sdg-6: '#26BDE2'
  sdg-7: '#FCC30B'
  sdg-8: '#A21942'
  sdg-9: '#FD6925'
  sdg-10: '#DD1367'
  sdg-11: '#FD9D24'
  sdg-12: '#BF8B2E'
  sdg-13: '#3F7E44'
  sdg-14: '#0A97D9'
  sdg-15: '#56C02B'
  sdg-16: '#00689D'
  sdg-17: '#19486A'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-base:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  section-padding: 2.5rem
  header-height: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

# SDGSync Design System & Application Architecture

SDGSync employs a warm, professional, and slightly elevated institutional aesthetic. It draws inspiration from sustainable development initiatives, combining earthy and natural tones (cream, sand, deep green) with highly readable modern typography and subtle glassmorphic effects to create a trustworthy, high-fidelity experience.

This document serves as the absolute blueprint for the frontend design, explicitly mapping every backend feature, UI element, button, and user flow required to build the complete application.

## 1. Design Philosophy & Component Characteristics

- **Earthy yet Corporate Backgrounds**: The primary background is "cream" (`#faf8f3`), creating a warm atmosphere. Deep ink (`#0a0a0f`) replaces stark black for text.
- **The SDG Identity**: The 17 official United Nations SDG colors are explicitly integrated into charts, badges, and project mapping tools.
- **Glassmorphism**: Top navigation bars, side panels, and modal overlays utilize a frosted glass effect (backdrop blurs over semi-transparent white).
- **Cards**: "Premium Cards" are the backbone of the layout. They sit on a clean white background, bordered by a subtle sand color, featuring a generous `28px` corner radius. On hover, they gently translate upwards by `1px-2px` and intensify their shadow.
- **Buttons**:
  - *Primary*: High-contrast ink background with white text, rounded (`16px-20px`). Employ a subtle scale-down (`active:scale-95`) on click.
  - *Secondary*: Clean white aesthetic with subtle borders.
  - *Ghost/Tertiary*: Blend into the surface but reveal a soft background upon hover.
  - *Destructive*: Red/Amber accents applied specifically for deleting tasks or dropping students.
- **Inputs & Forms**: Deeply padded with an off-white `surface` background, rounding at `16px`. They transition to a stark white background with a sophisticated, semi-transparent green focus ring when active.

---

## 2. Core Application Pages & Feature Specifications

Below is the exhaustive, detailed breakdown of every page, the backend features it supports, and the exact interactive elements (buttons, forms, and options) that must be present.

### A. Authentication & Onboarding (`/login` & `/register`)
The gateway to the platform, utilizing a pristine, distraction-free environment.
- **Features (Backend Mapped)**: JWT-based authentication, Role-Based Access Control (Faculty vs. Student).
- **UI Elements & Buttons**:
  - **Role Toggle**: A segmented control allowing the user to select "Student" or "Faculty" during registration.
  - **Inputs**: Full Name, Email, Password, Department, and Designation (for Faculty) or Roll Number (for Students).
  - **Buttons**: "Create Account" (Primary), "Sign In" (Primary).
  - **Links**: "Already have an account? Log in" / "Need an account? Sign up".

### B. Dashboard (`/dashboard`)
The primary operational hub, adapting dynamically based on the user's role.
- **Features (Backend Mapped)**: Project listing, status tracking, task progression calculations.
- **Faculty View**:
  - **UI Elements**: Grid of Premium Cards representing owned projects. Badges indicating status ("On Track", "Delayed", "Completed").
  - **Buttons**: A prominent "Create New Project" CTA button. "Manage Project" buttons on each card.
- **Student View**:
  - **UI Elements**: Grid of assigned projects. Progress bars calculating the completion rate (`(done tasks / total tasks) * 100`).
  - **Buttons**: "Open Workspace" button on assigned projects.

### C. Create Project Flow (`/project/new`)
A sophisticated form flow restricted to Faculty, utilizing the AI-driven ML backend.
- **Features (Backend Mapped)**: NLP model inference for SDG classification, Project document creation.
- **UI Elements**:
  - **Inputs**: Project Title (Text), Problem Statement (Textarea).
  - **Buttons & Interactions**:
    - **"Analyze Problem Statement" (Action Button)**: Triggers the `/ml/analyze` backend route. This is a critical feature.
    - **ML Output Display**: Renders the "Applied SDGs" and "Most Suitable SDGs" returned by the AI, complete with confidence scores and corresponding SDG colors.
    - **"Create Project" (Submit Button)**: Saves the project to the database.

### D. Project Workspace (`/project/:projectId/workspace`)
The most complex and feature-rich view. It acts as a collaborative suite divided into four distinct tabs/modules.

#### Tab 1: Overview & Team Management
- **Features (Backend Mapped)**: Project status patching, Faculty-to-Student team assignment, Role verification.
- **UI Elements & Buttons**:
  - **Status Dropdown/Toggle**: Faculty only. Options: "On Track", "Delayed", "Completed".
  - **Team Assignment Modal/Section**: Faculty only.
    - Select dropdowns to assign a "Team Leader" and "Team Members".
    - **Button**: "Assign Team" to persist the changes.
  - **Information Display**: Displays the SDG mappings (with colored badges), the Problem Statement, and the list of assigned students.

#### Tab 2: Task Management (Kanban / List)
- **Features (Backend Mapped)**: CRUD operations for tasks, File attachment handling (Upload/Download/Delete).
- **UI Elements & Buttons**:
  - **"Add Task" Button**: Opens a modal with "Title" and "Description" inputs.
  - **Task Cards**: Displayed in columns or a list (TODO, IN PROGRESS, DONE).
  - **Task Options**:
    - Dropdown/Buttons to move task status (e.g., "Mark as Done", "Move to In Progress").
    - **"Delete Task" Button** (Destructive).
  - **Attachment UI (Inside Task)**:
    - **File Input & "Upload File" Button**: Triggers `multipart/form-data` upload (PDF, images, zips).
    - **Attachment List**: Shows uploaded files with size and uploader name.
    - **"Download" Icon/Button**.
    - **"Delete Attachment" Icon/Button** (Restricted to Uploader or Faculty).

#### Tab 3: Real-Time Chat
- **Features (Backend Mapped)**: WebSocket-driven real-time communication, chat history persistence.
- **UI Elements & Buttons**:
  - **Message Stream**: Displays messages wrapped in bubbles. Uses `surface-alt` background. Tags user roles ("Faculty" or "Student") next to their name.
  - **Typing Indicator**: Subtly displays "User is typing..." based on WebSocket broadcasts.
  - **Input Area**: Text input field.
  - **"Send" Button**: Or enter key listener to transmit the payload.

#### Tab 4: Literature & RAG (Retrieval-Augmented Generation)
- **Features (Backend Mapped)**: PDF text extraction, document chunking, semantic indexing, Groq LLM API integration for answering research questions based on context.
- **UI Elements & Buttons**:
  - **Document Upload Zone**: 
    - Drag-and-drop area or "Select File" button (accepts PDF, TXT, MD).
    - **"Upload Document" Button**: Triggers indexing in the background.
  - **Document Library**: Lists indexed papers, showing Title, Author, and number of indexed chunks. Includes a **"Delete" (Trash) Button** and a **"Download" Button** per document.
  - **The Researcher AI Console**:
    - **Query Input**: Deeply padded text input asking "What would you like to know about the literature?".
    - **"Ask AI" Button**: Triggers the `/rag/projects/{id}/query` endpoint.
    - **Response Box**: Displays the synthesized, formal academic answer returned by the LLM, formatted in standard body text or `DM Mono` for technical clarity.

### E. User Profile (`/profile`)
A clean settings interface for account management.
- **Features (Backend Mapped)**: User update endpoint (`PUT /auth/me`).
- **UI Elements**:
  - Read-only email display.
  - Editable Inputs: Full Name, Department, Designation/Roll Number.
  - **Button**: "Save Changes" (Primary).

### F. Institution Analytics (`/analytics`)
A macro-level dashboard restricted to Faculty.
- **Features (Backend Mapped)**: Aggregation of all projects, calculation of total tasks vs. completed tasks, mapping of SDG distribution across the institution.
- **UI Elements**:
  - **KPI Widgets**: Large Display typography showing "Total Projects", "Active Researchers", "Global Task Completion Rate".
  - **SDG Distribution Chart**: A bar or pie chart utilizing the exact 17 SDG colors mapped in the design tokens to visualize which Sustainable Development Goals the institution is focusing on most heavily.

## 3. Global UI States & System Utilities

To maintain consistency and provide feedback, the following global states are enforced across the entire application:

- **Interactive Backgrounds**: The Home and Authentication pages utilize a subtle, slow-moving particle system (`react-tsparticles`) to create an engaging "neural network" or "connected dots" visual, reinforcing the AI and collaboration themes of the project.
- **Notifications & Toasts**: Action feedback (success, errors, warnings) is handled via a globally positioned toast system (e.g., `react-hot-toast`). Toasts should reflect a premium dark theme (`ink` background, white text) with a `12px` border radius and a delicate translucent border (`1px solid rgba(255,255,255,0.1)`).
- **Loading States (Skeletons)**: When awaiting data (like fetching RAG results or loading project tasks), components must render as skeleton blocks using a shimmer animation, shifting smoothly between `surface` and `surface-alt` colors rather than a basic spinner.
- **Empty States**: Empty sections (e.g., "No tasks assigned", "No documents uploaded") must not be blank. They should feature a subtle, low-opacity icon, a muted text message centered within a container, and optionally utilize the infinite `float` animation to make the interface feel alive even when devoid of content.

---
*Note to Frontend Agent: This DESIGN.md is your source of truth. Ensure that every button, input, and feature listed in Section 2 is built into the UI, styled accurately according to the tokens in Section 1.*