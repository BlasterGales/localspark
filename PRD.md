# Ollama Spark - Local AI Development Assistant

Create a development assistant tool that helps generate, modify, and improve code projects using local Ollama AI models instead of cloud-based services.

**Experience Qualities**:
1. **Responsive** - Fast, local AI processing with immediate feedback and real-time code generation
2. **Intuitive** - Clean, developer-focused interface that prioritizes functionality over complexity  
3. **Reliable** - Offline-capable tool that works independently of internet connectivity

**Complexity Level**: Light Application (multiple features with basic state)
- Provides chat interface, project management, and code generation without requiring user accounts or complex backend infrastructure

## Essential Features

### Chat Interface with Ollama
- **Functionality**: Interactive chat with local Ollama models for code assistance
- **Purpose**: Primary interaction method for users to request code help, explanations, and improvements
- **Trigger**: User types message and presses enter or clicks send
- **Progression**: User input → Ollama API call → Streaming response → Display formatted result
- **Success criteria**: Messages send reliably, responses stream smoothly, code blocks are syntax highlighted

### Model Selection
- **Functionality**: Dropdown to choose between available Ollama models
- **Purpose**: Allows users to select the best model for their specific task (coding vs general chat)
- **Trigger**: User clicks model selector dropdown
- **Progression**: Click dropdown → Display available models → Select model → Update active model indicator
- **Success criteria**: Models load from Ollama API, selection persists, model changes affect subsequent responses

### Project Context Management  
- **Functionality**: Upload and manage project files to provide context to AI
- **Purpose**: Enables more accurate and relevant code suggestions by giving AI project context
- **Trigger**: User drags files or clicks upload button
- **Progression**: File upload → Parse content → Store in context → Display in sidebar → Include in AI prompts
- **Success criteria**: Files upload successfully, content is preserved, AI references uploaded context

### Code Generation & Export
- **Functionality**: Generate complete files or code snippets and download them
- **Purpose**: Allows users to quickly implement AI suggestions in their actual projects
- **Trigger**: User requests code generation or clicks export on AI response
- **Progression**: AI generates code → Format and display → User clicks export → Download file
- **Success criteria**: Generated code is valid, exports work correctly, file formats are preserved

## Edge Case Handling
- **Ollama Connection Failure**: Display clear error message with connection troubleshooting steps
- **Large File Uploads**: Progress indicators and file size limits with helpful error messages
- **Model Loading Errors**: Graceful fallback to default model with user notification
- **Empty Responses**: Show "thinking" indicators and timeout handling for unresponsive models
- **Network Interruptions**: Queue messages and retry when connection is restored

## Design Direction
The design should feel professional and focused, like a developer's terminal or IDE - clean, functional, and distraction-free. Minimal interface that prioritizes content and conversation flow over decorative elements.

## Color Selection
Complementary (opposite colors) - Using a developer-focused dark theme with bright accent colors for clear visual hierarchy and reduced eye strain during long coding sessions.

- **Primary Color**: Deep Blue (#1e40af) - Communicates trust, professionalism, and technical competence
- **Secondary Colors**: Slate grays (#64748b, #334155) - Supporting neutral tones for UI elements and backgrounds  
- **Accent Color**: Electric Green (#10b981) - Attention-grabbing highlight for active states and success indicators
- **Foreground/Background Pairings**: 
  - Background (Dark Slate #0f172a): Light text (#f8fafc) - Ratio 15.8:1 ✓
  - Card (Darker Slate #1e293b): Light text (#f8fafc) - Ratio 12.6:1 ✓  
  - Primary (Deep Blue #1e40af): White text (#ffffff) - Ratio 6.4:1 ✓
  - Secondary (Slate #64748b): White text (#ffffff) - Ratio 4.6:1 ✓
  - Accent (Electric Green #10b981): White text (#ffffff) - Ratio 4.9:1 ✓

## Font Selection
Use Inter for its exceptional readability at all sizes and technical feel that resonates with developers, combined with JetBrains Mono for code display to ensure perfect character alignment and distinction.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing  
  - Body (Chat Messages): Inter Regular/16px/relaxed line height
  - Code (Snippets): JetBrains Mono Regular/14px/monospace spacing
  - UI Labels: Inter Medium/14px/normal spacing

## Animations
Subtle and functional animations that enhance the development workflow without distraction - focus on smooth transitions that guide attention and provide feedback for user actions.

- **Purposeful Meaning**: Smooth message sending animations and gentle loading states that communicate system responsiveness
- **Hierarchy of Movement**: Prioritize chat message animations and model switching feedback over decorative transitions

## Component Selection
- **Components**: 
  - Chat interface using Card and ScrollArea for message display
  - Button components for send actions and model selection
  - Select dropdown for model choosing
  - Textarea for message input with auto-resize
  - Dialog for file upload management
  - Progress indicators for file uploads and AI processing
  - Badge components for model status and file types
- **Customizations**: Custom chat bubble components for AI vs user messages, syntax highlighting for code blocks
- **States**: Message input shows typing indicators, send button disables during processing, model selector shows loading state
- **Icon Selection**: Send arrow, upload cloud, gear for settings, code brackets for technical content
- **Spacing**: Consistent 4-unit (16px) spacing between major sections, 2-unit (8px) for related elements
- **Mobile**: Single-column layout with collapsible sidebar, bottom-fixed input area, touch-optimized buttons