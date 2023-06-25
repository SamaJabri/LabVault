import os
import shutil
from image_processing import process_image
from pdf_processing import process_pdf
import sys

# Get the file from Node.js
file = sys.argv[1]


def define_file_type(file):
    if file.endswith('.jpg' or '.jpeg' or '.png'):
        print('image')
        return process_image(file)
    elif file.endswith('.pdf'):
        print('pdf')
        return process_pdf(file)
    else:
        print('File extension not supported')


# Call this function and pass the uploaded file to it
text = define_file_type(file)

# Use the shutil.rmtree() method to delete all files and sub-directories inside the folder
shutil.rmtree('./src/python/images/')
# shutil.rmtree('./src/python/data/')

# Use the os.mkdir() method to create an empty folder with the same name
os.mkdir('./src/python/images/')
# os.mkdir('./src/python/data/')
print("text: ", text)
# Open the file for writing
with open('file.txt', 'w') as f:
    # Use a for loop to write each line of data to the file
    for line in text:
        f.write(line)


print(type(text))
