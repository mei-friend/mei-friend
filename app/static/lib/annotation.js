import { v } from './main.js'; 
import { convertCoords } from './utils.js';

let annotations = [];

export function addAnnotationHandlers() { 
// TODO extend this to allow app to consume (TROMPA-style) Annotation Toolkit descriptions
  
  const annotationHandler = (e) => { 
    console.log("Clicked to make new annotation!", e);
    console.log("Selected elements: ", v.selectedElements);
    switch (e.target.getAttribute("id")) { 
      case 'annotateHighlight':
        createHighlight(e);
        break;
      case 'annotateCircle':
        createCircle(e);
        break;
      case 'annotateLink':
        createLink(e);
        break;
      case 'annotateDescribe':
        createDescribe(e);
        break;
      default:
        console.warn("Don't have a handler for this type of annotation", e);
    }
    refreshAnnotations();
  }

  const refreshAnnotations = () => { 
    // clear rendered annotations container
    const rac = document.getElementById("renderedAnnotationsContainer");
    rac.innerHTML = "";
    // reset annotations-containing svg
    const scoreSvg = document.querySelector(".verovio-panel svg");
    const annoSvg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    annoSvg.setAttribute("width", scoreSvg.getAttribute("width"))
    annoSvg.setAttribute("height", scoreSvg.getAttribute("height"))
    annoSvg.setAttribute("id", "renderedAnnotationsSvg");
    annoSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    annoSvg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
    console.log("rac: ", rac);
    rac.appendChild(annoSvg);
    // drawing handlers can draw into renderedAnnotationsSvg if they need to
    annotations.forEach(a => {
      if("type" in a) { 
        switch(a.type) { 
          case 'annotateHighlight':
            drawHighlight(a);
            break;
          case 'annotateCircle':
            drawCircle(a);
            break;
          case 'annotateLink':
            drawLink(a);
            break;
          case 'annotateDescribe':
            drawDescribe(a);
            break;
          default:
            console.warn("Don't have a drawing function for this type of annotation", a);
        }
      } else { 
        console.warn("Skipping annotation without type: ", a);
      }
    });
  }

  // functions to create annotations
  const createHighlight = (e) =>   
    annotations.push({"type": "annotateHighlight", "selection": v.selectedElements});
  const createCircle = (e) => 
    annotations.push({"type": "annotateCircle", "selection": v.selectedElements});
  const createDescribe = (e => {
    // TODO improve!
    const desc = window.prompt("Please enter a textual description to apply");
    annotations.push(
      { "type": "annotateDescribe", "selection": v.selectedElements, "description": desc }
    );
  })
  const createLink = (e => {
    // TODO improve!
    const url = window.prompt("Please enter a url to link to");
    annotations.push(
      { "type": "annotateLink", "selection": v.selectedElements, "url": url }
    );
  })
  // functions to draw annotations
  const drawHighlight = (a) => {
    if("selection" in a) { 
      const els = a.selection.map(s => document.getElementById(s));
      els.forEach(e => e.classList.add("annotationHighlight"));
    } else { 
      console.warn("failing to draw highlight annotation without selection: ", a);
    }
  }
  const drawCircle = (a) => { 
    if("selection" in a) { 
      // mission: draw an ellipse into the raSvg that encompasses a collection of selection objects
      let raSvg= document.querySelector('#renderedAnnotationsSvg');
      // find bounding boxes of all selected elements on page:
      const bboxes = a.selection.map(s => convertCoords(document.getElementById(s)));
      // determine enveloping bbox
      const minX = Math.min(...bboxes.map((b) => b.x));
      const minY = Math.min(...bboxes.map((b) => b.y));
      const maxX2 = Math.max(...bboxes.map((b) => b.x2));
      const maxY2 = Math.max(...bboxes.map((b) => b.y2));
      // now create our ellipse
      const ellipse = document.createElementNS("http://www.w3.org/2000/svg","ellipse")
      ellipse.setAttribute("cx", (minX + maxX2)/2)
      ellipse.setAttribute("cy", (minY + maxY2)/2)
      // Add padding so we don't circle too tightly -- but not too much!
      const paddedRx = Math.min((maxX2-minX)/1.6, maxX2-minX + 20)
      const paddedRy = Math.min((maxY2-minY)/1.3, maxY2-minY + 20)
      ellipse.setAttribute("rx", paddedRx)
      ellipse.setAttribute("ry", paddedRy)
      ellipse.classList.add("highlightEllipse");
      raSvg.appendChild(ellipse);
    } else { 
      console.warn("Failing to draw circle annotation without selection: ", a);
    }

  }
  const drawDescribe = (a) => { 
    if("selection" in a && "description" in a) { 
      const els = a.selection.map(s => document.getElementById(s));
      els.forEach(e => { 
        e.classList.add("annotationDescribe");
        // create a title element within the described element to house the description (which will be available on hover)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.innerHTML = a.description;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
      });
    } else { 
      console.warn("Failing to draw describe annotation missing selection and/or description: ", a);
    }
  }

  const drawLink = (a) => { 
    if("selection" in a && "url" in a) { 
      const els = a.selection.map(s => document.getElementById(s));
      els.forEach(e => { 
        e.classList.add("annotationLink");
        // create a title element within the linked element to house the url (which will be available on hover)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.innerHTML = "Open in new tab: " + a.url;
        // slot it in as the first child of the selected element
        e.insertBefore(title, e.firstChild);
        // make the element clickable
        e.addEventListener("click", () => window.open(a.url, "_blank"), true);
      });
    } else { 
      console.warn("Failing to draw link annotation missing selection and/or url: ", a);
    }
  }

  document.querySelectorAll(".annotationToolsIcon").forEach(a => a.removeEventListener("click", annotationHandler));
  document.querySelectorAll(".annotationToolsIcon").forEach(a => a.addEventListener("click", annotationHandler));
}

export const clearAnnotations = () => annotations = [];
