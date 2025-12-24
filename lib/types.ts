/**
 * ClientFlow Lite - Type Definitions
 * Phase 3: AI & Documents
 */

// ============================================================================
// Phase 3: Questionnaire Analysis Types
// ============================================================================

/**
 * Represents complexity estimation from Claude AI
 */
export type ComplexityLevel = "low" | "medium" | "high";

/**
 * Result of analyzing questionnaire responses using Claude
 */
export interface AnalysisResult {
    summary: string;
    keyPoints: string[];
    followUpQuestions: string[];
    scopeRecommendations: string[];
    estimatedComplexity: ComplexityLevel;
}

/**
 * A single questionnaire response from a client
 */
export interface QuestionnaireResponse {
    questionId: string;
    question?: string; // Optional, helpful for context
  response: string;
}

/**
 * Questionnaire Analysis record from database
 */
export interface QuestionnaireAnalysis {
    id: string;
    client_id: string;
    questionnaire_id: string;
    summary: string;
    key_points: string[];
    follow_up_questions: string[];
    scope_recommendations: string[];
    estimated_complexity: ComplexityLevel;
    claude_metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

/**
 * Request body for /api/ai/analyze endpoint
 */
export interface AnalyzeQuestionnaireRequest {
    clientId: string;
    questionnaireId: string;
    responses: QuestionnaireResponse[];
    projectContext: string;
}

/**
 * Response from /api/ai/analyze endpoint
 */
export interface AnalyzeQuestionnaireResponse {
    success: boolean;
    analysis: AnalysisResult & {
      generatedFollowUpQuestions: string[];
    };
    id: string;
}

/**
 * Error response from API endpoints
 */
export interface ApiErrorResponse {
    error: string;
    status?: number;
}

/**
 * Scope document structure
 */
export interface ScopeDocument {
    id: string;
    client_id: string;
    analysis_id: string;
    title: string;
    content_markdown: string;
    content_html?: string;
    pdf_url?: string;
    version: number;
    created_at: string;
    updated_at: string;
}

/**
 * Request to generate a scope document
 */
export interface GenerateScopeDocumentRequest {
    analysisId: string;
    clientName: string;
    projectName: string;
    clientId: string;
}

/**
 * Response from scope document generation
 */
export interface GenerateScopeDocumentResponse {
    success: boolean;
    document: ScopeDocument;
}

/**
 * Document editor state for scope documents
 */
export interface DocumentEditorState {
    documentId: string;
    content: string;
    isDirty: boolean;
    isSaving: boolean;
    lastSavedAt?: string;
}

/**
 * PDF export options
 */
export interface PdfExportOptions {
    format: "a4" | "letter";
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    includeWatermark: boolean;
    includePageNumbers: boolean;
}

/**
 * Request to export document as PDF
 */
export interface ExportPdfRequest {
    documentId: string;
    options?: Partial<PdfExportOptions>;
}

/**
 * Response from PDF export
 */
export interface ExportPdfResponse {
    success: boolean;
    pdfUrl: string;
    fileName: string;
}

// ============================================================================
// Claude API Types
// ============================================================================

/**
 * Claude message content types
 */
export interface ClaudeMessage {
    role: "user" | "assistant";
    content: string;
}

/**
 * Claude API response structure
 */
export interface ClaudeApiResponse {
    id: string;
    type: string;
    role: string;
    content: Array<{
      type: string;
      text: string;
    }>;
    model: string;
    stop_reason: string;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
}

// ============================================================================
// Generic API Response Wrapper
// ============================================================================

/**
 * Generic successful API response
 */
export interface ApiResponse<T> {
    success: true;
    data: T;
}

/**
 * Generic error API response
 */
export interface ApiError {
    success: false;
    error: string;
    code?: string;
}
