To run webapp:
1) git clone main branch
2) cd backend - npm install - npm start
3) cd frontend - npm install - npm start
   ** if npm install doesn't work use npm install --legacy-peer-deps

To update database:
1) Make changes to models/init/db.sql
2) sqlite3 <path to rfidData.db>
3) DROP TABLE <tablename> (for all edited tables)
4) .read <path to init/db.sql>
