// Simulate Mouse clicks on elements like Textboxes or Accordion Cards. Find elements with Queryselector and call this funtion. Just like React is supposed to be used.
const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
const simulateMouseClick = (element) => {
    mouseClickEvents.forEach(mouseEventType =>
        element.dispatchEvent(
        new MouseEvent(mouseEventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
        })
        )
    );
}

export default simulateMouseClick


