import React, {useState, useEffect, useRef} from "react";
import chicken_full from "../assets/chicken_full.png"
import chicken_half from "../assets/chicken_half.png"
import chicken_quart from "../assets/chicken_quart.png"
import paid from "../assets/paid.png"
import unpaid from "../assets/unpaid.png"
import simulateMouseClick from "../utils/EventSimulator.js"
import { Row, Col,Button, ButtonGroup, ToggleButton, Card, Accordion, Table, Form, FormControl, Modal, InputGroup} from 'react-bootstrap';


// Components:

const Kundeninfo = (props) => {

    const [name, setName] = useState(props.name);

    const [abos, setAbos] = useState(parseFloat(props.abos));

    const [checked, setChecked] = useState(props.bezahlt); // Bezahlt / Nicht Bezahlt

    // const [deleteShow, setDeleteShow] = useState(false);
    // const handleDeleteClose = () => setDeleteShow(false);
    // const handleDeleteShow = () => setDeleteShow(true);

    const saveCustomerName = () => {
        props.customerChangeName(props.id, name)
    }

    const saveCustomerAbos = () => {
        props.customerChangeAbos(props.id, parseFloat(abos))
    }

    // const deleteButtonClicked = () => {
    //     handleDeleteClose()
    //     props.customerDelete(props.id)
    // }

    const handleBezahlt = (bool) => {
        console.log(bool)
        setChecked(bool)
        props.customerBezahlt(props.id, bool)
    }

    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.charCode === 13) {
            saveCustomerName();
            saveCustomerAbos();
        }
    };

    return (
        <Row>
            <Col lg={2}>
                <InputGroup.Prepend>
                    <InputGroup.Text>Name</InputGroup.Text>
                    <FormControl
                        value={name === "Neuer Kunde" ? "" : name}
                        placeholder="Max Mustermann"
                        onChange={e => setName(e.target.value)}
                        onBlur={saveCustomerName}
                        onKeyPress={handleKeypress}
                        id={"nameInput_"+props.id}
                    />
                </InputGroup.Prepend>
            </Col>

            <Col lg={2}>
                <InputGroup.Prepend>
                    <InputGroup.Text>Abo</InputGroup.Text>
                    <FormControl
                        style={{"width":"35%"}}
                        value={abos}
                        placeholder="0"
                        type="number" 
                        onChange={e => setAbos(e.target.value)}
                        onBlur={saveCustomerAbos}
                        onKeyPress={handleKeypress}
                        id={"aboInput_"+props.id}
                    />
                </InputGroup.Prepend>
            </Col>

            <Col sm={5}/>

                <ButtonGroup toggle>
                    <ToggleButton 
                        style={{"marginRight":"20px"}}
                        size="lg"
                        type="checkbox"
                        variant="info"
                        checked={checked}
                        value="1"
                        onChange={(e) => handleBezahlt(e.currentTarget.checked)}
                    >
                        ↻ Bezahlt
                    </ToggleButton>
                </ButtonGroup>


            {/* <Col sm={3}>
                <Button variant="danger" className="float-right" onClick={handleDeleteShow}>{props.name} permanent entfernen</Button>
            </Col>
            <Modal show={deleteShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title>Achtung</Modal.Title>
                </Modal.Header>
                <Modal.Body><h4>Möchtest du {name} wirklich entfernen?</h4></Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleDeleteClose}>
                    Ups, nein!
                </Button>
                <Button variant="danger" onClick={deleteButtonClicked}>
                    Ja, sicher!
                </Button>
                </Modal.Footer>
            </Modal> */}
        </Row>
       
    )
}


