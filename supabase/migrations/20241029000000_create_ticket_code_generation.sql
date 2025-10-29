-- Create a sequence to handle the ticket number increment
CREATE SEQUENCE tickets_kode_tiket_seq START 1;

-- Create a function to generate the ticket code
CREATE OR REPLACE FUNCTION generate_kode_tiket()
RETURNS TRIGGER AS $$
BEGIN
  NEW.kode_tiket := 'HD' || LPAD(nextval('tickets_kode_tiket_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert
CREATE TRIGGER set_kode_tiket
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION generate_kode_tiket();
