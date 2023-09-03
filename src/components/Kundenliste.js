import React from "react";

import { Button, Card, Accordion} from 'react-bootstrap';
import Kunde from "./Kunde.js"
import 'bootstrap/dist/css/bootstrap.min.css';



const Kundenliste = (props) => {

    let kundenListe = []
    let kundenObjekte = []

    Object.keys(props.kunden).forEach(k => {

        let kundenObj = props.kunden[k]

        if ('abos' in kundenObj) { // support databses that used old "only single day abo -> move abos to day 1"
            kundenObj.abosDay1 = kundenObj.abos;
            kundenObj.abosDay2 = 0;
            kundenObj.abosDay3 = 0;
            delete kundenObj.abos;
        }

        if (props.sucheingabe !== "" && !props.kunden[k].name.toLowerCase().includes(props.sucheingabe.toLowerCase())){
            return // same as continue
        }

        if (props.tagesFilter !== 0 && props.kunden[k].abholung !== props.tagesFilter){
            return
        }

        const bezahltInt = props.kunden[k].bezahlt ? 1 : 2

        if (props.bezahltFilter !== 0 && bezahltInt !== props.bezahltFilter){
            return
        }

        if (props.bezahltFilter !== 0 && bezahltInt !== props.bezahltFilter){
            return
        }

        kundenObjekte.push(kundenObj)

    });

    // console.log(kundenObjekte)
    //Order Kunden
    // kundenObjekte.sort(function(a, b){
    //     console.log(a, b)
    //     return (parseInt(a.id.replace("kunde","")) - parseInt(b.id.replace("kunde","")))
    // });   

    kundenObjekte.sort((a, b) => {
        if (a.name === "Neuer Kunde") return 1;  // Push "Neuer Kunde" to the end
        if (b.name === "Neuer Kunde") return -1; // Pull other values before "Neuer Kunde"
        return a.name.localeCompare(b.name);     // Regular comparison for other values
    });
    

    // console.log(kundenObjekte)

    kundenObjekte.forEach((kundenObj) => {
        kundenListe.push(
            (<Kunde
                key = {kundenObj.id}
                id = {kundenObj.id}
                abosDay1 = {kundenObj.abosDay1 || 0}
                abosDay2 = {kundenObj.abosDay2 || 0}
                abosDay3 = {kundenObj.abosDay3 || 0}
                neusteKundenId = {props.neusteKundenId}
                name={kundenObj.name}
                viertel={kundenObj.viertel} 
                halbe={kundenObj.halbe} 
                ganze={kundenObj.ganze}
                innereien={kundenObj.innereien}
                gewicht={kundenObj.gewicht}
                notiz={kundenObj.notiz}
                preis={kundenObj.preis} 
                abholung={kundenObj.abholung} 
                bezahlt={kundenObj.bezahlt} 
                zeilen={kundenObj.zeilen}
                customerOrderChanged={props.customerOrderChanged}
                customerZeileAdded={props.customerZeileAdded}
                customerZeilePrint={props.customerZeilePrint}
                customerZeileRemoved={props.customerZeileRemoved}
                customerBezahlt={props.customerBezahlt}
                customerChangeName={props.customerChangeName}
                customerChangeAbosDay1={props.customerChangeAbosDay1}
                customerChangeAbosDay2={props.customerChangeAbosDay2}

                customerChangeAbosDay3={props.customerChangeAbosDay3}
            
                customerDelete={props.customerDelete}
                kilopreis={props.kilopreis}
                bezErsterTag={props.bezErsterTag}
                bezZweiterTag={props.bezZweiterTag}
                />
            )
        )

    })


    return (
        <Accordion style={{"padding": "30px", "paddingTop":"120px"}}>
            {kundenListe}
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="neu" onClick={props.customerAddNew}>
                        Neuen Kunden hinzufügen
                    </Accordion.Toggle>
                </Card.Header>
            </Card>
            <div style={{"textAlign": "center", "padding":"20px"}}>
                        <Button variant="primary" onClick={props.exportCSV}>Periode als CSV exportieren</Button>{' '}
            </div>
        </Accordion>

    )
}



const kundenübersicht = (props) => {
  return (
    <div>
        <Kundenliste {... props}/>
    </div>

  );
}

export default kundenübersicht;