const Bestellung = (props) => {

    const [ganze, setGanze] = useState(props.ganze);
    const [halbe, setHalbe] = useState(props.halbe);
    const [viertel, setViertel] = useState(props.viertel);
    const [innereien, setInnereien] = useState(props.innereien);
    const [abholung, setAbholung] = useState(props.abholung);
    const [notiz, setNotiz] = useState(props.notiz);

    const setAbholungHanlder = (e) => {
        if (e === props.bezErsterTag){
            setAbholung(1)
        }else{
            setAbholung(2)
        }
    }
    
    const saveButtonClicked = (e) => {
        e.preventDefault();

        const nums = [parseInt(ganze), parseFloat(halbe), parseFloat(viertel), parseInt(innereien)]
        let error = false
        nums.forEach((num) => {
            if (isNaN(num)){
                alert("Eingabefeld invalide. Nur Zahlen eingetragen?")
                error = true
            }
        })
        
        if(error){
            return
        }



        props.customerOrderChanged(
            props.id, 
            {
                "ganze":parseInt(ganze),
                "halbe":parseFloat(halbe),
                "viertel":parseFloat(viertel),
                "innereien":parseInt(innereien),
                "abholung":abholung,
                "notiz":notiz,
            }, 
            saveButtonCallback
        )
    }

    const saveButtonCallback = () => {
        console.log("Server accepted")
    }

    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.charCode === 13) {
            saveButtonClicked(e)
        }
    };


    return (
        
        <Form>
            {/* <FormGroup role="form"> */}
            <h4>Bestellung:</h4>
            <Row>
                < Col lg={2} style={{"paddingTop": "8px"}}>
                    <Form.Row>
                        <Form.Label><h5>Abholung:</h5></Form.Label>
                        <Col lg={6}>
                            <Form.Control as="select" value={(abholung === 1) ? props.bezErsterTag : props.bezZweiterTag} onChange={e => setAbholungHanlder(e.target.value)} 
                            onBlur={e => saveButtonClicked(e)}>
                                <option >{props.bezErsterTag}</option>
                                <option >{props.bezZweiterTag}</option>
                            </Form.Control>
                        </Col>
                    </Form.Row>
                </Col>
                <Col  lg={10} style={{"paddingTop": "8px"}}>
                    <Form.Row>
                        <Col lg={1} style={{"marginLeft": "0px"}}>
                            <Form.Control style={{"WebkitAppearance": "none", "margin":"0", "MozAppearance":"textfield"}} xs={2} type="number" step="1" value={ganze} onChange={e => setGanze(e.target.value)} 
                            onBlur={e => saveButtonClicked(e)} onKeyPress={handleKeypress}/>
                        </Col>
                        <Form.Label lg={2} style={{"paddingTop": "0px"}}>
                            <img src={chicken_full} alt="Ganze" width="40"></img>
                        </Form.Label>

                        <Col lg={1} style={{"marginLeft": "0px"}}>
                            <Form.Control style={{"WebkitAppearance": "none", "margin":"0", "MozAppearance":"textfield"}}  xs={2} size="xs" type="number" step="0.5" value={halbe} onChange={e => setHalbe(e.target.value)}  
                            onBlur={e => saveButtonClicked(e)} onKeyPress={handleKeypress}/>
                        </Col>
                        <Form.Label lg={2} style={{"paddingTop": "0px"}}>
                            <img src={chicken_half} alt="Halbe" width="40"></img>
                        </Form.Label>

                        <Col lg={1} style={{"marginLeft": "0px"}} >
                            <Form.Control style={{"WebkitAppearance": "none", "margin":"0", "MozAppearance":"textfield"}} xs={2} size="xs" type="number" step="0.5" value={viertel} onChange={e => setViertel(e.target.value)}  
                            onBlur={e => saveButtonClicked(e)} onKeyPress={handleKeypress}/>
                        </Col>
                        <Form.Label lg={2} xs={2} style={{"paddingTop": "0px"}}>
                            <img src={chicken_quart} alt="Viertel" width="40"></img>
                        </Form.Label>
                        <Form.Label style={{"marginLeft":"50px"}}><h5>Innereien:</h5></Form.Label>
                        
                        <Col lg={1} style={{"paddingRight": "15px"}}>
                            <Form.Control type="number" xs={3} step="1" value={innereien} onChange={e => setInnereien(e.target.value)} style={{"WebkitAppearance": "none", "margin":"0", "MozAppearance":"textfield"}}  
                            onBlur={e => saveButtonClicked(e)} onKeyPress={handleKeypress}/>
                        </Col>
                        
                        <Col lg={4}>
                            <Form.Control as="textarea" rows={1} 
                            value={notiz.length > 1 ? notiz : undefined}
                            placeholder={notiz.length > 1 ? undefined : "Notiz eintragen"}
                            // placeholder={(props.notiz && props.notiz.length > 1) ? props.notiz : "Notiz eintragen" } 
                            onBlur={e => saveButtonClicked(e)}
                            onChange={e => setNotiz(e.target.value)}
                            />
                        </Col>
                       {/* <Col lg={1}>
                            <Button type="submit" className="float-right" onClick={saveButtonClicked}>Speichern</Button>
                        </Col> */}

                    </Form.Row>
                </Col>
            </Row>
        </Form>
    )
}


