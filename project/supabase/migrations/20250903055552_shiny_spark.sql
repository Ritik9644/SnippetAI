/*
  # IntelliCode Database Schema

  1. New Tables
    - `snippets`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `code` (text, required) 
      - `language` (text, required)
      - `explanation` (text, nullable) - AI-generated explanation
      - `embedding` (vector, nullable) - for semantic search
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `snippets` table
    - Add policies for authenticated users to manage their own snippets only

  3. Extensions
    - Enable `pgvector` extension for vector embeddings and semantic search

  4. Indexes
    - Add index on user_id for efficient filtering
    - Add vector similarity index for fast semantic search
*/

-- Enable the pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create snippets table
CREATE TABLE IF NOT EXISTS snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  code text NOT NULL,
  language text NOT NULL DEFAULT 'javascript',
  explanation text,
  embedding vector(768), -- 768 dimensions for Google embedding models
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own snippets"
  ON snippets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own snippets"
  ON snippets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snippets"
  ON snippets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own snippets"
  ON snippets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language);

-- Create vector similarity index for semantic search
CREATE INDEX IF NOT EXISTS idx_snippets_embedding 
  ON snippets 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();