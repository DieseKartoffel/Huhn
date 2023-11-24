import React, {useState, useRef} from "react";

import { Navbar, Nav, NavDropdown, Form, FormControl, InputGroup, Button, Modal, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const MyNavbar = (props) => {

  const [showNewPeriodModal, setShowNewPeriodModal] = useState(false);
  const handleCloseNewPeriodModal = () => setShowNewPeriodModal(false);
  const handleShowNewPeriodModal = () => setShowNewPeriodModal(true);

  const perioden = props.perioden.map((periode) => {
    return (<NavDropdown.Item key={periode} onClick={(e) => props.periodChangeHandle(e.target.text)}>{periode}</NavDropdown.Item>)
  })

  const [settingsShow, setSettingsShow] = useState(false)
  const [kilopreis, setKilopreis] = useState(props.kilopreis);

  const [ersterTag, setErsterTag] = useState(props.bezErsterTag);
  const [zweiterTag, setZweiterTag] = useState(props.bezZweiterTag);

  const [bezahltDropdownTitle, setBezahltDropdownTitle] = useState("Bezahlt: Alle")
  const [tagDropdownTitle, setTagDropdownTitle] = useState("Tage: Alle")

  const d = new Date();
  const month = d.getMonth();
  const year = d.getFullYear();

  const [newPeriodenName, setNewPeriodenName] = useState(month + "_" + year)

  const saveNewPeriod = () => {
    if (props.newPeriodCreate(newPeriodenName)){
      handleCloseNewPeriodModal()
    }
  }

  let suchfeld = useRef(null);

  const suchfilterInput = (e) => {
    props.filterSearchstringHandle(e)
  }

  const clearSuchfilter = () => {
    suchfilterInput("")
    suchfeld.current.value = ""
    suchfeld.current.focus()

  }

  const filterBezahltHandleInput = (e) => {
    if (e.includes("Alle")){
      setBezahltDropdownTitle("Bezahlt: Alle")
      props.filterBezahltHandle(0)
    }else if (e.includes("Nicht")){
      setBezahltDropdownTitle("Bezahlt: Nur Nicht Bezahlte")
      props.filterBezahltHandle(2)
    }else{
      setBezahltDropdownTitle("Bezahlt: Nur Bezahlte")
      props.filterBezahltHandle(1)
    }
  }

  const filterTagHandleInput = (e) => {
    if (e.includes("Alle")){
      setTagDropdownTitle("Tage: Alle")
      props.filterTagHandle(0)
    }else if (e.includes(ersterTag)){
      setTagDropdownTitle("Tage: Nur "+ersterTag)
      props.filterTagHandle(1)
    }else{
      setTagDropdownTitle("Tage: Nur "+zweiterTag)
      props.filterTagHandle(2)
    }
  }

  const settingsClicked = () => {
    setKilopreis(props.kilopreis)
    setErsterTag(props.bezErsterTag)
    setZweiterTag(props.bezZweiterTag)
    setSettingsShow(true);}
  const settingsClose = () => {
    setKilopreis(props.kilopreis)
    setErsterTag(props.bezErsterTag)
    setZweiterTag(props.bezZweiterTag)
    setSettingsShow(false);
  }
  
  const settingsSave = () => {
    props.settingsSave(kilopreis, ersterTag, zweiterTag)
    setSettingsShow(false);
  }


  
  return (
    <>

      <Modal size={"lg"} show={showNewPeriodModal} onHide={handleCloseNewPeriodModal}>
        <Modal.Header closeButton>
          <Modal.Title>Neue Periodendatenbank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <h5>Periodenname / Datenbank: </h5>
            </Col>
            <Col>
              <InputGroup>
                <FormControl type="text" value={newPeriodenName} onChange={e => setNewPeriodenName(e.target.value)}/>
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewPeriodModal}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={saveNewPeriod}>
            Erstellen
          </Button>
        </Modal.Footer>
      </Modal>

    <Modal size="lg" show={settingsShow} onHide={settingsClose}>
            <Modal.Header closeButton>
            <Modal.Title>Einstellungen</Modal.Title>
            </Modal.Header>
            <div style={{"padding":"25px"}}>
              <Row>
                <Col>
                  <h5>Kilopreis</h5>
                </Col>
                <Col>
                  <Form.Control  size="lg" large="true" column="xs" xs={2} type="number" step="0.1" value={kilopreis} onChange={e => setKilopreis(e.target.value)}/>
                </Col>
              </Row>
              
              <hr></hr>
              
              <Row>
                <Col sm={5}>
                  <h5>Bezeichnung Tag 1:</h5>
                  </Col>
                <Col sm={7}>
                  <FormControl
                        placeholder="Erster Tag"
                        value={ersterTag}
                        onChange={e => setErsterTag(e.target.value)}
                  />
                </Col>
              </Row>

              <Row>
                <Col sm={5}>
                  <h5>Bezeichnung Tag 2:</h5>
                </Col>
                <Col sm={7}>
                  <FormControl
                        placeholder="Zweiter Tag"
                        value={zweiterTag}
                        onChange={e => setZweiterTag(e.target.value)}
                  />
                </Col>
              </Row>
              </div>
            <Modal.Footer>
            <Button variant="secondary" onClick={settingsClose}>
                Abbrechen
            </Button>
            <Button variant="primary" onClick={settingsSave}>
                Speichern
            </Button>
            </Modal.Footer>
    </Modal>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" >
    <Navbar.Brand >Hähnchenprogramm</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <NavDropdown title={"Periode: "+props.aktivePeriode} id="basic-nav-dropdown">
          {perioden}
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleShowNewPeriodModal}>Neue Periode</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={tagDropdownTitle} onClick={() => {setKilopreis(props.kilopreis); setErsterTag(props.bezErsterTag); setZweiterTag(props.bezZweiterTag)}} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={e => filterTagHandleInput(e.target.text)}>Alle Tage</NavDropdown.Item>
          <NavDropdown.Item onClick={e => filterTagHandleInput(e.target.text)}>Nur {props.bezErsterTag}</NavDropdown.Item>
          <NavDropdown.Item onClick={e => filterTagHandleInput(e.target.text)}>Nur {props.bezZweiterTag}</NavDropdown.Item>
        </NavDropdown>

        <NavDropdown title={bezahltDropdownTitle} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={e => filterBezahltHandleInput(e.target.text)}>Alle Anzeigen</NavDropdown.Item>
          <NavDropdown.Item onClick={e => filterBezahltHandleInput(e.target.text)}>Nur Bezahlte</NavDropdown.Item>
          <NavDropdown.Item onClick={e => filterBezahltHandleInput(e.target.text)}>Nur Nicht Bezahlte</NavDropdown.Item>
        </NavDropdown>
        <Nav.Link onClick={props.zusammenfassungHandle}>Zusammenfassung</Nav.Link>
        <Nav.Link onClick={settingsClicked}>Einstellungen</Nav.Link>

        </Nav>
        
        <Col sm={3}>
        <InputGroup size="md">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-sm">Suche</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="text" ref={suchfeld} aria-describedby="inputGroup-sizing-sm" onChange={e => suchfilterInput(e.target.value)}/>
          <Button onClick ={() => clearSuchfilter()}>{"<<"}</Button>
        </InputGroup>
        </Col>
    </Navbar.Collapse>
    </Navbar>
    </>
  );
}

export default MyNavbar;




