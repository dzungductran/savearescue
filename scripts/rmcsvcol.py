#!/usr/bin/python
#

import sys, getopt
import csv, zipcodeSearchEngine

#Get Command Line Arguments
def main(argv):
    input_file = ''
    output_file = ''
    columns=[]
    try:
        opts, args = getopt.getopt(argv,"hi:o:c:",["ifile=","ofile=","columns"])
    except getopt.GetoptError:
        print 'csv_json.py -i <path to inputfile> -o <path to outputfile> -f <dump/pretty>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'rm_csv_col.py -i <path to inputfile> -o <path to outputfile> -f <dump/pretty>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            input_file = arg
        elif opt in ("-o", "--ofile"):
            output_file = arg
        elif opt in ("-c", "--columns"):
            columns = arg.split(",")

    if not columns:
        print("please specify columns to be deleted")
        sys.exit()

    read_csv(input_file, output_file, columns)

#Read CSV File
def read_csv(input_file, output_file, columns):
    csv_rows = []
    with open(input_file, "rb") as csvfile:
        reader = csv.reader(csvfile)
        with open(output_file, "wb") as csvoutfile:
            writer = csv.writer(csvoutfile)
            for row in reader:
                for c in columns:
                    del row[int(c)]
                writer.writerow(row)

if __name__ == "__main__":
   main(sys.argv[1:])
