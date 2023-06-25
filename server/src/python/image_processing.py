from pytesseract import pytesseract
import numpy as np
import cv2
import urllib.request

# You need to change this path to the path specified on your computer
# after you download Tesseract OCR.
# path_to_tesseract = r"<YOUR_TESSERACT_PATH>"
path_to_tesseract = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

# Process the given image and print text in the console


def process_image(image_path):

    if 'http' in image_path:
        with urllib.request.urlopen(image_path) as url_response:
            img_array = np.asarray(
                bytearray(url_response.read()), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    else:
        img = cv2.imread(image_path)

    pytesseract.tesseract_cmd = path_to_tesseract

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply edge detection using Canny algorithm
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)

    # Find lines in the image using Hough transform
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi /
                            180, threshold=100, minLineLength=100, maxLineGap=10)

    # Find angle of the longest line detected
    max_len = 0
    angle = 0
    for line in lines:
        x1, y1, x2, y2 = line[0]
        length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        if length > max_len:
            max_len = length
            angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi

    # Rotate image to straighten the text
    center = tuple(np.array(img.shape[1::-1]) / 2)
    M = cv2.getRotationMatrix2D(center, -angle, 1.0)
    rotated = cv2.warpAffine(
        img, M, img.shape[1::-1], flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    # Apply perspective transformation to make it straight and fix any skewing
    gray_rotated = cv2.cvtColor(rotated, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray_rotated, 0, 255,
                           cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        rotated, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    # Passing the image object to image_to_string() function
    # This function will extract the text from the image
    text = pytesseract.image_to_string(rotated, lang='eng', config='--psm 6')

    return text
