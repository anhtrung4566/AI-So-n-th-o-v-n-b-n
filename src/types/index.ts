export interface ReviewError {
  category: string;
  severity: 'critical' | 'warning' | 'suggestion';
  original_text: string;
  explanation: string;
  suggested_correction: string;
}

export type PartyDocumentType =
  | 'Nghị quyết'
  | 'Quyết định'
  | 'Hướng dẫn'
  | 'Quy định'
  | 'Kế hoạch'
  | 'Thông báo'
  | 'Tờ trình'
  | 'Công văn'
  | 'Kết luận'
  | 'Báo cáo'
  | 'Biên bản';

export interface DocumentReviewResult {
  document_type: string;
  overall_score: number;
  general_assessment: string;
  errors: ReviewError[];
  full_corrected_text: string;
}

export interface GeneratedDocument {
  document_title: string;
  document_type: string;
  full_text: string;
  notes: string[];
}

export interface FormalRewriteResult {
  original_analysis: string;
  formal_text: string;
  key_improvements: string[];
}
