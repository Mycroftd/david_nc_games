In order to connect to this database first perform an npm install in order to install the relevant packages.

You will need to create the databases. This can be done by the command 'npm run setup-dbs'

In order to connect to the correct database you will need to create two .env files.  One named .env.test and .env.devlopment.  In each of these set PGDATABASE to the correct database. i.e. PGDATABASE=nc_games_test and PGDATABASE=nc_games


The hosted version can be found on https://be-nc-games-t92d.onrender.com/

To clone the project go to the directory you wish to install on and then run:

npm clone https://github.com/Mycroftd/david_nc_games.git
once cloned run npm install to install dependencies
To run the tests run npm testin the command line
