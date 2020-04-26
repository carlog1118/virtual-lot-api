BEGIN;

TRUNCATE
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users ("user_name", "password") 
VALUES
('Demouser', '$2a$12$XJ2aBPu7gMhLRr7e2eXBTuoGEZpCcz8bYmxLhdXoRzeEgbG2vsW.K');

COMMIT;
