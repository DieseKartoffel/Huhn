from flask import Flask
from flask import request, jsonify, send_from_directory,  render_template
from flask_cors import CORS
import os, sys
import win32print
import json
import sqlite3



app = Flask(__name__)

# dir of the server
# determine if application is a script file or frozen exe
if getattr(sys, 'frozen', False):
    application_path = os.path.dirname(sys.executable)
elif __file__:
    application_path = os.path.dirname(__file__)
# static folder must exist in the dir
app._static_folder = os.path.join(application_path, "static")
print(app._static_folder)
CORS(app) # will allow cross origin access headers

@app.route("/available-periods", methods = ['GET', 'POST'])
def available_periods():
    name_list = os.listdir("./database")
    full_list = [os.path.join("./database",i) for i in name_list]
    time_sorted_list = sorted(full_list, key=os.path.getmtime)
    databases = [db.split("\\")[-1].replace(".db","") for db in time_sorted_list if ".db" in db]
    databases.reverse()
    return json.dumps(databases)

@app.route("/create-new-period", methods = ['POST'])
def new_period():
    json_data = request.json
    period_name = json_data["periodName"]

    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500

    databases = " ".join(os.listdir("./database"))

    if period_name in databases:
        return "Already exists", 500
    
    conn = sqlite3.connect("./database/{}.db".format(period_name))
    
    # Create table
    conn.execute('''CREATE TABLE allgemein
                (kilopreis NUMERIC, ersterTag TEXT, zweiterTag TEXT)''')
    
    conn.execute('''CREATE TABLE kunden
                (kundenid INTEGER PRIMARY KEY, jsonfile TEXT)''')
    
    c = conn.cursor()
    c.execute('INSERT INTO allgemein (kilopreis, ersterTag, zweiterTag) VALUES (?, ? ,?)',
               (10, "Erster Tag", "Zweiter Tag") )

    conn.commit()
    conn.close()
    return "New Database created!", 200


@app.route("/get-full-period", methods = ['POST'])
def get_full_period():
    json_data = request.json
    period_name = json_data["periodName"]

    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500

    conn = sqlite3.connect("./database/{}.db".format(period_name))
    c = conn.cursor()

    c.execute("SELECT * FROM kunden")
    kunden_rows = c.fetchall()
    
    kunden = {}
    for row in kunden_rows:
        kunde_json = json.loads(row[1])
        kunde_json["id"] = "kunde{}".format(row[0])
        kunden["kunde{}".format(row[0])] = kunde_json


    print(kunden)

    c.execute("SELECT * FROM allgemein")
    allgemein_row = c.fetchall()[0]
    print(allgemein_row)

    conn.commit()
    conn.close()

    return {"kilopreis":allgemein_row[0], "ersterTag":allgemein_row[1], "zweiterTag":allgemein_row[2], "kunden":kunden}, 200 



@app.route("/create-customer", methods = ['POST'])
def create_customer():
    json_data = request.json
    period_name = json_data["periodName"]
    new_customer = {"name": "Neuer Kunde", "abosDay1":0, "abosDay2":0, "abosDay3":0, "ganze": 0, "halbe": 0, "viertel": 0, "innereien": 0, "abholung": 0, "notiz": "", "bezahlt": False, "zeilen": []}
    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500 

    print(json.dumps(new_customer))

    conn = sqlite3.connect("./database/{}.db".format(period_name))
    c = conn.cursor()
    c.execute('INSERT INTO kunden (jsonfile) VALUES (?)',
               (json.dumps(new_customer),) )
    new_id = c.lastrowid
    conn.commit()
    conn.close()

    return json.dumps({"newID":new_id}), 200 

@app.route("/update-customer", methods = ['POST'])
def update_customer():
    json_data = request.json

    print(json_data)

    period_name = json_data["periodName"]

    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500 

    customer_id = json_data["customerId"]
    updated_customer = json_data["customer"]

    conn = sqlite3.connect("./database/{}.db".format(period_name))
    c = conn.cursor()

    c.execute('UPDATE kunden SET jsonfile = ? WHERE kundenID = ?',
               (json.dumps(updated_customer),customer_id) )
    conn.commit()
    conn.close()

    print(f"Updated ID {customer_id} with data")
    print(json.dumps(updated_customer, indent=2))

    return "Customer updated", 200

@app.route("/delete-customer", methods = ['POST'])
def delete_customer():
    json_data = request.json
    print(json_data)
    period_name = json_data["periodName"]
    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500 
    customer_id = json_data["customerId"]

    print("CUSTOMER ID DELETE ", customer_id)

    conn = sqlite3.connect("./database/{}.db".format(period_name))
    c = conn.cursor()
    c.execute('DELETE from kunden WHERE kundenID = ?',
               (customer_id,) )
    conn.commit()
    conn.close()
    return "Customer deleted", 200

@app.route("/update-settings", methods = ['POST'])
def update_period_settings():
    json_data = request.json
    print(json_data)
    period_name = json_data["periodName"]
    if period_name == None or len(period_name) < 1:
        return "Bad/No period name given", 500 
    settings = json_data["settings"]

    conn = sqlite3.connect("./database/{}.db".format(period_name))
    c = conn.cursor()

    for key, val in settings.items():
        print(key, val)
        c.execute('UPDATE allgemein SET '+key+' = ? WHERE rowid = 1',
             (val,) )

    conn.commit()
    conn.close()
    return "Settings Updated", 200


@app.route("/print", methods = ['POST'])
def to_printer():

    json_data = request.json
    print(json_data)
    
    if len(json_data["name"]) > 15:
        json_data["name"] = json_data["name"].replace(" ","\n")

    text = "\n\n\n\n\n\n\n\n Vielen Dank für Ihren Einkauf :-) \n \n \n {} \n------------------\n \n \n Gewicht: \n         {} gramm \n Preis: \n \n         {} EUR \n----------------\n \n {} \n \n".format(json_data['date'], json_data['gewicht'], format(json_data["preis"], ".2f"),  json_data['name'])
    
    printer_name = win32print.GetDefaultPrinter ()
    hPrinter = win32print.OpenPrinter (printer_name)

    if sys.version_info >= (3,):
        raw_data = bytes(text, encoding="latin-1")
    else:
        raw_data = text
    try:
        hJob = win32print.StartDocPrinter (hPrinter, 1, ("Hähnchenprogramm", None, "TEXT"))
        try:
            win32print.StartPagePrinter (hPrinter)
            win32print.WritePrinter (hPrinter, raw_data)
            win32print.EndPagePrinter (hPrinter)
        finally:
            win32print.EndDocPrinter (hPrinter)
    finally:
        win32print.ClosePrinter (hPrinter)
    
    return "Success", 200


@app.route('/')
def home():  # At the same home function as before
    return app.send_static_file('index.html')  # Return index.html from the static folder

if __name__ == "__main__":
    os.system("start \"\" http://127.0.0.1:5000/")
    app.run(port='5000')
    
