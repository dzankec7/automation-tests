-- W3Schools Try-It editor (https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all)
-- Shipper is matched by name, not by a hard-coded ShipperID, so the queries
-- stay correct if IDs differ between environments.

-- ---------------------------------------------------------------------------
-- 1) Customers who used United Package: one row per customer with the number
--    of such orders and their total value (Quantity * Product price),
--    highest value first.
--    COUNT(DISTINCT ...) is required: joining OrderDetails yields one row per
--    order line, so a plain COUNT would count lines, not orders.
--    Grouping by CustomerID (not only by name) keeps two customers that
--    happen to share a name apart.
-- ---------------------------------------------------------------------------
SELECT c.CustomerName,
       c.Country,
       COUNT(DISTINCT o.OrderID)            AS UnitedPackageOrders,
       ROUND(SUM(od.Quantity * p.Price), 2) AS TotalValue
FROM Customers c
JOIN Orders o        ON o.CustomerID = c.CustomerID
JOIN Shippers s      ON s.ShipperID  = o.ShipperID
JOIN OrderDetails od ON od.OrderID   = o.OrderID
JOIN Products p      ON p.ProductID  = od.ProductID
WHERE s.ShipperName = 'United Package'
GROUP BY c.CustomerID, c.CustomerName, c.Country
ORDER BY TotalValue DESC;

-- ---------------------------------------------------------------------------
-- 2) Customers who placed at least one order but never used United Package.
--    "Never" is a property of the customer, not of a single order, so it is
--    expressed with NOT EXISTS over all their orders. Filtering orders with
--    ShipperName <> 'United Package' would wrongly include customers who used
--    United Package on some orders and another shipper on others.
-- ---------------------------------------------------------------------------
SELECT c.CustomerName,
       c.Country
FROM Customers c
WHERE EXISTS (
        SELECT 1
        FROM Orders o
        WHERE o.CustomerID = c.CustomerID
      )
  AND NOT EXISTS (
        SELECT 1
        FROM Orders o
        JOIN Shippers s ON s.ShipperID = o.ShipperID
        WHERE o.CustomerID = c.CustomerID
          AND s.ShipperName = 'United Package'
      )
ORDER BY c.CustomerName;
