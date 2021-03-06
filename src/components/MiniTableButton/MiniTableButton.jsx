import React from 'react';
import Button from "../CustomButton/CustomButton";
import { withRouter } from "react-router-dom"
const MiniTableButton = (props) => {
    return (
        <div>
            <Button type="button" onClick={props.handleClick} disable={props.disable}  className= {!props.style?"btn-fill":"cond-btn"}  >
                {props.text}
            </Button>
        </div>
    );
};

export default withRouter(MiniTableButton);