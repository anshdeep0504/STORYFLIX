/*
  # Create stories table and setup security

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `genre` (text)

  2. Security
    - Enable RLS on `stories` table
    - Add policies for authenticated users to:
      - Read their own stories
      - Create new stories
      - Delete their own stories
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  genre text NOT NULL
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own stories
CREATE POLICY "Users can read own stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own stories
CREATE POLICY "Users can create stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own stories
CREATE POLICY "Users can delete own stories"
  ON stories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);