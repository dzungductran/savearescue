#!/usr/bin/python
# -*- coding: utf-8 -*-
#

import sys
import getopt
import csv
import uszipcode
import geopy
import decimal


# Get Command Line Arguments

def main(argv):
    input_files = []
    output_file = ''
    xdels = []
    try:
        (opts, args) = getopt.getopt(argv, 'hi:o:x:', ['ifile=', 'ofile=', 'delete'])
    except getopt.GetoptError:
        print 'ziprmcsv.py -i <paths to inputfile> -o <path to outputfile> -x reversed_columns'
        sys.exit(2)
    for (opt, arg) in opts:
        if opt == '-h':
            print 'ziprmcsv.py -i <paths to inputfile> -o <path to outputfile> -x reversed_columns'
            sys.exit()
        elif opt in ('-i', '--ifile'):
            input_files = arg.split(',')
        elif opt in ('-o', '--ofile'):
            output_file = arg
        elif opt in ('-x', '--delete'):
            xdels = arg.split(',')   # columns to delete in reverse order

    if not xdels:
        print 'ziprmcsv: not enough arguments, please use -h'
        sys.exit()

    process_csv(input_files, output_file, xdels)

# Check to see if it is a number
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

# Read CSV File
def process_csv(input_files, output_file, xdels):
    strt_idx = 2
    city_idx = 3
    cnty_idx = 4
    addr_idx = 5
    state_idx = 9
    lat_idx = 6
    lon_idx = 7
    zip_idx = 8
    count = 0
    line = 0

    from geopy.geocoders import Nominatim
    from geopy.exc import GeocoderTimedOut
    geolocator = Nominatim()

    from uszipcode import ZipcodeSearchEngine
    search = ZipcodeSearchEngine()

    import zipcode

    with open(output_file, 'wb') as csvoutfile:
        writer = csv.writer(csvoutfile)

        # go through each input file
        for input_file in input_files:
            with open(input_file, 'rb') as csvfile:
                line = 1
                count = count+1
                reader = csv.reader(csvfile)

                # write header
                header = next(reader)
                if (count == 1):
                    # strip
                    for idx, column in enumerate(header):
                        if column.startswith("directory_"):
                            header[idx] = column[10:]
                        if column.startswith("content_"):
                            header[idx] = column[8:]
                    # add index
                    header[zip_idx] += "_id"
                    for c in xdels:
                        del header[int(c)]
                    writer.writerow(header)

                # read row and process
                for row in reader:
                    zip = row[zip_idx]
                    addr = row[addr_idx]
                    city = row[city_idx]
                    street = row[strt_idx]
                    country = row[cnty_idx]
                    state = row[state_idx]

                    # default to USA
                    if (country == '') or ('#VALUE!' in country):
                        country = 'US'
                        row[cnty_idx] = country
                    if ('#VALUE!' in city):
                        city = ''
                        row[city_idx] = city
                    if ('#VALUE!' in street):
                        street = ''
                        row[strt_idx] = street
                    if ('#VALUE!' in state):
                        state = ''
                        row[state_idx] = state
                    if ('#VALUE!' in zip):
                        zip = ''
                        row[zip_idx] = zip

                    # empty address
                    if (addr == '') and (street != ''):
                        addr = street + ', ' + city + ' ' + country
                        row[addr_idx] = addr

                    latitude = 0.0
                    longitude = 0.0
                    if row[lon_idx] != '':
                        longitude = float(row[lon_idx])
                    if row[lat_idx] != '':
                        latitude = float(row[lat_idx])
                    if latitude == 0.0 or longitude == 0.0:
                        try:
                            # print(addr)
                            location = geolocator.geocode(addr)
                            # print(location)
                            if (location != None):
                                row[lat_idx] = location.latitude
                                row[lon_idx] = location.longitude
                        except GeocoderTimedOut, e:
                            print 'error ' + addr

                        # reset variables
                        if (zip != '') and (is_number(zip)) and ((latitude == 0.0) or (longitude == 0.0)):
                            # print(zip)
                            my_zipcode = zipcode.isequal(zip)
                            # print(my_zipcode)
                            if my_zipcode != None:
                                row[lat_idx] = my_zipcode.lat
                                row[lon_idx] = my_zipcode.lon
                                if (city == ''):
                                    row[city_idx] = my_zipcode.city
                                if (state == ''):
                                    row[state_idx] = my_zipcode.state
                            else:
                                my_zipcode = search.by_zipcode(zip)
                                if my_zipcode != None:
                                    # print(my_zipcode)
                                    row[lat_idx] = my_zipcode.Latitude
                                    row[lon_idx] = my_zipcode.Longitude
                                    if (city == ''):
                                        row[city_idx] = my_zipcode.City
                                    if (state == ''):
                                        row[state_idx] = my_zipcode.State
                        elif (city != ''):
                            try:
                                res = []
                                if (state != ''):
                                    # print city + ',' + state
                                    res = search.by_city_and_state(city.strip(), state.strip())
                                else:
                                    # print city
                                    res = search.by_city(city.strip())
                                if len(res) > 0:
                                    my_zipcode = res[0]
                                    if (zip == ''):
                                        row[zip_idx] = my_zipcode.Zipcode
                                    if (state == ''):
                                        row[state_idx] = my_zipcode.State
                                    row[lat_idx] = my_zipcode.Latitude
                                    row[lon_idx] = my_zipcode.Longitude
                            except ValueError as e:
                                print(e)

                        latitude = row[lat_idx]
                        longitude = row[lon_idx]
                        # print(latitude)
                        # print(longitude)

                    # compute zip
                    if (zip == '') and (latitude != '') and (longitude != ''):
                        lat = float(latitude)
                        lon = float(longitude)
                        res = search.by_coordinate(lat, lon)
                        if len(res) > 0:
                            my_zipcode = res[0]
                            row[zip_idx] = my_zipcode.Zipcode
                            if (city == ''):
                                row[city_idx] = my_zipcode.City
                            if (state == ''):
                                row[state_idx] = my_zipcode.State
                    f=row[zip_idx].find('-')
                    if (f != -1):
                        row[zip_idx] = row[zip_idx][:f]
                    # remove remove columns
                    for c in xdels:
                        del row[int(c)]

                    line = line+1
                    writer.writerow(row)
                    sys.stdout.write('.')
                    sys.stdout.flush()
                    #print(line)


if __name__ == '__main__':
    main(sys.argv[1:])
