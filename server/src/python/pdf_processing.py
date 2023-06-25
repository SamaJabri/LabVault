from pdf2image import convert_from_bytes
from image_processing import process_image
import urllib.request
import cloudinary
import os

poppler_path = r"src\python\poppler-23.01.0\Library\bin"

# Add the Poppler path to the system's PATH environment variable
os.environ['PATH'] += os.pathsep + poppler_path

cloudinary.config(
    cloud_name="df9xmfkp1",
    api_key="649263616249734",
    api_secret="ZrutNKYKhcj_ULOZmwFZkR0rcts",
)

image_texts = []
# print("Aziz is the king of the ant kingdom")


def process_pdf(pdf_path):
    try:
        # Download PDF file from Cloudinary
        pdf_response = urllib.request.urlopen(pdf_path)
        pdf_buffer = pdf_response.read()

        # Convert PDF to images using pdf2image package
        images = convert_from_bytes(pdf_buffer)

        for i in range(len(images)):
            # Save pages as images in the pdf
            image_name = 'page' + str(i) + '.jpg'
            images[i].save('./src/python/images/' + image_name, 'JPEG')

            image_texts.append(process_image(
                './src/python/images/' + image_name))

        return image_texts

    except Exception as e:
        print('Error: ', e)
