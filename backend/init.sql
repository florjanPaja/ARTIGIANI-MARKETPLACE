-- Estensione per UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- UTENTI
CREATE TABLE utenti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    ruolo VARCHAR(20) NOT NULL CHECK (ruolo IN ('cliente', 'artigiano', 'admin')),
    telefono VARCHAR(20),
    indirizzo TEXT,
    citta VARCHAR(100),
    cap VARCHAR(10),
    stato VARCHAR(100),
    nome_attivita VARCHAR(255),
    partita_iva VARCHAR(20),
    bio TEXT,
    sito_web VARCHAR(255),
    livello_admin INT CHECK (livello_admin BETWEEN 1 AND 5),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_utenti_email ON utenti(email);

-- ARTICOLI
CREATE TABLE articoli (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_artigiano UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descrizione TEXT,
    prezzo NUMERIC(10, 2) NOT NULL CHECK (prezzo >= 0),
    disponibilita INT NOT NULL CHECK (disponibilita >= 0),
    categoria VARCHAR(100),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sconto_percentuale NUMERIC(5,2) CHECK (sconto_percentuale BETWEEN 0 AND 100),
    prezzo_scontato NUMERIC(10, 2) GENERATED ALWAYS AS (
        CASE
            WHEN sconto_percentuale IS NOT NULL THEN
                prezzo - (prezzo * sconto_percentuale / 100)
            ELSE NULL
        END
    ) STORED,
    in_sconto BOOLEAN DEFAULT FALSE,
    data_inizio_sconto TIMESTAMP,
    data_fine_sconto TIMESTAMP,
    immagini JSONB DEFAULT '[]' CHECK (jsonb_typeof(immagini) = 'array')
);

CREATE INDEX idx_articoli_artigiano ON articoli(id_artigiano);

-- TESTATA ORDINE
CREATE TABLE testata_ordine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_utente UUID NOT NULL REFERENCES utenti(id) ON UPDATE CASCADE,
    data_ordine TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stato VARCHAR(20) NOT NULL CHECK (stato IN ( 'pagato','in preparazione', 'spedito', 'annullato'))
);

CREATE INDEX idx_testata_ordine_utente ON testata_ordine(id_utente);

-- RIGA ORDINE
CREATE TABLE riga_ordine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_testata UUID NOT NULL REFERENCES testata_ordine(id) ON DELETE CASCADE ON UPDATE CASCADE,
    id_articolo UUID NOT NULL REFERENCES articoli(id) ON UPDATE CASCADE,
    prezzo_unitario NUMERIC(10,2) NOT NULL CHECK (prezzo_unitario >= 0),
    quantita INT NOT NULL CHECK (quantita > 0),
    totale_riga NUMERIC(12, 2) GENERATED ALWAYS AS (prezzo_unitario * quantita) STORED
);

CREATE INDEX idx_riga_ordine_testata ON riga_ordine(id_testata);

-- PAGAMENTI
CREATE TABLE pagamenti (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_ordine UUID UNIQUE NOT NULL REFERENCES testata_ordine(id) ON DELETE CASCADE ON UPDATE CASCADE,
    importo NUMERIC(10,2) NOT NULL CHECK (importo >= 0),
    metodo_pagamento VARCHAR(50) NOT NULL CHECK (metodo_pagamento IN ('carta', 'paypal', 'bonifico')),
    stato_pagamento VARCHAR(20) NOT NULL CHECK (stato_pagamento IN ('in_attesa', 'completato', 'fallito')),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPEDIZIONI
CREATE TABLE spedizioni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_ordine UUID UNIQUE NOT NULL REFERENCES testata_ordine(id) ON DELETE CASCADE ON UPDATE CASCADE,
    id_utente UUID NOT NULL REFERENCES utenti(id) ON UPDATE CASCADE,
    indirizzo_spedizione TEXT NOT NULL,
    citta VARCHAR(100) NOT NULL,
    cap VARCHAR(10) NOT NULL,
    stato VARCHAR(100) NOT NULL,
    tracking_code VARCHAR(100),
    stato_spedizione VARCHAR(20) DEFAULT 'in_preparazione'
        CHECK (stato_spedizione IN ('in_preparazione', 'spedito', 'consegnato')),
    data_spedizione TIMESTAMP
);

-- TESTATA CARRELLO
CREATE TABLE testata_carrello (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_utente UUID UNIQUE NOT NULL REFERENCES utenti(id) ON UPDATE CASCADE,
    data_aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RIGA CARRELLO
CREATE TABLE riga_carrello (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_testata UUID NOT NULL REFERENCES testata_carrello(id) ON DELETE CASCADE ON UPDATE CASCADE,
    id_articolo UUID NOT NULL REFERENCES articoli(id) ON UPDATE CASCADE,
    prezzo_unitario NUMERIC(10,2) NOT NULL CHECK (prezzo_unitario >= 0),
    quantita INT NOT NULL CHECK (quantita > 0)
);

-- SEGNALAZIONI
CREATE TABLE segnalazioni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_utente UUID NOT NULL REFERENCES utenti(id) ON DELETE CASCADE ON UPDATE CASCADE,
    oggetto TEXT NOT NULL,
    stato_segnalazione VARCHAR(30) NOT NULL CHECK (
        stato_segnalazione IN ('aperta', 'in_gestione', 'attesa_risposta_utente', 'risolta')
    ),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_segnalazioni_utente ON segnalazioni(id_utente);

-- MESSAGGI DELLA SEGNALAZIONE (chat)
CREATE TABLE segnalazione_messaggi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_segnalazione UUID NOT NULL REFERENCES segnalazioni(id) ON DELETE CASCADE ON UPDATE CASCADE,
    mittente VARCHAR(20) NOT NULL CHECK (mittente IN ('utente', 'admin')),
    messaggio TEXT NOT NULL,
    data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messaggi_segnalazione ON segnalazione_messaggi(id_segnalazione);
