import React from "react";

import { Button, Card, Accordion} from 'react-bootstrap';
import Kunde from "./Kunde.js"
import 'bootstrap/dist/css/bootstrap.min.css';



const Kundenliste = (props) => {

    let kundenListe = []
    let kundenObjekte = []

    Object.keys(props.kunden).forEach(k => {

        let kundenObj = props.kunden[k]

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

        kundenObjekte.push(kundenObj)

    });

    console.log(kundenObjekte)
    //Order Kunden
    kundenObjekte.sort(function(a, b){
        return (parseInt(a.id.replace("kunde","")) - parseInt(b.id.replace("kunde","")))
    });   
    console.log(kundenObjekte)

    kundenObjekte.forEach((kundenObj) => {
        kundenListe.push(
            (<Kunde
                key = {kundenObj.id}
                id = {kundenObj.id}
                abos = {kundenObj.abos}
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
                customerChangeAbos={props.customerChangeAbos}
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




