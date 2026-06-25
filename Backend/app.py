from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
from werkzeug.utils import secure_filename
import math

app = Flask(__name__)
CORS(app)

BUS_CAPACITY = 40

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["RESULT_FOLDER"] = RESULT_FOLDER

model=YOLO("yolov8n.pt")

V_CLASSES={"person", "car", "bicycle", "motorcycle"}

#capacity of vehicles
CAP={"person": 1,"car": 3, "motorcycle": 2, "bicycle": 1}

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(image_path)

    img=cv2.imread(image_path)
    if img is None:
        return jsonify({"error": "Could not read image"}), 400

    results=model(img) #model run kia yhapr

    ct= {"person": 0, "car": 0, "motorcycle": 0, "bicycle": 0 }

    annotated_img= img.copy()

    for result in results:
        names = result.names

        for box in result.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = names[cls_id]
            conf = float(box.conf[0].item())

            if conf<0.30:
                continue

            if cls_name in V_CLASSES:
                ct[cls_name]+= 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                label = f"{cls_name} {conf:.2f}"
                cv2.putText(
                    annotated_img,
                    label,
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2
                )

    est= (ct["person"]*CAP["person"]+ct["car"]*CAP["car"]+ct["motorcycle"]*CAP["motorcycle"]+ct["bicycle"]*CAP["bicycle"])

    buses_required= math.ceil(est/BUS_CAPACITY) if est>0 else 0

    cv2.putText(
        annotated_img,
        f"Estimated People: {est}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        3
    )

    cv2.putText(
        annotated_img,
        f"Buses Required: {buses_required}",
        (20, 80),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 0, 0),
        3
    )

    result_filename = f"annotated_{filename}"
    result_path = os.path.join(app.config["RESULT_FOLDER"], result_filename)
    cv2.imwrite(result_path, annotated_img)

    return jsonify({
        "class_wise_count": ct,
        "estimated_people": est,
        "bus_capacity": BUS_CAPACITY,
        "buses_required": buses_required,
        "image_url": f"http://127.0.0.1:5000/results/{result_filename}"
    })

@app.route("/results/<filename>")
def get_result_image(filename):
    return send_from_directory(app.config["RESULT_FOLDER"], filename)

if __name__ == "__main__":
    app.run(debug=True)