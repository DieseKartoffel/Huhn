import React from "react";

import {Row, Col, Button, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const zusammenfassung = (props) => {

    let ganze = 0
    let halbe = 0
    let viertel = 0
    let innereien = 0
    let gewicht = 0
    let numKunden = 0
    let numAbos = 0

    let numGewogen = 0

    let bezahlt_ganze = 0
    let bezahlt_halbe = 0
    let bezahlt_viertel = 0
    let bezahlt_innereien = 0
    let bezahlt_gewicht = 0
    let bezahlt_numKunden = 0
    let anzahl_bestellungen_bezahlt = 0

    Object.keys(props.kunden).forEach(k => {
        const kundenObj = props.kunden[k]

        console.log(kundenObj)

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

        numKunden = numKunden + 1
        ganze = ganze + kundenObj.ganze
        halbe = halbe + kundenObj.halbe
        viertel = viertel + kundenObj.viertel
        innereien = innereien + kundenObj.innereien
        numAbos = numAbos + kundenObj.abos

        let kundengewicht = 0
        let kundenzeilen = kundenObj.zeilen.length
        if (kundenObj.zeilen.length > 0) {
            kundengewicht = kundenObj.zeilen.reduce((a, b) => {
                return a + b;
            });
        }
        gewicht = gewicht + kundengewicht
        numGewogen = numGewogen + kundenzeilen

        if (kundenObj.bezahlt) {
            bezahlt_numKunden = bezahlt_numKunden + 1
            bezahlt_ganze = bezahlt_ganze + kundenObj.ganze
            bezahlt_halbe = bezahlt_halbe + kundenObj.halbe
            bezahlt_viertel = bezahlt_viertel + kundenObj.viertel
            bezahlt_innereien = bezahlt_innereien + kundenObj.innereien
            let bezahlt_kundengewicht = 0
            if (kundenObj.zeilen.length > 0) {
                bezahlt_kundengewicht = kundenObj.zeilen.reduce((a, b) => {
                    return a + b;
                });
            }
            bezahlt_gewicht = bezahlt_gewicht + bezahlt_kundengewicht
            anzahl_bestellungen_bezahlt = anzahl_bestellungen_bezahlt + kundenObj.ganze + kundenObj.halbe + kundenObj.viertel
        }

    })

    return (
            <Modal show={props.showZsmfassung} onHide={props.zusammenfassungToggle} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Zusammenfassung</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Row>
                                <Col>
                                    <h4> {ganze + halbe + viertel} bestellte Hähnchen ({numAbos.toFixed(2)} Abos)</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h5>• {ganze} ganz</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h5>• {halbe} halbiert</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h5>• {viertel} geviertelt</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h5>• {innereien} Innereien</h5>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col sm={1}></Col>
                                <Col>
                                    <h4>Ø  {((ganze + halbe + viertel) / numKunden).toFixed(2)} Hähnchen pro Kunde</h4>
                                </Col>
                            </Row> */}

                            <Row style={{"paddingTop":"35px"}}>
                                <Col>
                                    <h4> {numKunden} Kunden ( {bezahlt_numKunden}✓  {numKunden - bezahlt_numKunden}✗ )</h4>
                                </Col>
                            </Row>
                                
                            <Row style={{"paddingTop":"35px"}}>
                                <Col>
                                    <h4>{(gewicht / 1000).toFixed(2)}kg bisher abgewogen ({numGewogen} Wiegungen) </h4>
                                    <h4>{(bezahlt_gewicht / 1000 / anzahl_bestellungen_bezahlt).toFixed(2)}kg Durchschnittsgewicht</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col></Col>
                            </Row>
                            {/* <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h4>Ø { ( gewicht/1000 / (ganze + halbe + viertel)).toFixed(2) } kg pro Hähnchen </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h4>Ø { ( gewicht/1000 / numKunden).toFixed(2) } kg pro Kunde </h4>
                                </Col>
                            </Row>*/}
                            <Row>
                                <Col sm={8}/>
                                <Col>
                                    <h5>Umsatz gewogen: {((gewicht / 1000) * props.kilopreis).toFixed(2)}€</h5>
                                </Col>
                            </Row> 
                            <Row style={{"paddingTop":"15px"}}>
                                <Col>
                                    <h4>{(bezahlt_gewicht / 1000).toFixed(2)}kg bisher bereits bezahlt</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col></Col>
                            </Row>
                            {/* <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h4>Ø { ( bezahlt_gewicht/1000 / (bezahlt_ganze + bezahlt_halbe + bezahlt_viertel)).toFixed(2) } kg pro Hähnchen </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}/>
                                <Col>
                                    <h4>Ø { ( bezahlt_gewicht/1000 / bezahlt_numKunden).toFixed(2) } kg pro Kunde </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={1}></Col>
                                <Col>
                                    <h4>Ø  {((bezahlt_ganze + bezahlt_halbe + bezahlt_viertel) / bezahlt_numKunden).toFixed(2)} Hähnchen pro Kunde</h4>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col sm={8}/>
                                <Col>
                                    <h5>Umsatz bezahlt: {((bezahlt_gewicht / 1000) * props.kilopreis).toFixed(2)}€</h5>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={props.zusammenfassungToggle}>
                        Ok, Danke
                    </Button>
                    </Modal.Footer>
                </Modal>
    );
}

export default zusammenfassung
