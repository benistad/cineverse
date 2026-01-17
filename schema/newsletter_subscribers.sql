-- Table pour stocker les abonnés à la newsletter
-- Note: On peut aussi utiliser uniquement MailerLite pour gérer les abonnés,
-- mais avoir une copie locale permet plus de flexibilité

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  is_confirmed BOOLEAN DEFAULT false,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  mailerlite_subscriber_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches par email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Index pour les abonnés confirmés (pour l'envoi)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmed ON newsletter_subscribers(is_confirmed) WHERE is_confirmed = true;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER trigger_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- RLS (Row Level Security) - Permettre les insertions publiques mais pas la lecture
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion (inscription)
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour via le token de confirmation
CREATE POLICY "Allow update with confirmation token" ON newsletter_subscribers
  FOR UPDATE USING (true);

-- Politique pour la lecture (admin seulement via service role)
CREATE POLICY "Allow read for service role" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'service_role');
