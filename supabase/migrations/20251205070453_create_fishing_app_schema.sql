/*
  # Fishing Bite Index App Schema

  1. New Tables
    - `fish_types`
      - `id` (uuid, primary key)
      - `name_ru` (text) - Russian name (Судак, Щука, etc.)
      - `name_en` (text) - English name for reference
      - `icon_name` (text) - Lucide icon name
      - `display_order` (integer) - Order on screen
      - `created_at` (timestamptz)
    
    - `ratings`
      - `id` (uuid, primary key)
      - `telegram_user_id` (text) - Telegram user ID
      - `fish_type_id` (uuid, foreign key)
      - `rating` (numeric) - Rating from 1.0 to 5.0
      - `latitude` (numeric) - GPS coordinates
      - `longitude` (numeric)
      - `air_temp` (numeric) - Temperature in Celsius
      - `pressure` (numeric) - Atmospheric pressure in mmHg
      - `wind_speed` (numeric) - Wind speed in m/s
      - `wind_direction` (text) - Wind direction (N, NE, E, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - `fish_types`: public read access
    - `ratings`: authenticated insert only, public aggregate read
*/

-- Create fish_types table
CREATE TABLE IF NOT EXISTS fish_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_en text NOT NULL,
  icon_name text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id text NOT NULL,
  fish_type_id uuid NOT NULL REFERENCES fish_types(id),
  rating numeric NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  air_temp numeric,
  pressure numeric,
  wind_speed numeric,
  wind_direction text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_fish_type ON ratings(fish_type_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_fish ON ratings(telegram_user_id, fish_type_id, created_at DESC);

-- Enable RLS
ALTER TABLE fish_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fish_types (public read)
CREATE POLICY "Anyone can view fish types"
  ON fish_types
  FOR SELECT
  USING (true);

-- RLS Policies for ratings
CREATE POLICY "Anyone can view ratings"
  ON ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert ratings"
  ON ratings
  FOR INSERT
  WITH CHECK (telegram_user_id IS NOT NULL AND telegram_user_id != '');

-- Seed fish types data
INSERT INTO fish_types (name_ru, name_en, icon_name, display_order) VALUES
  ('Судак', 'Zander', 'fish', 1),
  ('Щука', 'Pike', 'fish', 2),
  ('Окунь', 'Perch', 'fish', 3),
  ('Лещ', 'Bream', 'fish', 4),
  ('Плотва', 'Roach', 'fish', 5)
ON CONFLICT DO NOTHING;