const VerkaufZeile = (props) => {

    const [show, setShow] = useState(false);
    const kundenZeileModal = useRef(null)

    const handleDrucken = () => {
        props.customerZeilePrint(props.id,  props.index)
        handleClose()
    }

    const handleClose = () => {
        setShow(false)
    }
    const handleShow = () => setShow(true);
    const handleLöschen = (e) => {
        handleClose()
        props.customerZeileRemoved(props.id, props.index)
    }

    const today = new Date();
    

    return (
        <>
        <Modal ref={kundenZeileModal} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Verkaufszeile {props.index+1}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center"  id={props.kunde+"_"+props.index+1}>
                
                <Row>
                    <Col>
                        <h5><u>{(today.getDate() +"."+ (today.getMonth()+1) + "."  +today.getFullYear())}</u></h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>{props.name}</h4>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <h4> {props.gramm} gramm </h4>
                    </Col>
                </Row>
                
                <Row>
                    <Col>
                        <h2><b> {(props.gramm / 1000 * props.kilopreis).toFixed(2).replace(".",",")}€  </b></h2>
                    </Col>
                </Row>



                
                <Row>
                    <Col>
                        <p><i> Wir wünschen guten Appetit!</i> 😋 </p>
                    </Col>
                </Row>


            </Modal.Body>
            <Modal.Footer>

            <Button variant="danger" onClick={handleLöschen}>
                Zeile Löschen
            </Button>
            <Button variant="primary" onClick={handleDrucken}>
                Drucken
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                Abbrechen
            </Button>
            </Modal.Footer>
        </Modal>
        <tr onClick={handleShow}  style={{cursor:'pointer'}}>
            <td>{props.index+1}</td>
            <td>{props.gramm.toLocaleString('de-DE') +" g"}</td>
            <td>{(props.gramm * (props.kilopreis/1000)).toFixed(2).toLocaleString('de-DE')+" €" }</td>
        </tr>
        </>
    )

}

const Verkauf = (props) => {

    // const [checked, setChecked] = useState(props.bezahlt); // Bezahlt / Nicht Bezahlt
    const [show, setShow] = useState(false); //Modal to add new Row
    const [grammInput, setGrammInput] = useState(NaN);

    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);

    const deleteButtonClicked = () => {
        handleDeleteClose()
        props.customerDelete(props.id)
    }

    const handleClose = () => {
        setGrammInput(NaN)
        setShow(false);
    }
    const handleShow = () => {
        setGrammInput(NaN)
        setShow(true)

        
        setTimeout(()=>{
            var element = document.getElementById("grammInput");
            element.focus()
        }, 100);
        
    }

    const handleNeueZeile = (e) => {
        // console.log(e)

        let doPrint = e


        if (isNaN(grammInput)){
            alert("Du kannst hier Zahlen eingeben.")
            return
        }
        const convGramm = parseInt(grammInput)
        handleClose()
        props.customerZeileAdded(
            props.id, 
            convGramm,
            doPrint //doPrint
        )
        setGrammInput(NaN)
    }

    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.charCode === 13) {
            handleNeueZeile(true);
        }
    };

    // const handleBezahlt = (bool) => {
    //     console.log(bool)
    //     setChecked(bool)
    //     props.customerBezahlt(props.id, bool)
    // }


    let zeilenListe = []

    props.zeilen.forEach((gramm, i) => {
        zeilenListe.push(
            (<VerkaufZeile
                key={props.id + "_" + i}
                id={props.id}
                name={props.name}
                gramm={gramm}
                index={i}
                kilopreis={props.kilopreis}
                customerZeileRemoved={props.customerZeileRemoved}
                customerZeilePrint={props.customerZeilePrint}
            />
            )
        )
    });


    return (
        <Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Neue Verkaufszeile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup size="lg">
                            <Form.Control id="grammInput" type="number"  placeholder="Gramm"  step="1" onChange={e => setGrammInput(e.target.value)} onKeyPress={handleKeypress}/>
                            {/* </InputGroup.Prepend>InputGroup.Text type="number" id="inputGroup-sizing-lg" onChange={e => setGrammInput(e.target.value)}>Gramm</InputGroup.Text> */}
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                     <Button variant="secondary" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" onClick={() => handleNeueZeile(false)}>
                        Speichern
                    </Button>
                    <Button variant="primary" onClick={() => handleNeueZeile(true)}>
                        Speichern und Drucken
                    </Button>
                </Modal.Footer>
            </Modal>    
            <Col sm={6}>
            <h4>Verkauf:</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="col-xs-11">#</th>
                            <th>Gewicht</th>
                            <th>Preis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zeilenListe}
                    </tbody>
                </Table>
                <Row className="justify-content-md-center">
                    <Button onClick={handleShow}>+ Neue Zeile</Button>
                </Row>
            </Col>
            <Col>

                <Col sm={6} style={{"position":"absolute", "bottom": "10px", "right":"10px"}}>
                    <Button variant="danger" className="float-right" 
                        onClick={handleDeleteShow}
                        >{props.name} permanent entfernen
                    </Button>
                </Col>


                <Modal show={deleteShow} onHide={handleDeleteClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Achtung</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><h4>Möchtest du {props.name} wirklich entfernen?</h4></Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleDeleteClose}>
                        Ups, nein!
                    </Button>
                    <Button variant="danger" onClick={deleteButtonClicked}>
                        Ja, sicher!
                    </Button>
                    </Modal.Footer>
                </Modal>

            </Col>

            
        </Row>
    )
}

