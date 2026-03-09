-- Sample data for development and testing

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_id, transport_type, capacity, operator) VALUES
('BN N71', 'train', 400, 'SBB'),
('B704', 'bus', 80, 'SBB'),
('T301', 'tram', 120, 'SBB'),
('IC 915', 'train', 600, 'SBB'),
('RE 4567', 'train', 300, 'SBB');

-- Insert sample routes
INSERT INTO routes (route_code, origin_station, destination_station, description) VALUES
('IC1', 'Zürich HB', 'Genève-Aéroport', 'Zürich, Central → Genève-Aéroport'),
('S1', 'Zürich HB', 'Zürich, Loorenstrasse', 'Zürich, Central → Zürich, Loorenstrasse'),
('BUS_74', 'Bern, Bahnhof', 'Bern, Wabern', 'Bus line 74'),
('T12', 'Zürich, Hauptbahnhof', 'Zürich, Stettbach', 'Tram line 12'),
('RE', 'Basel SBB', 'Zürich HB', 'Regional Express');

-- Insert sample users
INSERT INTO users (sbb_user_id, email, phone, preferred_language, has_monthly_pass) VALUES
('sbb_001', 'user1@example.com', '+41791234567', 'de', true),
('sbb_002', 'user2@example.com', '+41792345678', 'fr', false),
('sbb_003', 'user3@example.com', '+41793456789', 'it', true),
('sbb_004', 'user4@example.com', '+41794567890', 'en', false);

-- Insert sample trips (last 7 days)
INSERT INTO trips (vehicle_id, route_id, departure_time, arrival_time, trip_date)
SELECT
    v.id,
    r.id,
    DATE_TRUNC('hour', NOW() - (RANDOM() * INTERVAL '7 days')) + (RANDOM() * INTERVAL '12 hours'),
    DATE_TRUNC('hour', NOW() - (RANDOM() * INTERVAL '7 days')) + (RANDOM() * INTERVAL '12 hours') + INTERVAL '2 hours',
    (CURRENT_DATE - (RANDOM() * 7)::INTEGER)
FROM vehicles v
CROSS JOIN routes r
LIMIT 50;