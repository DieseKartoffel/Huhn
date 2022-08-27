import React, {Component} from "react";
import Navbar from "../components/Navbar.js"
import Kundenübersicht from "../components/Kundenliste.js"
import Zusammenfassung from "../components/Zusammenfassung.js"
import axios from 'axios';

import { Container } from 'react-bootstrap';




class Huhn extends Component {
    constructor(props){
        super(props)
        this.state = {
            "neusteKundenId":null,


            "aktivePeriode":"",
            "perioden":[],
            "showZsmfassung":false,
            "sucheingabe":"",
            "tagesFilter": 0, // 0 = all days, 1 = day one, 2 = day two
            "bezahltFilter": 0, // 0 = all, 1 = only paid, 2 = only not_paid
            
            "kunden": {
                },


            "kilopreis":0, 
            "ersterTag":"Noch nicht geladen",
            "zweiterTag":"Noch nicht geladen",
        }     
    }

    updateCustomerInDB = (kundenID, callback) => {
        //After setState is done, this will run:
        const customerID = parseInt(kundenID.replace("kunde",""))
        let clone = {}; // the new empty object
        // let's copy all user properties into it
        for (let key in this.state["kunden"][kundenID]) {
            if (key !== "id"){
                clone[key] = this.state["kunden"][kundenID][key];
            }
        }
        axios.post('http://127.0.0.1:5000/update-customer', {"periodName":this.state.aktivePeriode, "customerId":customerID, "customer":clone})
        .then(
        function (response) {
            console.log(response)
        }).catch(function (error) {
            console.log(error);
        });
    }

    
    componentDidMount = () => {
        const self = this;
        axios.get('http://127.0.0.1:5000/available-periods')
          .then(function (response) {

                console.log(response)
                self.setState({"perioden":response.data})
                self.periodChangeHandle(response.data[0])
                
          })
          .catch(function (error) {
                console.log(error);
          });
    }

    
    newPeriodCreate = (periode) => {
        const self = this
        if (this.state["perioden"].includes(periode)){
            alert("Periode existiert bereits")
            return false
        }
        axios.post('http://127.0.0.1:5000/create-new-period', {"periodName":periode})
        .then(
        function (response) {
            self.setState((prevState) => {
                prevState["aktivePeriode"] = periode
                prevState["perioden"].push(periode)
                return prevState
            })
            self.periodChangeHandle(periode)
        }).catch(function (error) {
              console.log(error);
        });
        return true
    }

    customerZeileAdded = (kundenID, newValues, doPrint) => {
        this.setState((prevState) => {
            prevState["kunden"][kundenID]["zeilen"].push(parseFloat(newValues))
            let gewichtSum = prevState["kunden"][kundenID]["zeilen"].reduce((a, b) => a + b, 0)
            prevState["kunden"][kundenID]["gewicht"] = parseFloat(gewichtSum)
            prevState["kunden"][kundenID]["preis"] = gewichtSum * (prevState["kilopreis"]/1000)
            if (doPrint){
                this.customerZeilePrint(kundenID, prevState["kunden"][kundenID]["zeilen"].length-1)
            }
            return prevState
        }, () => {
           this.updateCustomerInDB(kundenID)
        })
    }

    customerZeilePrint = (kundenID, zeile) => {

        const today = new Date();
        const datestring = (today.getDate() +"."+ (today.getMonth()+1) + "."  +today.getFullYear())
        const values = {"date":datestring, 
                        "name":this.state["kunden"][kundenID]["name"], 
                        "gewicht":this.state["kunden"][kundenID]["zeilen"][zeile],
                        "preis": this.state["kunden"][kundenID]["zeilen"][zeile] * (this.state["kilopreis"]/1000)}

        axios.post('http://127.0.0.1:5000/print', values)
        .then(
        function (response) {
            console.log(response)
        }).catch(function (error) {
            console.log(error);
        });
    }

    customerOrderChanged = (kundenID, newValues, callback) => {
        this.setState((prevState) => {
            for (const [key, value] of Object.entries(newValues)) {
                prevState["kunden"][kundenID][key] = value
            }
            return prevState
        }, () => {
            this.updateCustomerInDB(kundenID, callback)
         })
    }

    customerZeileRemoved = (kundenID, zeilenIndex) => {
        console.log("DEL ROW ", kundenID)
        this.setState((prevState) => {
            prevState["kunden"][kundenID]["zeilen"].splice(zeilenIndex, 1)
            let gewichtSum = prevState["kunden"][kundenID]["zeilen"].reduce((a, b) => a + b, 0)
            prevState["kunden"][kundenID]["gewicht"] = parseFloat(gewichtSum)
            prevState["kunden"][kundenID]["preis"] = gewichtSum * (prevState["kilopreis"]/1000)

            return prevState
        }, () => {
            this.updateCustomerInDB(kundenID)
         })
    }

    customerBezahlt = (kundenID, bool) => {
        this.setState((prevState) => {
            prevState["kunden"][kundenID]["bezahlt"]=bool
            return prevState
        }, () => {
            this.updateCustomerInDB(kundenID)
         })
    }

