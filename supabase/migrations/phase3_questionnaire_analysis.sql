-- Phase 3: Questionnaire Analysis Table
-- For storing AI-generated analysis results from Claude

CREATE TABLE IF NOT EXISTS questionnaire_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    questionnaire_id UUID NOT NULL REFERENCES questionnaire_responses(id) ON DELETE CASCADE,

  -- Analysis Results
  summary TEXT NOT NULL,
    key_points JSONB NOT NULL DEFAULT '[]',
    follow_up_questions JSONB NOT NULL DEFAULT '[]',
    scope_recommendations JSONB NOT NULL DEFAULT '[]',
    estimated_complexity VARCHAR(20) NOT NULL CHECK (estimated_complexity IN ('low', 'medium', 'high')),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Optional: Store the raw Claude response for reference
  claude_metadata JSONB,

  CONSTRAINT unique_analysis_per_questionnaire UNIQUE(questionnaire_id)
  );

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_questionnaire_analysis_client_id 
ON questionnaire_analysis(client_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_analysis_questionnaire_id 
ON questionnaire_analysis(questionnaire_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_analysis_created_at 
ON questionnaire_analysis(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE questionnaire_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see analyses for their own clients
CREATE POLICY "Users can view their own client analyses"
ON questionnaire_analysis FOR SELECT
USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can only insert analyses for their own clients
CREATE POLICY "Users can create analyses for their own clients"
ON questionnaire_analysis FOR INSERT
WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can only update analyses for their own clients
CREATE POLICY "Users can update analyses for their own clients"
ON questionnaire_analysis FOR UPDATE
USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  )
WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

-- Create a trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_questionnaire_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_questionnaire_analysis_updated_at
BEFORE UPDATE ON questionnaire_analysis
FOR EACH ROW
EXECUTE FUNCTION update_questionnaire_analysis_updated_at();
