# Instructions on how to create database for application:
## Install and start Python virtual environment
	> sudo pip install virtualenv
	> virtualenv -p python2.7 .vmv
	> . .vmv/bin/activate

## Install Geoencoder and Zipcode package
    > pip install geopy
    > pip install uszipcode
    > pip install zipcode

## Export the database from your_company.com WordPress site in chunk of 20000 records into CSV files
Log into your WordPress site and export the database in CSV format in 20000 records for each file.
WordPress seems to die if you export a lot of records. I found 20000 seems to be a good number without killing WordPress.
You should have a few CSV files such as:
	orgsandrescues_listing-20180227.csv
	petservices_listing-20180227-1.csv
	petservices_listing-20180227-2.csv
	petservices_listing-20180227-3.csv
	petservices_listing-20180227-4.csv

## Remove columns that are not needed as in below:
First figure out the columns that you want to remove from these CSV formatted files.

Columns to remove petservices:
	A,B ,K, L, M, O, P, S, T, U, V, W, X, Y, Z,AA,AB,AC,AF,AG,AH,AJ,AK,AL,AM,AN,AO,AP,AQ,
	0,1,10,11,12,14,15,18,19,20,21,22,23,24,25,26,27,28,31,32,33,35,36,37,38,39,40,41,42

	figure out the column numbers in reverse order
	42,41,40,39,38,37,36,35,33,32,31,28,27,26,25,24,23,22,21,20,19,18,15,14,12,11,10,1,0

	columns to remove in organdrescues_listing
	A,B, K, L, M, N, P, Q, R, S, T, U, V, W, X,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AN,AO,AS
	0,1,10,11,12,13,15,16,17,18,19,20,21,22,23,27,28,29,30,31,32,33,34,35,36,37,39,40,44

	figure out the column numbers in reverse order
	44,40,39,37,36,35,34,33,32,31,30,29,28,27,23,22,21,20,19,18,17,16,15,13,12,11,10,1,0

## Use the python script ziprmcsv.py to fix up zipcode,lat,long and remove the unneccessary columns from the CSV files as in:

	Fix up zipcode,lat,long and remove the columns from the petservices_listing files:

	> python ./ziprmcsv.py -i petservices_listing-20180227-1.csv,petservices_listing-20180227-2.csv,petservices_listing-20180227-3.csv,petservices_listing-20180227-4.csv -o importdata/petservices.csv -x 42,41,40,39,38,37,36,35,33,32,31,28,27,26,25,24,23,22,21,20,19,18,15,14,12,11,10,1,0

	Fix up zipcode,lat,long and remove the columns from the organdrescues_listing file:

	> python ./ziprmcsv.py -i orgsandrescues_listing-20180227.csv -o importdata/orgsandrescues.csv -x 44,40,39,37,36,35,34,33,32,31,30,29,28,27,23,22,21,20,19,18,17,16,15,13,12,11,10,1,0

## Setup the zipcode, latitude, longitude
Copy the ZIP Code Tablulation Areas from https://www.census.gov/geo/maps-data/data/gazetteer2017.html

Replace all tabs with commas "'"

Use excel to remove all columns that are not needed. Only keep zipcode,lattiude,longitude

## Fix up breed.csv file
Get a dump of the breeds information from Wordpress, then remove all the unused columns 

Fix up the breed_info_heigt with find and replace all &quot; with "in" for inches. Also do any other clean up like extra spaces to make the column data consistent

Add URL for the images by getting the information from the site and add the CSV in a separate column.

## Use the python script csv2sqlite.py to create a sqlite database from csv files:
    > python csv2sqlite.py your_company.db importdata/


Use a SQLite browser and open the database and change the zipcode table longitude and latitude field from type text to numeric.
Also change to number fields in the dog breed table from type text to numeric.

## Upload the SQLite database to your server with the version file your_company.csv