    customerChangeName = (kundenID, name) => {
        this.setState((prevState) => {

            prevState["kunden"][kundenID]["name"]=name

            return prevState
        }, () => {
            this.updateCustomerInDB(kundenID)
         })

    }

    customerAddNew = () => {

        const self = this
        axios.post('http://127.0.0.1:5000/create-customer', {"periodName":this.state.aktivePeriode})
        .then(
        function (response) {
            const newID = "kunde"+response.data["newID"]
            self.setState((prevState) => {
                prevState["neusteKundenId"]=newID
                prevState["sucheingabe"] = ""
                prevState["tagesFilter"] = 0
                prevState["bezahltFilter"] = 0
                prevState["kunden"][newID] = 
                    {
                        "id":newID,
                        "name":"Neuer Kunde",
                        "ganze":0,
                        "halbe":0,
                        "viertel":0,
                        "innereien":0,
                        "abholung":1,
                        "notiz":"",
                        "bezahlt":false,
                        "zeilen":[]
                    }
                return prevState
            })
        }).catch(function (error) {
              console.log(error);
        });
        

    }


    customerDelete = (kundenID) => {
        this.setState((prevState) => {
            delete prevState["kunden"][kundenID]
            return prevState
        })
        const customer_id = parseInt(kundenID.replace("kunde",""))
        axios.post('http://127.0.0.1:5000/delete-customer', {"periodName":this.state.aktivePeriode, "customerId":customer_id})
        .then(
            function (response) {
                console.log(response)
            }
        )
    }



    settingsSave = (kilopreis, bezErsterTag, bezZweiterTag) => {
        this.setState((prevState) => {
            prevState["kilopreis"] = kilopreis
            prevState["ersterTag"] = bezErsterTag
            prevState["zweiterTag"] = bezZweiterTag
            return prevState
        }, () => {
            axios.post('http://127.0.0.1:5000/update-settings', 
                {"periodName":this.state.aktivePeriode, 
                 "settings":{
                        "kilopreis":this.state.kilopreis,
                        "ersterTag":this.state.ersterTag,
                        "zweiterTag":this.state.zweiterTag
                    }
                }).then(function (response) {
                    console.log(response)
                })
                .catch(function (error) {
                      console.log(error);
                });
         })

    }

    periodChangeHandle = (periode) => {
        const self = this
        axios.post('http://127.0.0.1:5000/get-full-period', {"periodName":periode})
        .then(function (response) {
            console.log(response)
            self.setState(response.data)
            self.setState({"aktivePeriode":periode})
        })
        .catch(function (error) {
              console.log(error);
        });
    }

    filterSearchstringHandle = (str) => {
        this.setState((prevState) => {
            prevState["sucheingabe"] = str
            return prevState
        })
    }

    filterTagHandle = (num) => {
        this.setState((prevState) => {
            console.log(num)
            prevState["tagesFilter"] = num
            return prevState
        })
    }

    filterBezahltHandle = (num) => {
        this.setState((prevState) => {
            prevState["bezahltFilter"] = num
            return prevState
        })
    }

    zusammenfassungHandle = () => {
        this.setState({"showZsmfassung": !this.state.showZsmfassung })
    }







    render(){
        return (
            <Container fluid>
                <Zusammenfassung
                    showZsmfassung={this.state["showZsmfassung"]}
                    zusammenfassungToggle={this.zusammenfassungHandle}
                    kunden={this.state.kunden}
                    kilopreis={this.state.kilopreis}
                    sucheingabe={this.state.sucheingabe}
                    tagesFilter={this.state.tagesFilter}
                    bezahltFilter={this.state.bezahltFilter}/>
                <Navbar
                    perioden = {this.state.perioden}
                    aktivePeriode = {this.state.aktivePeriode}
                    periodChangeHandle = {this.periodChangeHandle}
                    bezErsterTag = {this.state.ersterTag}
                    bezZweiterTag = {this.state.zweiterTag}
                    kilopreis={this.state.kilopreis} 
                    settingsSave={this.settingsSave}
                    filterSearchstringHandle = {this.filterSearchstringHandle}
                    filterTagHandle = {this.filterTagHandle}
                    filterBezahltHandle = {this.filterBezahltHandle}
                    zusammenfassungHandle = {this.zusammenfassungHandle}
                    newPeriodCreate={this.newPeriodCreate}
                />
                
                
                <Kundenübersicht 
                    kunden={this.state.kunden}
                    neusteKundenId={this.state.neusteKundenId}
                    
                    kilopreis={this.state.kilopreis} 
                    bezErsterTag = {this.state.ersterTag}
                    bezZweiterTag = {this.state.zweiterTag}

                    sucheingabe={this.state.sucheingabe}
                    tagesFilter = {this.state.tagesFilter}
                    bezahltFilter = {this.state.bezahltFilter}

                    customerOrderChanged={this.customerOrderChanged} 
                    customerZeileAdded={this.customerZeileAdded}
                    customerZeilePrint={this.customerZeilePrint}
                    customerZeileRemoved={this.customerZeileRemoved}
                    customerBezahlt={this.customerBezahlt}
                    customerChangeName={this.customerChangeName}
                    customerAddNew={this.customerAddNew}
                    customerDelete={this.customerDelete}
                />
            </Container>
        );
    }
}

export default Huhn