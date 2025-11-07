-- Seed menu items for RestoFlow
INSERT INTO menu_items (name, description, category, price, available, image_url) VALUES
  ('Salade César', 'Salade romaine, poulet grillé, parmesan, croûtons', 'entrée', 8.50, true, NULL),
  ('Soupe à l''oignon', 'Soupe gratinée au fromage', 'entrée', 6.50, true, NULL),
  ('Steak Frites', 'Steak de bœuf 250g, frites maison', 'plat', 18.50, true, NULL),
  ('Saumon Grillé', 'Saumon grillé, légumes de saison', 'plat', 22.00, true, NULL),
  ('Pizza Margherita', 'Tomate, mozzarella, basilic', 'plat', 12.00, true, NULL),
  ('Tiramisu', 'Dessert italien au café', 'dessert', 6.50, true, NULL),
  ('Crème Brûlée', 'Crème vanille caramélisée', 'dessert', 7.00, true, NULL),
  ('Coca-Cola', '33cl', 'boisson', 3.00, true, NULL),
  ('Vin Rouge', 'Verre 15cl', 'boisson', 5.00, true, NULL),
  ('Eau Minérale', '50cl', 'boisson', 2.50, true, NULL)
ON CONFLICT DO NOTHING;
