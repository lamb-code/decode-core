import { setValueForStyles } from "./CSSPropertyOperations";
import setTextContent from "./setTextContent";

const STYLE = "style";
const CHILDREN = "children";

export function setInitialProperties() {
  setInitialDOMProperties();
}
function setInitialDOMProperties(tag, domElement, nextProps) {
  for (let propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey];
      if (propKey === STYLE) {
        setValueForStyles(domElement, nextProp);
      } else if (propKey === CHILDREN) {
        if (typeof nextProp === "string") {
          setTextContent(domElement, nextProp);
        } else if (typeof propKey === "number") {
          setTextContent(domElement, nextProp + "");
        }
      } else if (nextProp != null) {
        setValueForProperty(domElement, propKey, nextProp);
      }
    }
  }
}
