from imutils import face_utils
import numpy as np
import argparse
import imutils
import dlib
import cv2
import os.path


def analyze(img):
    outputArray = []
    detector = dlib.get_frontal_face_detector()
    predictor_path = 'shape_predictor_68_face_landmarks.dat'
    predictor = dlib.shape_predictor(predictor_path)

    image = cv2.imread(img)
    image = imutils.resize(image, width=500)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    rects = detector(gray, 1)

    for (i, rect) in enumerate(rects):
        # determine the facial landmarks for the face region, then
        # convert the facial landmark (x, y)-coordinates to a NumPy
        # array
        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)

        # convert dlib's rectangle to a OpenCV-style bounding box
        # [i.e., (x, y, w, h)], then draw the face bounding box
        (x, y, w, h) = face_utils.rect_to_bb(rect)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # show the face number
        cv2.putText(image, "Face #{}".format(i + 1), (x - 10, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # loop over the (x, y)-coordinates for the facial landmarks
        # and draw them on the image
        index = 1
        coordsArray = []
        for (x, y) in shape:
            # print("Point: " + str(index) + "   " +
            #      "x: " + str(x) + " ,y: " + str(y))
            index += 1
            coords = tuple([x, y])
            coordsArray.append(coords)
            
            cv2.circle(image, (x, y), 1, (0, 0, 255), -1)

        distances = [((x1 - x2)**2 + (y1 - y2)**2)**0.5
                     for (x1, y1) in coordsArray for (x2, y2) in coordsArray]
        sum_of_distances = sum(
            x1/x2 for x1 in distances for x2 in distances if x1 != x2 and x2 != 0)
        point_37=coordsArray[36]
        point_40=coordsArray[39]
        left_eye_length = ((point_37[0] - point_40[0])**2 + (point_37[1] - point_40[1])**2)**0.5
        print(f"Left eye length is: {left_eye_length}")

        right_eye_length = calc_distance(coordsArray,43,46)
        eye_distance = calc_distance(coordsArray,40,43)
        nose_length = calc_distance(coordsArray,28,34)
        left_eyebrow = calc_distance(coordsArray,18,22)
        right_eyebrow = calc_distance(coordsArray,23,27)
        mouth_length = calc_distance(coordsArray,49,55)
        
        print(f"Right eye length is: {right_eye_length}")
        print(f"Distance between eyes: {eye_distance}")
        print(f"Nose length is: {nose_length}")
        print(f"Left eyebrow is: {left_eyebrow}")
        print(f"Right eyebrow is: {right_eyebrow}")
        print(f"Nose length is: {nose_length}")
        print(f"Mouth length is: {mouth_length}")
        
        score = sum_of_distances/1000000
        print(score)


        
        outputArray.append(score)
        outputArray.append(right_eye_length)
        outputArray.append(left_eye_length)
        outputArray.append(eye_distance)
        outputArray.append(right_eyebrow)
        outputArray.append(left_eyebrow)
        outputArray.append(nose_length)
        outputArray.append(mouth_length)

        

    # return cv2.imshow("Output", image)
    print(outputArray)
    if not outputArray:
        return "Could not process image"
    else:
        return outputArray
    #return outputArray

def calc_distance(array,p1,p2):
        point_a = array[p1-1]
        point_b = array[p2-1]
        distance = ((point_a[0] - point_b[0])**2 +
                    (point_a[1] - point_b[1])**2)**0.5
        return distance
