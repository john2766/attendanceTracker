-- USERDATA --

CREATE TABLE IF NOT EXISTS studentData (
rfidToken BLOB PRIMARY KEY NOT NULL,
id INTEGER UNIQUE NOT NULL,
nameLast TEXT NOT NULL,
nameFirst TEXT NOT NULL,
email TEXT UNIQUE NOT NULL
);

-- <classroom> --

CREATE TABLE IF NOT EXISTS EE206 (
id INTEGER,
timeIn TEXT,
timeOut TEXT
);

CREATE TABLE IF NOT EXISTS POTR063 (
id INTEGER,
timeIn TEXT,
timeOut TEXT
);

-- ATTENDANCE --

CREATE TABLE IF NOT EXISTS attendance (
id INTEGER NOT NULL,
classname TEXT NOT NULL,
attendances INTEGER NOT NULL,
monday INTEGER DEFAULT 0,
tuesday INTEGER DEFAULT 0,
wednesday INTEGER DEFAULT 0,
thursday INTEGER DEFAULT 0,
friday INTEGER DEFAULT 0
);

-- CLASSDATA --

CREATE TABLE IF NOT EXISTS classData (
className TEXT PRIMARY KEY NOT NULL,
username TEXT NOT NULL,
startTime TEXT NOT NULL,
endTime TEXT NOT NULL,
classroom TEXT NOT NULL,
days TEXT NOT NULL
);

-- INSTRUCTORDATA --

CREATE TABLE IF NOT EXISTS instructorData (
username TEXT,
password TEXT
);