const Kunde = (props) => {

    let tagesString ="Unbekannt"

    if (props.abholung === 1){
        tagesString = props.bezErsterTag  //Place Freitag/Samstag here based on user setting
    }else if (props.abholung === 2){
        tagesString = props.bezZweiterTag
    }

    let gewichtSum = props.zeilen.reduce((a, b) => a + b, 0)

    // If the row that was just created is a new one, open it with onclick simulation
    useEffect(() => {
        console.log(props)
        if (props.id === props.neusteKundenId && props.name === "Neuer Kunde"){
            const element = document.querySelector("div[id='"+props.id+"']");
            if (element){
                simulateMouseClick(element);
                setTimeout(() => {
                    const input = document.getElementById("nameInput_"+props.id)
                    input.focus()
                    // TODO: Set neueste KundenID to None after opening once.
                }, 300);
            }   
        }
    })


    return(
        <Card>
            <Accordion.Toggle id={props.id} as={Card.Header} variant="link" eventKey={props.id} style={{cursor:'pointer'}}>
                <Row>
                    <Col lg={2}>
                        <h4><span>{props.name} ({(parseFloat(props.ganze)+parseFloat(props.halbe)+parseFloat(props.viertel))})</span></h4>
                        {props.abos > 0 ? <h6>Abo: {props.abos}</h6> : null}
                    </Col>
                    <Col lg={1}>
                        <p>Abholung:</p><p> <span style={{"fontWeight": "bold"}}>{tagesString}</span></p>
                    </Col>
                    <Col lg={2} xs={12}>
                        <Row style={{"paddingTop":"20px"}}>
                            <Col lg={2} xs={2} style={{"textAlign":"right", "padding":"0px"}}>
                                <span style={{"fontWeight": "bold"}}>{props.ganze}</span>
                            </Col>
                            <Col lg={2} xs={2}>
                                <img src={chicken_full} height="35" alt="Ganze"></img>
                            </Col>

                            <Col lg={2}  xs={2}  style={{"textAlign":"right", "padding":"0px"}}>
                                <span style={{"fontWeight": "bold"}}>{props.halbe}</span>
                            </Col>
                            <Col lg={2}  xs={2}>
                                <img src={chicken_half} height="35" alt="Halbe"></img>
                            </Col>
                            <Col lg={2}  xs={2}  style={{"textAlign":"right", "padding":"0px"}}>
                                <span style={{"fontWeight": "bold"}}>{props.viertel}</span>
                            </Col>
                            <Col lg={2} xs={2}>
                                <img src={chicken_quart} height="35" alt="Viertel"></img>
                            </Col>
                        </Row>
                    </Col>

                    <Col lg={1} style={{"paddingLeft":"45px", "textAlign":"center"}}>
                        <p>Innereien:</p><p> <span style={{"fontWeight": "bold"}}>{props.innereien}</span></p>
                    </Col>
                    <Col lg={2} >
                        <p>Notiz:</p><p> <span style={{"fontWeight": "bold", "color":"red"}}>{props.notiz}</span></p>
                    </Col>
                    <Col lg={1}>
                        <p>Gewicht:</p><p> <span style={{"fontWeight": "bold"}}>{gewichtSum.toLocaleString('de-DE')+" g" }</span></p>
                    </Col>
                    <Col lg={1}>
                        <p>Summe:</p><p> <span style={{"fontWeight": "bold"}}>{(gewichtSum * (props.kilopreis/1000)).toFixed(2).toLocaleString('de-DE') + " €"}</span></p>
                    </Col>
                    <Col lg={1}>
                        <p>Bezahlt: </p> {props.bezahlt?<img src={paid} alt="Ja" width="33"></img>:<img src={unpaid} alt="Nein" width="30"></img>}
                    </Col>

                </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.id}>
                <Card.Body>
                    <Kundeninfo {...props}/>
                    <Row style={{"marginBottom":"15px"}}></Row>
                    <Bestellung {...props}/>
                    <hr/>
                    <Verkauf {...props}/>
            </Card.Body>
        </Accordion.Collapse>
        </Card>
    )
}

export default Kunde;