import React from 'react';
import './FaceRecognition.css';

const boundingBoxes = (boxes) => {
    // console.log("BOXES",boxes);
     const divContentsFace = boxes.map((face,ix) => {
         return(
            <div key={ix}
             className="bounding-box grow" 
             style={{
             top: face.topRow, 
             right: face.rightCol, 
             bottom: face.bottomRow, 
             left: face.leftCol}}>            
             </div> 
         )
     })

     return divContentsFace;
    
}

const FaceRecognition = (props) => {
    const {imageUrl, boxes} = props;
    return(
        <div>
            <p className="f3">Faces Detected: {boxes.length}</p>
            <div className="center ma">
                <div className="absolute mt2">
                    <img id="inputImage" alt="" src={imageUrl} width="500px" height="auto" />  
                    {boundingBoxes(boxes)}                
                </div>                       
            </div>
        
        </div>

    );
}

export default FaceRecognition;