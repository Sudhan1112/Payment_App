-- Insert sample admin user
INSERT INTO users (email, name, role, email_verified) 
VALUES ('admin@budgetti.com', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (user_id, amount, type, category, description, status) 
SELECT 
    u.id,
    CASE 
        WHEN random() > 0.5 THEN (random() * 1000 + 100)::DECIMAL(12,2)
        ELSE -(random() * 500 + 50)::DECIMAL(12,2)
    END,
    CASE 
        WHEN random() > 0.5 THEN 'income'
        ELSE 'expense'
    END,
    CASE 
        WHEN random() > 0.7 THEN 'Food'
        WHEN random() > 0.5 THEN 'Transport'
        WHEN random() > 0.3 THEN 'Entertainment'
        ELSE 'Utilities'
    END,
    'Sample transaction',
    'completed'
FROM users u
WHERE u.email = 'admin@budgetti.com'
AND NOT EXISTS (SELECT 1 FROM transactions WHERE user_id = u.id)
LIMIT 10;
