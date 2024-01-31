-- USERDATA --

CREATE TABLE IF NOT EXISTS userData (
id INTEGER PRIMARY KEY,
nameLast TEXT,
nameFirst TEXT,
isPresent BOOL
);

INSERT INTO userData
    (id, nameLast, nameFirst, isPresent)
VALUES
    (001, "Smith", "John", 0),
    (002, "Doe", "Jane", 1);

-- TIMELOG --

CREATE TABLE IF NOT EXISTS timeLog (
id INTEGER PRIMARY KEY,
timeIn DATETIME,
timeOut DATETIME
);

INSERT INTO timeLog (id)
VALUES (001)
